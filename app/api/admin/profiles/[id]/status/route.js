import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../../lib/db';
import { verifySessionToken, SESSION_COOKIE_NAME } from '../../../../../../lib/auth';

export async function PATCH(request, { params }) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);
    if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ success: false, error: 'Estado no especificado' }, { status: 400 });
    }

    await initDb();
    const pool = getPool();

    const result = await pool.query(
      'UPDATE vcard_profiles SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, slug, status',
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
