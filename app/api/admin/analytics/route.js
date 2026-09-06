import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../lib/db';
import { verifySessionToken, SESSION_COOKIE_NAME } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    await initDb();
    const pool = getPool();

    // 1. Resumen Global de Perfiles y Visualizaciones
    const globalRes = await pool.query(`
      SELECT 
        COUNT(*)::int AS total_profiles,
        COALESCE(SUM(views_count), 0)::int AS total_views,
        COUNT(DISTINCT NULLIF(empresa, ''))::int AS total_companies,
        COUNT(CASE WHEN plan_tier = 'elite' THEN 1 END)::int AS elite_profiles,
        COUNT(CASE WHEN plan_tier = 'business' THEN 1 END)::int AS business_profiles,
        COUNT(CASE WHEN plan_tier = 'pro' THEN 1 END)::int AS pro_profiles,
        COUNT(CASE WHEN plan_tier = 'free' OR plan_tier IS NULL THEN 1 END)::int AS free_profiles
      FROM vcard_profiles
    `);
    const summary = globalRes.rows[0];

    // 2. Sumatoria de Clics de Conversión (KPIs de Eficiencia)
    const clicksRes = await pool.query(`
      SELECT 
        COALESCE(SUM((analytics_clicks->>'vcf_downloads')::int), 0)::int AS total_vcf,
        COALESCE(SUM((analytics_clicks->>'whatsapp_clicks')::int), 0)::int AS total_whatsapp,
        COALESCE(SUM((analytics_clicks->>'call_clicks')::int), 0)::int AS total_calls,
        COALESCE(SUM((analytics_clicks->>'maps_clicks')::int), 0)::int AS total_maps,
        COALESCE(SUM((analytics_clicks->>'calendar_clicks')::int), 0)::int AS total_calendar,
        COALESCE(SUM((analytics_clicks->>'social_clicks')::int), 0)::int AS total_social,
        COALESCE(SUM((analytics_clicks->>'custom_clicks')::int), 0)::int AS total_custom
      FROM vcard_profiles
    `);
    const clicks = clicksRes.rows[0];

    const totalInteractions = clicks.total_vcf + clicks.total_whatsapp + clicks.total_calls + clicks.total_maps + clicks.total_calendar + clicks.total_social + clicks.total_custom;
    
    // Tasa de Conversión Global (% de visitantes que interactúan o guardan el contacto)
    const conversionRate = summary.total_views > 0 
      ? ((totalInteractions / summary.total_views) * 100).toFixed(1)
      : '0.0';
    
    // Tasa de Guardado en Agenda (% de visitantes que descargan la vCard)
    const vcfSaveRate = summary.total_views > 0
      ? ((clicks.total_vcf / summary.total_views) * 100).toFixed(1)
      : '0.0';

    // 3. Top Perfiles con Mayor Rendimiento
    const topProfilesRes = await pool.query(`
      SELECT 
        id, slug, nombre, apellido, empresa, puesto, plan_tier, views_count,
        COALESCE((analytics_clicks->>'vcf_downloads')::int, 0) AS vcf_downloads,
        COALESCE((analytics_clicks->>'whatsapp_clicks')::int, 0) AS whatsapp_clicks,
        COALESCE((analytics_clicks->>'calendar_clicks')::int, 0) AS calendar_clicks,
        (
          COALESCE((analytics_clicks->>'vcf_downloads')::int, 0) +
          COALESCE((analytics_clicks->>'whatsapp_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'call_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'maps_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'calendar_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'social_clicks')::int, 0)
        ) AS total_engagements
      FROM vcard_profiles
      ORDER BY views_count DESC, total_engagements DESC
      LIMIT 10
    `);

    // 4. Distribución por Dispositivos (Eventos)
    const devicesRes = await pool.query(`
      SELECT 
        device_type, 
        COUNT(*)::int AS count 
      FROM analytics_events 
      GROUP BY device_type
    `);

    // 5. Histórico Reciente de Eventos
    const recentEventsRes = await pool.query(`
      SELECT 
        ae.id, ae.profile_slug, ae.event_type, ae.device_type, ae.created_at,
        vp.nombre, vp.apellido, vp.empresa
      FROM analytics_events ae
      LEFT JOIN vcard_profiles vp ON ae.profile_id = vp.id
      ORDER BY ae.created_at DESC
      LIMIT 25
    `);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          ...summary,
          totalInteractions,
          conversionRate,
          vcfSaveRate
        },
        clicks,
        topProfiles: topProfilesRes.rows,
        devices: devicesRes.rows,
        recentEvents: recentEventsRes.rows
      }
    });

  } catch (error) {
    console.error('Error obteniendo analítica centralizada:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
