import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../lib/db';
import { verifySessionToken, SESSION_COOKIE_NAME } from '../../../../lib/auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/nextAuthOptions';

export async function GET(request) {
  try {
    // Verificar autenticación vía Cookie personalizada o NextAuth
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const customSession = verifySessionToken(token);
    const nextAuthSession = await getServerSession(authOptions);

    const allowedAdminEmails = [
      'javier.gallardo@tsolutionsipidd.com',
      'whoiselgallo@gmail.com',
      'contacto@tsolutionsipidd.com',
      'admin@tsolutionsipidd.com'
    ];

    const nextAuthEmail = nextAuthSession?.user?.email?.toLowerCase() || '';
    const isNextAuthAdmin = nextAuthEmail && (
      allowedAdminEmails.includes(nextAuthEmail) || 
      nextAuthEmail.endsWith('@tsolutionsipidd.com')
    );

    if (!customSession && !isNextAuthAdmin) {
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
    const summary = globalRes.rows[0] || {
      total_profiles: 0, total_views: 0, total_companies: 0,
      elite_profiles: 0, business_profiles: 0, pro_profiles: 0, free_profiles: 0
    };

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
    const clicks = clicksRes.rows[0] || {
      total_vcf: 0, total_whatsapp: 0, total_calls: 0, total_maps: 0, total_calendar: 0, total_social: 0, total_custom: 0
    };

    const totalInteractions = clicks.total_vcf + clicks.total_whatsapp + clicks.total_calls + clicks.total_maps + clicks.total_calendar + clicks.total_social + clicks.total_custom;
    
    // Tasas Globales
    const conversionRate = summary.total_views > 0 
      ? ((totalInteractions / summary.total_views) * 100).toFixed(1)
      : '0.0';
    
    const vcfSaveRate = summary.total_views > 0
      ? ((clicks.total_vcf / summary.total_views) * 100).toFixed(1)
      : '0.0';

    // 3. Usuarios Registrados
    const usersCountRes = await pool.query(`
      SELECT COUNT(*)::int AS total_users FROM users
    `);
    const totalUsers = usersCountRes.rows[0]?.total_users || 0;

    // 4. Pedidos y Finanzas (Órdenes reales + Valor del Portafolio)
    let ordersList = [];
    let realOrdersRevenue = 0;
    let pendingHardwareCount = 0;

    try {
      const ordersRes = await pool.query(`
        SELECT 
          id, order_number, profile_slug, client_name, client_email, client_phone,
          plan_tier, product_name, product_type, amount, currency, status, payment_method,
          shipping_address, referred_by, created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 100
      `);
      ordersList = ordersRes.rows;

      ordersList.forEach(o => {
        if (o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped') {
          realOrdersRevenue += Number(o.amount) || 0;
        }
        if (o.product_type === 'physical_nfc_card' && (o.status === 'paid' || o.status === 'pending')) {
          pendingHardwareCount++;
        }
      });
    } catch (err) {
      console.warn('Orders query failed or table empty:', err.message);
    }

    // Cálculo financiero estimado basado en planes activos si las órdenes están vacías
    const estimatedEliteRevenue = (summary.elite_profiles || 0) * 1499; // $1,499 MXN Plan Elite
    const estimatedAllInOne = (summary.total_profiles || 0) * 199; // $199 MXN All-in-One base
    const totalCalculatedRevenue = realOrdersRevenue > 0 ? realOrdersRevenue : (estimatedEliteRevenue + estimatedAllInOne);
    const mrr = Math.round(totalCalculatedRevenue / 12);

    // 5. CRM Leads Completo (Perfiles de Contactos Reales)
    const leadsRes = await pool.query(`
      SELECT 
        id, slug, nombre, apellido, empresa, puesto, telefono, whatsapp, correo,
        url, plan_tier, views_count, status, referred_by, created_at,
        COALESCE((analytics_clicks->>'vcf_downloads')::int, 0) AS vcf_downloads,
        COALESCE((analytics_clicks->>'whatsapp_clicks')::int, 0) AS whatsapp_clicks,
        COALESCE((analytics_clicks->>'call_clicks')::int, 0) AS call_clicks,
        (
          COALESCE((analytics_clicks->>'vcf_downloads')::int, 0) +
          COALESCE((analytics_clicks->>'whatsapp_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'call_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'maps_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'calendar_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'social_clicks')::int, 0)
        ) AS total_engagements
      FROM vcard_profiles
      ORDER BY created_at DESC
      LIMIT 200
    `);

    // 6. Top Perfiles con Mayor Rendimiento
    const topProfilesRes = await pool.query(`
      SELECT 
        id, slug, nombre, apellido, empresa, puesto, plan_tier, views_count, referred_by,
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
      LIMIT 15
    `);

    // 7. Evaluaciones, Feedback y Calidad (NPS)
    let feedbackList = [];
    let avgRating = '5.0';
    let npsScore = 100;

    try {
      const feedbackRes = await pool.query(`
        SELECT 
          id, profile_slug, client_email, referred_by, feedback_type,
          ease_level, friendly_ui, issues_reported, recommendations,
          rating, nps_score, usage_highlights, created_at
        FROM card_feedback
        ORDER BY created_at DESC
        LIMIT 100
      `);
      feedbackList = feedbackRes.rows;

      if (feedbackList.length > 0) {
        const sumRatings = feedbackList.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
        avgRating = (sumRatings / feedbackList.length).toFixed(1);

        const promoters = feedbackList.filter(f => (f.nps_score || f.rating * 2) >= 9).length;
        const detractors = feedbackList.filter(f => (f.nps_score || f.rating * 2) <= 6).length;
        npsScore = Math.round(((promoters - detractors) / feedbackList.length) * 100);
      }
    } catch (err) {
      console.warn('Feedback query failed:', err.message);
    }

    // 8. Red de Agentes y Embajadores
    const agentsRes = await pool.query(`
      SELECT 
        COALESCE(NULLIF(referred_by, ''), 'Directo (Orgánico)') AS agent_name,
        COUNT(*)::int AS total_cards,
        COALESCE(SUM(views_count), 0)::int AS total_views,
        COALESCE(SUM(
          COALESCE((analytics_clicks->>'vcf_downloads')::int, 0) +
          COALESCE((analytics_clicks->>'whatsapp_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'call_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'maps_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'calendar_clicks')::int, 0) +
          COALESCE((analytics_clicks->>'social_clicks')::int, 0)
        ), 0)::int AS total_interactions
      FROM vcard_profiles
      GROUP BY COALESCE(NULLIF(referred_by, ''), 'Directo (Orgánico)')
      ORDER BY total_cards DESC, total_views DESC
    `);

    // 9. Distribución por Dispositivos (Eventos)
    const devicesRes = await pool.query(`
      SELECT 
        device_type, 
        COUNT(*)::int AS count 
      FROM analytics_events 
      GROUP BY device_type
    `);

    // 10. Histórico Reciente de Eventos en Tiempo Real
    const recentEventsRes = await pool.query(`
      SELECT 
        ae.id, ae.profile_slug, ae.event_type, ae.device_type, ae.created_at,
        vp.nombre, vp.apellido, vp.empresa
      FROM analytics_events ae
      LEFT JOIN vcard_profiles vp ON ae.profile_id = vp.id
      ORDER BY ae.created_at DESC
      LIMIT 35
    `);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          ...summary,
          totalUsers,
          totalInteractions,
          conversionRate,
          vcfSaveRate,
          totalRevenue: totalCalculatedRevenue,
          mrr,
          pendingHardwareCount,
          totalOrdersCount: ordersList.length
        },
        clicks,
        topProfiles: topProfilesRes.rows,
        leads: leadsRes.rows,
        orders: ordersList,
        feedback: {
          list: feedbackList,
          avgRating,
          npsScore,
          total: feedbackList.length
        },
        agents: agentsRes.rows,
        devices: devicesRes.rows,
        recentEvents: recentEventsRes.rows
      }
    });

  } catch (error) {
    console.error('Error obteniendo analítica centralizada:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
