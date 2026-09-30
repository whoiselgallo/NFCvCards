/**
 * ROSE SALES ENGINE - CLICK TRACKING ENDPOINT
 * GET /api/v1/vcard/track/click/[leadId]
 */

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db.js';
import { incrementBatchMetric } from '@/lib/salesEngineDb.js';

const VCARD_DOMAIN = process.env.NEXT_PUBLIC_VCARD_DOMAIN || 'vc.tsolutionsipidd.com';

export async function GET(request, { params }) {
  const { leadId } = params;
  try {
    const pool = getPool();
    const { rows: [lead] } = await pool.query(
      `SELECT id, suggested_slug FROM vcard_crm_leads WHERE id = $1`,
      [leadId]
    );

    if (!lead) return NextResponse.redirect(`https://${VCARD_DOMAIN}`);

    await pool.query(
      `UPDATE vcard_crm_leads SET demo_clicked = TRUE, demo_clicked_at = NOW() WHERE id = $1`,
      [leadId]
    );

    const { rows: [rel] } = await pool.query(
      `SELECT batch_id FROM marketing_batch_leads WHERE lead_id = $1`,
      [leadId]
    );
    if (rel?.batch_id) await incrementBatchMetric(rel.batch_id, 'demo_clicks');

    const demoUrl = `https://${VCARD_DOMAIN}/demo/${lead.suggested_slug || ''}`;
    return NextResponse.redirect(demoUrl, { status: 302 });
  } catch (err) {
    console.error('[Track/Click] Error:', err.message);
    return NextResponse.redirect(`https://${VCARD_DOMAIN}`);
  }
}
