import { NextResponse } from 'next/server';
import { getAgent } from '../../../../lib/vipPasses';
import { getPool, initDb } from '../../../../lib/db';

export async function GET(request, context) {
  try {
    await initDb();
    const params = await context.params;
    const slug = params?.slug;
    const agent = getAgent(slug);

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agente no encontrado' }, { status: 404 });
    }

    const pool = getPool();
    const query = `
      SELECT id, slug, nombre, apellido, empresa, puesto, telefono, correo, status, views_count, created_at
      FROM vcard_profiles
      WHERE LOWER(referred_by) = LOWER($1)
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [agent.slug]);
    const cards = result.rows || [];
    const giftedCount = cards.length;
    const giftQuota = agent.giftQuota || 50;
    const remaining = Math.max(0, giftQuota - giftedCount);

    return NextResponse.json({
      success: true,
      agent: {
        slug: agent.slug,
        name: agent.name,
        company: agent.company,
        role: agent.role,
        giftQuota,
        giftedCount,
        remaining
      },
      cards
    });
  } catch (err) {
    console.error('Error in agent stats API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
