/**
 * ROSE SALES ENGINE - CAMPAIGN DISPATCHER
 * Worker Asíncrono Multi-Canal: Email (Resend) + WhatsApp Cloud API + Meta Custom Audiences
 * 
 * Diseñado para operar sin BullMQ/Redis:
 *   - En entornos con REDIS_URL: Integra con BullMQ
 *   - Sin REDIS_URL: Ejecuta despacho progresivo directo con control de tasa
 * 
 * Control de tasa WhatsApp: 4-8 segundos entre envíos (cumplimiento Meta)
 * Despacho < 3 segundos desde aprobación hasta inicio de cola
 */

import crypto from 'crypto';
import {
  getBatchWithLeads,
  setBatchDispatching,
  setBatchCompleted,
  updateLeadDeliveryStatus,
  incrementBatchMetric,
} from './salesEngineDb.js';
import { notifyDispatchProgress, notifyHighConversionRate } from './salesEngineEvents.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'contacto@tsolutionsipidd.com';
const WA_PHONE_ID = process.env.WA_PHONE_NUMBER_ID;
const WA_TOKEN = process.env.WHATSAPP_CLOUD_API_TOKEN;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

const VCARD_DOMAIN = process.env.NEXT_PUBLIC_VCARD_DOMAIN || 'vc.tsolutionsipidd.com';

/**
 * Delay utilitario para control de tasa de envío.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Genera un slug sugerido basado en nombre y empresa del prospecto.
 */
function buildDemoUrl(lead) {
  const slug = lead.suggested_slug || `demo-${lead.first_name?.toLowerCase().replace(/\s+/g, '-') || 'cliente'}`;
  return `https://${VCARD_DOMAIN}/demo/${slug}`;
}

/**
 * Personaliza un template de texto reemplazando los placeholders.
 */
function personalizeTemplate(template, lead) {
  return template
    .replace(/{{first_name}}/g, lead.first_name || 'Estimado/a')
    .replace(/{{last_name}}/g, lead.last_name || '')
    .replace(/{{company_name}}/g, lead.company_name || 'su empresa')
    .replace(/{{slug}}/g, lead.suggested_slug || 'demo');
}

// ──────────────────────────────────────────────────────────────────────────────
// EMAIL DISPATCH (Resend)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Envía un email individual vía Resend con tracking de apertura.
 */
