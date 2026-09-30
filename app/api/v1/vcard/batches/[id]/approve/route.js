/**
 * ROSE SALES ENGINE - BATCH APPROVAL ENDPOINT
 * POST /api/v1/vcard/batches/[id]/approve  → Aprobar lote
 * DELETE /api/v1/vcard/batches/[id]/approve → Rechazar lote
 */

import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth.js';
import { approveBatch, getBatchWithLeads } from '@/lib/salesEngineDb.js';
import { dispatchBatchAsync } from '@/lib/vcardCampaignDispatcher.js';
import { getPool } from '@/lib/db.js';

export async function POST(request, { params }) {
  const { id: batchId } = params;
  if (!batchId) return NextResponse.json({ success: false, error: 'ID de lote requerido.' }, { status: 400 });

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });

  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ success: false, error: 'Sesión inválida o expirada.' }, { status: 401 });

  if (!['admin', 'superadmin', 'owner'].includes(session.role)) {
    return NextResponse.json(
      { success: false, error: 'Permisos insuficientes. Solo administradores pueden aprobar lotes.' },
      { status: 403 }
    );
  }

  const batch = await getBatchWithLeads(batchId);
  if (!batch) return NextResponse.json({ success: false, error: 'Lote no encontrado.' }, { status: 404 });

  if (batch.status !== 'PENDING_APPROVAL') {
    return NextResponse.json(
      { success: false, error: `El lote no puede ser aprobado. Estado actual: ${batch.status}`, current_status: batch.status },
      { status: 409 }
    );
  }

  const approvedBatch = await approveBatch(batchId, session.userId.toString());
  if (!approvedBatch) {
    return NextResponse.json({ success: false, error: 'No se pudo registrar la aprobación.' }, { status: 500 });
  }

  // Despacho asíncrono < 3 segundos desde aprobación
  dispatchBatchAsync(batchId);

  return NextResponse.json({
    success: true,
    message: `✅ Lote #${approvedBatch.batch_number} aprobado. ${batch.lead_count || 50} mensajes en camino.`,
    batch_id: batchId,
    batch_number: approvedBatch.batch_number,
    approved_by: session.email,
    approved_at: new Date().toISOString(),
    lead_count: batch.leads?.length || 50,
    status: 'DISPATCHING'
  });
}

export async function DELETE(request, { params }) {
  const { id: batchId } = params;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });

  const session = verifySessionToken(token);
  if (!session || !['admin', 'superadmin', 'owner'].includes(session.role)) {
    return NextResponse.json({ success: false, error: 'Permisos insuficientes.' }, { status: 403 });
  }

  const { notes } = await request.json().catch(() => ({}));
  const pool = getPool();

  await pool.query(
    `UPDATE marketing_campaign_batches SET status = 'REJECTED', approval_notes = $2 WHERE id = $1 AND status = 'PENDING_APPROVAL'`,
    [batchId, notes || 'Rechazado por el administrador.']
  );

  await pool.query(
    `UPDATE vcard_crm_leads SET status = 'NEW' WHERE id IN (SELECT lead_id FROM marketing_batch_leads WHERE batch_id = $1)`,
    [batchId]
  );

  return NextResponse.json({
    success: true,
    message: 'Lote rechazado. Los prospectos han sido liberados para el próximo lote.',
    batch_id: batchId
  });
}
