import { NextResponse } from 'next/server';
import { getVipPass } from '../../../../lib/vipPasses';
import { getPool } from '../../../../lib/db';

export async function GET(request, context) {
  try {
    const params = await context.params;
    const slug = params?.slug;
    const vip = getVipPass(slug);

    if (!vip) {
      return NextResponse.json({
        success: false,
        error: 'Pase no encontrado o inválido'
      }, { status: 404 });
    }

    // Asegurar que el usuario existe en Google Cloud SQL con 50 tarjetas y plan elite
    try {
      const pool = getPool();
      const client = await pool.connect();
      try {
        const existing = await client.query('SELECT * FROM users WHERE email = $1', [vip.email]);
        if (existing.rows.length > 0) {
          await client.query(
            "UPDATE users SET plan_id = 'elite', card_limit = 50, name = $1 WHERE email = $2",
            [vip.name, vip.email]
          );
        } else {
          await client.query(
            "INSERT INTO users (name, email, plan_id, card_limit) VALUES ($1, $2, 'elite', 50)",
            [vip.name, vip.email]
          );
        }
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn('Advertencia al sincronizar usuario VIP en BD:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      pass: {
        slug: vip.slug,
        name: vip.name,
        firstName: vip.firstName,
        lastName: vip.lastName,
        email: vip.email,
        plan: vip.plan,
        cardLimit: vip.cardLimit,
        role: vip.role,
        company: vip.company
      },
      message: `Pase Libre Elite activo (50 Tarjetas Libres) para ${vip.name}`
    });
  } catch (error) {
    console.error('Error en ruta VIP pass:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
