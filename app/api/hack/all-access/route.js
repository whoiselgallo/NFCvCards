import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/nextAuthOptions';
import { getPool } from '../../../lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  const pool = getPool();
  const client = await pool.connect();
  
  try {
    // Hack: actualizamos al usuario al plan 'elite' para desbloquear TODO el All Access Free Pass
    await client.query('UPDATE users SET plan_id = $1 WHERE id = $2', ['elite', session.user.id]);
    return NextResponse.json({ success: true, message: 'All Access Free Pass (Elite) activado', plan_id: 'elite' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  } finally {
    client.release();
  }
}
