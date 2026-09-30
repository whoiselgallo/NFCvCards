/**
 * ROSE SALES ENGINE - SSE NOTIFICATIONS ENDPOINT
 * GET /api/v1/vcard/events
 *
 * Server-Sent Events para notificaciones en tiempo real al panel de Javier Gallardo.
 * Sin Redis, sin WebSocket — funciona nativo en Next.js App Router.
 */

import { registerAdminClient } from '@/lib/salesEngineEvents.js';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth.js';

export const runtime = 'nodejs';

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return new Response('No autorizado', { status: 401 });
  }

  let unregister;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode(
          `event: connected\ndata: ${JSON.stringify({ message: 'Rose Sales Engine conectado', timestamp: new Date().toISOString() })}\n\n`
        )
      );
      unregister = registerAdminClient(controller);

      const keepAlive = setInterval(() => {
        try { controller.enqueue(new TextEncoder().encode(': ping\n\n')); }
        catch (_err) { clearInterval(keepAlive); }
      }, 25000);

      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        if (unregister) unregister();
      });
    },
    cancel() {
      if (unregister) unregister();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    }
  });
}
