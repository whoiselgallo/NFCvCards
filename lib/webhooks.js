/**
 * Motor de Webhooks Integrado para TSolutions vCards / ROSE Card
 * Permite enviar eventos en tiempo real (p.ej. lead_submit) a HubSpot, Salesforce, Zapier, Make o Webhooks genéricos.
 */

import { getPool } from './db';

/**
 * Dispara una notificación por Webhook a todos los endpoints configurados
 * @param {string} event - Nombre del evento ('lead_submit', 'card_event', 'vcf_download')
 * @param {Object} payload - Objeto con los datos del evento
 */
export async function dispatchWebhook(event, payload) {
  try {
    const pool = getPool();
    
    // Consultar webhooks activos en la base de datos o variables de entorno
    const res = await pool.query(
      `SELECT * FROM webhooks WHERE is_active = true AND (event_type = $1 OR event_type = '*')`,
      [event]
    );

    const webhooks = res.rows || [];

    // Si no hay webhooks en la BD, verificar webhook global por variable de entorno
    const globalWebhookUrl = process.env.GLOBAL_WEBHOOK_URL;
    if (globalWebhookUrl) {
      webhooks.push({
        url: globalWebhookUrl,
        secret: process.env.GLOBAL_WEBHOOK_SECRET || ''
      });
    }

    if (webhooks.length === 0) return;

    const body = JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data: payload
    });

    // Enviar peticiones HTTP POST asíncronas sin bloquear la ejecución principal
    const promises = webhooks.map(async (wh) => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'User-Agent': 'TSolutions-ROSE-Webhooks/1.0'
        };

        if (wh.secret) {
          headers['X-ROSE-Signature'] = wh.secret;
        }

        await fetch(wh.url, {
          method: 'POST',
          headers,
          body,
          signal: AbortSignal.timeout(5000) // Timeout de 5s max
        });
      } catch (err) {
        console.error(`Error enviando webhook a ${wh.url}:`, err.message);
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Error general en dispatchWebhook:', error);
  }
}
