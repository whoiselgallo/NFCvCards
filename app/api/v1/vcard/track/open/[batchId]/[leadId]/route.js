/**
 * ROSE SALES ENGINE - EMAIL OPEN PIXEL TRACKING
 * GET /api/v1/vcard/track/open/[batchId]/[leadId]
 *
 * Pixel de rastreo 1x1 GIF transparente para apertura de emails.
 */

import { NextResponse } from 'next/server';
import { updateLeadDeliveryStatus, incrementBatchMetric } from '@/lib/salesEngineDb.js';

// GIF 1x1 transparente en base64
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(request, { params }) {
  const { batchId, leadId } = params;
  try {
    await updateLeadDeliveryStatus(batchId, leadId, 'email', 'OPENED');
    await incrementBatchMetric(batchId, 'emails_opened');
  } catch (_err) {
    // Silencioso - no interrumpe la carga del email
  }

  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Content-Length': String(TRANSPARENT_GIF.length),
    }
  });
}
