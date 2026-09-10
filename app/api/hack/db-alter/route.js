import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../lib/db';

export async function GET() {
  try {
    await initDb();
    const pool = getPool();
    const updateRes = await pool.query(`
      UPDATE vcard_profiles
      SET plan_tier = 'elite'
      WHERE plan_tier = 'free' OR plan_tier IS NULL OR plan_tier = '';
    `);
    const layoutRes = await pool.query(`
      UPDATE vcard_profiles
      SET custom_layout = '{"logoPosition":"center","infoBoxStyle":"floating","showBadges":true,"sectionsOrder":["contact","portfolio","calendar","gallery","marketing","reviews"]}'::jsonb
      WHERE custom_layout IS NULL;
    `);
    const countRes = await pool.query(`
      SELECT plan_tier, count(*) as count FROM vcard_profiles GROUP BY plan_tier;
    `);
    return NextResponse.json({
      success: true,
      message: 'Tarjetas actualizadas a Plan Elite exitosamente',
      updatedCards: updateRes.rowCount,
      updatedLayouts: layoutRes.rowCount,
      tierDistribution: countRes.rows
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
