/**
 * ROSE SALES ENGINE - BATCHES LIST ENDPOINT
 * GET /api/v1/vcard/batches
 */

import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth.js';
import { initSalesEngineDb, listBatches } from '@/lib/salesEngineDb.js';

const WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ success: false, error: 'Sesión inválida o expirada' }, { status: 401 });

  try {
    await initSalesEngineDb();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const batches = await listBatches(WORKSPACE_ID, limit);
    return NextResponse.json({ success: true, batches, total: batches.length });
  } catch (err) {
    console.error('[Batches] Error al listar lotes:', err.message);
    return NextResponse.json({ success: false, error: 'Error al obtener los lotes.' }, { status: 500 });
  }
}