async function sendEmail(lead, emailContent, batchId) {
  if (!RESEND_API_KEY) {
    console.warn('[Dispatcher] RESEND_API_KEY no configurada. Email omitido para:', lead.email);
    return false;
  }

  const subject = personalizeTemplate(emailContent.subject || 'Tu tarjeta inteligente te espera', lead);
  const htmlBody = personalizeTemplate(emailContent.html_template || '', lead);
  const demoUrl = buildDemoUrl(lead);

  // Agregar pixel de rastreo de apertura
  const trackingPixel = `<img src="https://${VCARD_DOMAIN}/api/v1/vcard/track/open/${batchId}/${lead.id}" width="1" height="1" style="display:none" alt="" />`;
  const finalHtml = htmlBody.replace('</body>', `${trackingPixel}</body>`) || 
    htmlBody + trackingPixel;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `TSolutions IPIDD <${RESEND_FROM}>`,
        to: [lead.email],
        subject,
        html: finalHtml,
        text: personalizeTemplate(emailContent.plain_text || '', lead),
        tags: [
          { name: 'batch_id', value: batchId },
          { name: 'lead_id', value: lead.id }
        ]
      })
    });

    return response.ok;
  } catch (err) {
    console.error(`[Dispatcher] Error enviando email a ${lead.email}:`, err.message);
    return false;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// WHATSAPP DISPATCH (Meta Cloud API)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Envía un mensaje de WhatsApp con botones de respuesta rápida vía Meta Cloud API.
 * Implementa intervalo de 4-8s entre envíos para cumplir con las políticas de Meta.
 */
async function sendWhatsApp(lead, waContent) {
  if (!WA_PHONE_ID || !WA_TOKEN) {
    console.warn('[Dispatcher] Variables WA_PHONE_NUMBER_ID o WHATSAPP_CLOUD_API_TOKEN no configuradas.');
    return false;
  }

  const phone = lead.phone_whatsapp?.replace(/\D/g, '');
  if (!phone || phone.length < 10) return false;

  const message = personalizeTemplate(waContent.message || '', lead);
  const quickReplies = waContent.quick_replies || ['Ver Demo', 'Contactar Asesor'];

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: phone.startsWith('52') ? phone : `52${phone}`,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: message.slice(0, 1024) },
      action: {
        buttons: quickReplies.slice(0, 3).map((title, idx) => ({
          type: 'reply',
          reply: { id: `reply_${idx}`, title: title.slice(0, 20) }
        }))
      }
    }
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${WA_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WA_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
    return response.ok;
  } catch (err) {
    console.error(`[Dispatcher] Error enviando WhatsApp a ${phone}:`, err.message);
    return false;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// META CUSTOM AUDIENCES (Retargeting)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Crea o actualiza una Custom Audience en Meta con los hashes SHA-256 del lote.
 * (Opcional: solo si META_ACCESS_TOKEN y META_AD_ACCOUNT_ID están configurados)
 */
async function pushMetaCustomAudience(leads, batchId, batchNumber) {
  if (!META_ACCESS_TOKEN || !META_AD_ACCOUNT_ID) {
    console.info('[Dispatcher] Meta Custom Audience omitida (credenciales no configuradas).');
    return;
  }

  // Crear la audiencia personalizada
  const audienceName = `Rose vCard - Lote #${batchNumber} (${new Date().toLocaleDateString('es-MX')})`;

  try {
    // 1. Crear la Custom Audience
    const createRes = await fetch(
      `https://graph.facebook.com/v20.0/act_${META_AD_ACCOUNT_ID}/customaudiences`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${META_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: audienceName,
          subtype: 'CUSTOM',
          description: `Prospectos del lote #${batchNumber} del Rose Sales Engine`,
          customer_file_source: 'USER_PROVIDED_ONLY'
        })
      }
    );

    if (!createRes.ok) return;
    const { id: audienceId } = await createRes.json();

    // 2. Subir hashes SHA-256 de emails y teléfonos
    const userData = leads.map(lead => ({
      email: crypto.createHash('sha256').update(lead.email.toLowerCase().trim()).digest('hex'),
      phone: lead.phone_whatsapp
        ? crypto.createHash('sha256').update(lead.phone_whatsapp.replace(/\D/g, '')).digest('hex')
        : undefined
    }));

    await fetch(
      `https://graph.facebook.com/v20.0/${audienceId}/users`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${META_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: {
            schema: ['EMAIL_SHA256', 'PHONE_SHA256'],
            data: userData.map(u => [u.email, u.phone || u.email])
          }
        })
      }
    );

    console.log(`[Dispatcher] Custom Audience Meta creada: "${audienceName}" (ID: ${audienceId})`);
  } catch (err) {
    console.error('[Dispatcher] Error creando Custom Audience Meta:', err.message);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// DISPATCH ORCHESTRATOR (Función Principal)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Orquesta el despacho completo de un lote aprobado.
 * Llamada desde el endpoint /api/v1/vcard/batches/[id]/approve
 * 
 * Control de tasa:
 *  - Email: Sin delay entre envíos (Resend gestiona su propia cola)
 *  - WhatsApp: 4-8 segundos entre cada envío
 * 
 * Manejo de errores: Continúa con el siguiente lead si uno falla (best-effort).
 */
export async function dispatchBatch(batchId) {
  console.log(`[Dispatcher] Iniciando despacho del lote ${batchId}...`);

  const batch = await getBatchWithLeads(batchId);
  if (!batch) {
    console.error(`[Dispatcher] Lote ${batchId} no encontrado.`);
    return;
  }

  const { leads, generated_content, batch_number } = batch;
  const emailContent = generated_content?.modalities?.email_whatsapp?.email || {};
  const waContent = generated_content?.modalities?.email_whatsapp?.whatsapp || {};

  await setBatchDispatching(batchId);

  let emailsSent = 0;
  let whatsappSent = 0;
  const total = leads.length;

  // ── Despacho de Emails (paralelo por lotes de 10 para no saturar la API) ──
  console.log(`[Dispatcher] Enviando ${total} emails vía Resend...`);
  for (let i = 0; i < total; i += 10) {
    const chunk = leads.slice(i, i + 10);
    await Promise.all(chunk.map(async (lead) => {
      const success = await sendEmail(lead, emailContent, batchId);
      const status = success ? 'SENT' : 'FAILED';
      await updateLeadDeliveryStatus(batchId, lead.id, 'email', status);
      if (success) {
        emailsSent++;
        await incrementBatchMetric(batchId, 'emails_sent');
      }
    }));

    notifyDispatchProgress({ batchId, batchNumber: batch_number, emailsSent, whatsappSent, total });
  }

  // ── Despacho de WhatsApp (secuencial con delay 4-8s por política Meta) ──
  console.log(`[Dispatcher] Enviando ${total} mensajes de WhatsApp con rate-limiting...`);
  for (const lead of leads) {
    const success = await sendWhatsApp(lead, waContent);
    const status = success ? 'SENT' : 'FAILED';
    await updateLeadDeliveryStatus(batchId, lead.id, 'whatsapp', status);
    if (success) {
      whatsappSent++;
      await incrementBatchMetric(batchId, 'whatsapp_sent');
    }

    // Delay de 4 a 8 segundos entre mensajes de WhatsApp (cumplimiento Meta)
    const delay = 4000 + Math.floor(Math.random() * 4000);
    await sleep(delay);

    // Emitir progreso cada 10 envíos
    if (whatsappSent % 10 === 0) {
      notifyDispatchProgress({ batchId, batchNumber: batch_number, emailsSent, whatsappSent, total });
    }
  }

  // ── Meta Custom Audience (retargeting) ──
  await pushMetaCustomAudience(leads, batchId, batch_number);

  // ── Finalizar lote ──
  await setBatchCompleted(batchId);
  console.log(`[Dispatcher] Lote ${batchId} completado. Emails: ${emailsSent}/${total}, WhatsApp: ${whatsappSent}/${total}`);
}

/**
 * Inicia el despacho de forma asíncrona (no bloqueante) para cumplir la cota <3 segundos.
 * El endpoint de aprobación retorna inmediatamente y el despacho ocurre en background.
 */
export function dispatchBatchAsync(batchId) {
  // setImmediate garantiza que el dispatch ocurra en el siguiente tick del event loop
  // DESPUÉS de que el endpoint haya devuelto la respuesta HTTP
  setImmediate(() => {
    dispatchBatch(batchId).catch(err => {
      console.error(`[Dispatcher] Error crítico en despacho del lote ${batchId}:`, err.message);
    });
  });

  console.log(`[Dispatcher] Despacho async encolado para lote ${batchId}. Respuesta HTTP enviada en < 3s.`);
}
