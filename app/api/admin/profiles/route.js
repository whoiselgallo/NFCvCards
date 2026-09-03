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
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.trim() || '';
    const tag = searchParams.get('tag')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const mode = searchParams.get('mode')?.trim() || '';

    const pool = getPool();

    let query = `
      SELECT 
        id, slug, mode, nombre, apellido, empresa, puesto,
        telefono, whatsapp, correo, url, linkedin, instagram, facebook,
        calle, ciudad, estado, cp, pais, nota, google_maps_url, video_youtube_url,
        theme, font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
        logo_scale, cover_position_y, cover_zoom, logo_img, cover_photo,
        tags, status, views_count, created_at, updated_at
      FROM vcard_profiles
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (
        empresa ILIKE $${paramIndex} OR
        nombre ILIKE $${paramIndex} OR
        apellido ILIKE $${paramIndex} OR
        puesto ILIKE $${paramIndex} OR
        correo ILIKE $${paramIndex} OR
        telefono ILIKE $${paramIndex} OR
        slug ILIKE $${paramIndex} OR
        tags ILIKE $${paramIndex}
      )`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (tag) {
      query += ` AND tags ILIKE $${paramIndex}`;
      values.push(`%${tag}%`);
      paramIndex++;
    }

    if (status && status !== 'all') {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (mode && mode !== 'all') {
      query += ` AND mode = $${paramIndex}`;
      values.push(mode);
      paramIndex++;
    }

    // Ordenar de forma jerárquica: Empresa y luego fecha de actualización
    query += ` ORDER BY COALESCE(NULLIF(empresa, ''), 'zzzz') ASC, updated_at DESC`;

    const result = await pool.query(query, values);
    const profiles = result.rows;

    // Calcular métricas globales para el panel
    const metricsResult = await pool.query(`
      SELECT 
        COUNT(*)::int as total_profiles,
        COALESCE(SUM(views_count), 0)::int as total_views,
        COUNT(DISTINCT NULLIF(empresa, ''))::int as total_companies,
        COUNT(CASE WHEN status = 'validated' THEN 1 END)::int as validated_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int as pending_count,
        COUNT(CASE WHEN status = 'active' THEN 1 END)::int as active_count
      FROM vcard_profiles
    `);

    const metrics = metricsResult.rows[0];

    // Extraer etiquetas únicas existentes
    const allTagsResult = await pool.query(`
      SELECT tags FROM vcard_profiles WHERE tags IS NOT NULL AND tags != ''
    `);
    
    const tagSet = new Set();
    allTagsResult.rows.forEach(r => {
      if (r.tags) {
        r.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => tagSet.add(t));
      }
    });

    return NextResponse.json({
      success: true,
      profiles,
      metrics,
      availableTags: Array.from(tagSet),
      count: profiles.length
    });

  } catch (error) {
    console.error('Error al obtener perfiles admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error en la base de datos' },
      { status: 500 }
    );
  }
}
