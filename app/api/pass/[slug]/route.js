import { NextResponse } from 'next/server';
import { getVipPass } from '../../../../lib/vipPasses';
import { getPool } from '../../../../lib/db';
import { getPlatformAccessConfig } from '../../../../lib/accessConfig';

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
    let accessConfig;
    try {
      const pool = getPool();
      accessConfig = await getPlatformAccessConfig(pool);
      const client = await pool.connect();
      try {
        const existing = await client.query('SELECT * FROM users WHERE email = $1', [vip.email]);
        if (existing.rows.length > 0) {
          await client.query(`
            INSERT INTO user_profiles (user_id, name, plan_id, card_limit, role)
            VALUES ($1, $2, 'elite', $3, 'admin')
            ON CONFLICT (user_id) DO UPDATE SET
              name = EXCLUDED.name,
              plan_id = 'elite',
              card_limit = GREATEST(COALESCE(user_profiles.card_limit, $3), $3);
          `, [existing.rows[0].id, vip.name, accessConfig.organizationCardLimit]);
        } else {
          const insertUser = await client.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, 'vip_pass_user') RETURNING id",
            [vip.email]
          );
          await client.query(`
            INSERT INTO user_profiles (user_id, name, plan_id, card_limit, role)
            VALUES ($1, $2, 'elite', $3, 'admin')
            ON CONFLICT (user_id) DO NOTHING;
          `, [insertUser.rows[0].id, vip.name, accessConfig.organizationCardLimit]);
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
        cardLimit: accessConfig.organizationCardLimit,
        role: vip.role,
        company: vip.company
      },
      message: `Pase Libre Elite activo (${accessConfig.organizationCardLimit} tarjetas) para ${vip.name}`
    });
  } catch (error) {
    console.error('Error en ruta VIP pass:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
