import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/nextAuthOptions';
import { getPool, initDb } from '../../../../lib/db';
import { getAgent } from '../../../../lib/vipPasses';

export async function POST(request) {
     try {
          const session = await getServerSession(authOptions);
          if (!session?.user?.id || !session.user.email) {
               return NextResponse.json({ success: false, error: 'Inicia sesión para activar el pase.' }, { status: 401 });
          }

          const { slug } = await request.json();
          const agent = getAgent(slug);
          if (!agent) {
               return NextResponse.json({ success: false, error: 'Código de agente inválido.' }, { status: 400 });
          }

          await initDb();
          const pool = getPool();
          const result = await pool.query(`
      UPDATE users
      SET plan_id = 'elite', card_limit = GREATEST(COALESCE(card_limit, 1), 1)
      WHERE id = $1
      RETURNING id, email, plan_id, card_limit
    `, [session.user.id]);

          if (!result.rows.length) {
               return NextResponse.json({ success: false, error: 'No se encontró tu cuenta.' }, { status: 404 });
          }

          return NextResponse.json({
               success: true,
               user: result.rows[0],
               agent: agent.slug,
               message: 'Pase Elite de agente activado.'
          });
     } catch (error) {
          console.error('Error al activar pase de agente:', error);
          return NextResponse.json({ success: false, error: 'No se pudo activar el pase.' }, { status: 500 });
     }
}
