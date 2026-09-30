/**
 * ROSE SALES ENGINE - CONVERSION REGISTRATION ENDPOINT
 * POST /api/v1/vcard/leads/convert
 */

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db.js';
import { recordConversion } from '@/lib/salesEngineDb.js';
import { notifyHighConversionRate } from '@/lib/salesEngineEvents.js';

export async function POST(request) {
  try {
    const { email, plan, revenue_mxn, lead_id } = await request.json();

    if (!email && !lead_id) {
      return NextResponse.json(
        { success: false, error: 'Se requiere email o lead_id para registrar la conversión.' },
        { status: 400 }
      );
    }

    const pool = getPool();
    let resolvedLeadId = lead_id;

    if (!resolvedLeadId && email) {
      const { rows: [lead] } = await pool.query(
        `SELECT id FROM vcard_crm_leads WHERE LOWER(email) = LOWER($1) LIMIT 1`,
        [email.trim()]
      );
      resolvedLeadId = lead?.id;
    }

    if (!resolvedLeadId) {
      return NextResponse.json({
        success: true, crm_lead: false,
        message: 'Conversión registrada. El prospecto no provenía del Sales Engine CRM.'
      });
    }

    const amount = parseFloat(revenue_mxn) || 0;
    const result = await recordConversion(resolvedLeadId, amount);

    if (result?.metrics) {
      const { conversion_rate, cards_ordered, batch_id } = result.metrics;
      const rate = parseFloat(conversion_rate || 0);
      if (rate >= 10) {
        notifyHighConversionRate({
          batchId: batch_id, batchNumber: result.batchNumber || 'N/A',
          conversionRate: rate, cardsOrdered: cards_ordered, revenueGenerated: amount
        });
      }
    }

    return NextResponse.json({
      success: true, crm_lead: true, lead_id: resolvedLeadId,
      message: `Prospecto marcado como CONVERTED. Ingreso registrado: $${amount} MXN`, plan
    });
  } catch (err) {
    console.error('[Convert] Error al registrar conversión:', err.message);
    return NextResponse.json({ success: false, error: 'Error interno al registrar la conversión.' }, { status: 500 });
  }
}
