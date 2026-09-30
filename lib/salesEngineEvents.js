/**
 * ROSE SALES ENGINE - EVENT NOTIFICATIONS
 * Canal de notificaciones en tiempo real para el panel administrativo
 * 
 * Next.js App Router no tiene soporte nativo de WebSocket, así que usamos
 * Server-Sent Events (SSE) como mecanismo de notificación en tiempo real.
 * Funciona sin ninguna dependencia externa (no requiere Redis ni BullMQ).
 */

// Registro global de clientes conectados al canal SSE administrativo
// Solo persiste mientras el proceso Node esté corriendo
const adminClients = new Set();

/**
 * Registra un cliente SSE al canal de notificaciones administrativas.
 * @param {ReadableStreamDefaultController} controller
 */
export function registerAdminClient(controller) {
  adminClients.add(controller);
  return () => adminClients.delete(controller);
}

/**
 * Emite un evento a todos los clientes administrativos conectados.
 * @param {string} eventType - Nombre del evento (e.g. 'BATCH_READY_FOR_APPROVAL')
 * @param {object} payload - Datos del evento
 */
export function emitAdminEvent(eventType, payload) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  const deadClients = [];

  for (const controller of adminClients) {
    try {
      controller.enqueue(new TextEncoder().encode(message));
    } catch (_err) {
      // Cliente desconectado, marcar para limpieza
      deadClients.push(controller);
    }
  }

  // Limpiar clientes muertos
  deadClients.forEach(c => adminClients.delete(c));

  if (adminClients.size > 0) {
    console.log(`[SalesEngineEvents] Emitido '${eventType}' a ${adminClients.size} cliente(s) admin.`);
  }
}

/**
 * Emite el evento de lote listo para aprobación con todos los metadatos necesarios.
 */
export function notifyBatchReadyForApproval({ batchId, batchNumber, leadCount, workspaceId }) {
  emitAdminEvent('BATCH_READY_FOR_APPROVAL', {
    batchId,
    batchNumber,
    leadCount,
    workspaceId,
    timestamp: new Date().toISOString(),
    message: `⚡ Lote #${batchNumber} listo: ${leadCount} prospectos esperan tu aprobación para despliegue.`,
    priority: 'HIGH'
  });
}

/**
 * Emite el evento de felicitación cuando la tasa de conversión supera el 10%.
 */
export function notifyHighConversionRate({ batchId, batchNumber, conversionRate, cardsOrdered, revenueGenerated }) {
  emitAdminEvent('HIGH_CONVERSION_ALERT', {
    batchId,
    batchNumber,
    conversionRate,
    cardsOrdered,
    revenueGenerated,
    timestamp: new Date().toISOString(),
    message: `🎉 Lote #${batchNumber} alcanzó ${conversionRate}% de conversión. ${cardsOrdered} tarjetas vendidas. Ingresos: $${revenueGenerated} MXN`,
    priority: 'SUCCESS'
  });
}

/**
 * Emite el evento de actualización de estado del despacho.
 */
export function notifyDispatchProgress({ batchId, batchNumber, emailsSent, whatsappSent, total }) {
  const progress = Math.round(((emailsSent + whatsappSent) / (total * 2)) * 100);
  emitAdminEvent('DISPATCH_PROGRESS', {
    batchId,
    batchNumber,
    emailsSent,
    whatsappSent,
    total,
    progress: `${progress}%`,
    timestamp: new Date().toISOString()
  });
}
