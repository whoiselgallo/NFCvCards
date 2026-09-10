import { NextResponse } from 'next/server';
import { getAllAgents } from '../../../lib/vipPasses';
import { getPool, initDb } from '../../../lib/db';

export async function GET() {
  try {
    await initDb();
    const agents = getAllAgents();
    const pool = getPool();

    // Consultar conteo de tarjetas por referido
    const query = `
      SELECT LOWER(referred_by) as referred_by, COUNT(*) as count
      FROM vcard_profiles
      WHERE referred_by IS NOT NULL AND TRIM(referred_by) != ''
      GROUP BY LOWER(referred_by);
    `;
    const res = await pool.query(query);
    const countsMap = {};
    (res.rows || []).forEach(r => {
      countsMap[r.referred_by] = parseInt(r.count, 10);
    });

    const summary = agents.map(ag => {
      const gifted = countsMap[ag.slug.toLowerCase()] || 0;
      const quota = ag.giftQuota || 50;
      return {
        slug: ag.slug,
        name: ag.name,
        role: ag.role,
        company: ag.company,
        giftQuota: quota,
        giftedCount: gifted,
        remaining: Math.max(0, quota - gifted),
        percent: Math.min(100, Math.round((gifted / quota) * 100))
      };
    });

    const totalGiftQuota = summary.reduce((acc, a) => acc + a.giftQuota, 0);
    const totalGifted = summary.reduce((acc, a) => acc + a.giftedCount, 0);

    return NextResponse.json({
      success: true,
      totals: {
        totalGiftQuota,
        totalGifted,
        totalRemaining: Math.max(0, totalGiftQuota - totalGifted)
      },
      agents: summary
    });
  } catch (err) {
    console.error('Error in all agents API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
