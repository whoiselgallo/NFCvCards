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
          const userId = parseInt(session.user.id, 10) || session.user.id;

          // Actualizar o insertar en user_profiles para desbloquear plan Elite
          await pool.query(`
            INSERT INTO user_profiles (user_id, plan_id, card_limit, role)
            VALUES ($1, 'elite', 1, 'member')
            ON CONFLICT (user_id) DO UPDATE SET
              plan_id = 'elite',
              card_limit = GREATEST(COALESCE(user_profiles.card_limit, 1), 1);
          `, [userId]);

          const result = await pool.query(`
            SELECT id, email, plan_id, card_limit
            FROM app_users
            WHERE id = $1
          `, [userId]);

          if (!result.rows.length) {
               return NextResponse.json({ success: false, error: 'No se encontró tu cuenta.' }, { status: 404 });
          }

          return NextResponse.json({
               success: true,
               user: result.rows[0],
               agent: agent.slug,
               message: 'Pase Elite de agente activado exitosamente.'
          });
     } catch (error) {
          console.error('Error al activar pase de agente:', error);
          return NextResponse.json({ success: false, error: 'No se pudo activar el pase.' }, { status: 500 });
     }
}
