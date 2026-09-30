/**
 * WHATSAPP CLOUD API - OFFICIAL WEBHOOK ROUTE
 * URL de Devolución de Llamada de WhatsApp API
 * Endpoint: /api/webhooks/whatsapp
 *
 * GET  - Validación del webhook por Meta (hub.mode, hub.verify_token, hub.challenge)
 * POST - Recepción de eventos en tiempo real:
 *        - Estatus de entrega (sent, delivered, read, failed)
 *        - Respuestas de botones interactivos (Quick Replies) y mensajes de prospectos
 */

import { NextResponse } from 'next/server';
import { getPool, updateLeadDeliveryStatus, incrementBatchMetric } from '@/lib/salesEngineDb.js';
import { emitAdminEvent } from '@/lib/salesEngineEvents.js';

// Tokens válidos para verificación
const VALID_VERIFY_TOKENS = [
  process.env.WHATSAPP_VERIFY_TOKEN,
  process.env.WA_VERIFY_TOKEN,
  process.env.SECRETO_META,
  'rose_sales_engine_token_2026',
  '6dba3d8be08b3e4317c298f7dca783fe',
].filter(Boolean);

/**
 * Normaliza número para búsqueda flexible por los últimos 10 dígitos
 */
function extractLast10Digits(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  return digits.slice(-10);
}

// ──────────────────────────────────────────────────────────────────────────────
// GET: Verificación de Webhook para Meta Developers Console
// ──────────────────────────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log(`[WhatsApp Webhook GET] Modo: ${mode}, Token recibido: ${token ? '***' : 'ninguno'}`);

  if (mode === 'subscribe' && token && VALID_VERIFY_TOKENS.includes(token)) {
    console.log('[WhatsApp Webhook] ✅ Verificación exitosa de Meta para WhatsApp Cloud API.');
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  console.warn('[WhatsApp Webhook] ❌ Verificación fallida: token no coincide.');
  return new Response('Verificación rechazada. Token inválido.', { status: 403 });
}

// ──────────────────────────────────────────────────────────────────────────────
// POST: Procesamiento de Eventos de Mensajería (Status y Respuestas)
// ──────────────────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();

    // Confirmación inmediata a Meta para evitar retries
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const pool = getPool();
    const entries = body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        if (!value) continue;

        // 1. Procesar Actualizaciones de Estado (sent, delivered, read, failed)
        const statuses = value.statuses || [];
        for (const st of statuses) {
          const recipientPhone = st.recipient_id;
          const metaStatus = (st.status || '').toLowerCase();
          const last10 = extractLast10Digits(recipientPhone);

          if (!last10) continue;

          let mappedStatus = null;
          if (metaStatus === 'delivered') mappedStatus = 'DELIVERED';
          else if (metaStatus === 'read') mappedStatus = 'READ';
          else if (metaStatus === 'failed') mappedStatus = 'FAILED';
          else if (metaStatus === 'sent') mappedStatus = 'SENT';

          if (mappedStatus) {
            // Buscar lead por teléfono
            const { rows: leads } = await pool.query(
              `SELECT id FROM vcard_crm_leads WHERE phone_whatsapp LIKE $1 LIMIT 1`,
              [`%${last10}`]
            );

            if (leads.length > 0) {
              const leadId = leads[0].id;
              const { rows: batchRel } = await pool.query(
                `SELECT batch_id FROM marketing_batch_leads WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 1`,
                [leadId]
              );
              if (batchRel.length > 0) {
                await updateLeadDeliveryStatus(batchRel[0].batch_id, leadId, 'whatsapp', mappedStatus);
              }
            }
          }
        }

        // 2. Procesar Mensajes Entrantes y Respuestas Interactivas (Quick Replies)
        const messages = value.messages || [];
        for (const msg of messages) {
          const senderPhone = msg.from;
          const last10 = extractLast10Digits(senderPhone);
          let responseText = '';

          if (msg.type === 'interactive') {
            responseText = msg.interactive?.button_reply?.title || msg.interactive?.button_reply?.id || 'Botón interactivo';
          } else if (msg.type === 'button') {
            responseText = msg.button?.text || msg.button?.payload || 'Botón de respuesta';
          } else if (msg.type === 'text') {
            responseText = msg.text?.body || 'Mensaje de texto';
          } else {
            responseText = `Mensaje tipo ${msg.type}`;
          }

          if (last10) {
            const { rows: leads } = await pool.query(
              `SELECT id, first_name, last_name, company_name, email FROM vcard_crm_leads WHERE phone_whatsapp LIKE $1 LIMIT 1`,
              [`%${last10}`]
            );

            if (leads.length > 0) {
              const lead = leads[0];
              const leadName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Prospecto';

              // Actualizar estatus del lead en el CRM
              await pool.query(
                `UPDATE vcard_crm_leads SET status = 'CONTACTED' WHERE id = $1 AND status != 'CONVERTED'`,
                [lead.id]
              );

              // Buscar relación con el lote
              const { rows: batchRel } = await pool.query(
                `SELECT batch_id FROM marketing_batch_leads WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 1`,
                [lead.id]
              );

              if (batchRel.length > 0) {
                const batchId = batchRel[0].batch_id;
                await updateLeadDeliveryStatus(batchId, lead.id, 'whatsapp', 'REPLIED');
                await incrementBatchMetric(batchId, 'whatsapp_replied');
              }

              // Emitir alerta en vivo al panel administrativo de Javier Gallardo vía SSE
              emitAdminEvent('WHATSAPP_LEAD_REPLIED', {
                leadId: lead.id,
                leadName,
                company: lead.company_name,
                email: lead.email,
                phone: senderPhone,
                reply: responseText,
                timestamp: new Date().toISOString(),
                message: `💬 ${leadName} (${lead.company_name || 'Empresa'}) respondió a WhatsApp: "${responseText}"`,
                priority: 'HIGH'
              });

              console.log(`[WhatsApp Webhook] ✅ Respuesta registrada de ${leadName}: "${responseText}"`);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error('[WhatsApp Webhook POST] Error procesando evento:', err.message);
    // Devolvemos 200 para que Meta no reintente en bucle en caso de error interno no recuperable
    return NextResponse.json({ status: 'error', message: err.message }, { status: 200 });
  }
}
