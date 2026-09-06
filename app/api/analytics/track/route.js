import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, eventType, deviceType = 'mobile' } = body;

    if (!slug || !eventType) {
      return NextResponse.json({ success: false, error: 'Slug y eventType requeridos' }, { status: 400 });
    }

    await initDb();
    const pool = getPool();

    // 1. Obtener perfil
    const res = await pool.query('SELECT id, analytics_clicks FROM vcard_profiles WHERE slug = $1', [slug]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 });
    }

    const profile = res.rows[0];
    const currentClicks = profile.analytics_clicks || {
      vcf_downloads: 0,
      whatsapp_clicks: 0,
      call_clicks: 0,
      maps_clicks: 0,
      calendar_clicks: 0,
      social_clicks: 0,
      custom_clicks: 0
    };

    // Incrementar el contador correspondiente
    if (eventType === 'vcf_download') currentClicks.vcf_downloads = (currentClicks.vcf_downloads || 0) + 1;
    else if (eventType === 'whatsapp_click') currentClicks.whatsapp_clicks = (currentClicks.whatsapp_clicks || 0) + 1;
    else if (eventType === 'call_click') currentClicks.call_clicks = (currentClicks.call_clicks || 0) + 1;
    else if (eventType === 'maps_click') currentClicks.maps_clicks = (currentClicks.maps_clicks || 0) + 1;
    else if (eventType === 'calendar_click') currentClicks.calendar_clicks = (currentClicks.calendar_clicks || 0) + 1;
    else if (eventType === 'social_click') currentClicks.social_clicks = (currentClicks.social_clicks || 0) + 1;
    else currentClicks.custom_clicks = (currentClicks.custom_clicks || 0) + 1;

    // Actualizar perfil
    await pool.query(
      'UPDATE vcard_profiles SET analytics_clicks = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(currentClicks), profile.id]
    );

    // Registrar evento detallado para gráficos temporales
    await pool.query(
      'INSERT INTO analytics_events (profile_id, profile_slug, event_type, device_type) VALUES ($1, $2, $3, $4)',
      [profile.id, slug, eventType, deviceType]
    );

    return NextResponse.json({ success: true, message: 'Evento registrado con éxito' });
  } catch (error) {
    console.error('Error registrando analítica:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
