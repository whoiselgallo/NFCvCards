/**
 * WHATSAPP CLOUD API - WEBHOOK ALIAS
 * Re-exporta los handlers de /api/webhooks/whatsapp
 * Permite usar tanto /api/webhooks/whatsapp como /api/v1/vcard/webhooks/whatsapp
 */

export { GET, POST } from '@/app/api/webhooks/whatsapp/route.js';
