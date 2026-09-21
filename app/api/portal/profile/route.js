import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../lib/db';

// GET perfil para el Portal Personal de Cliente (Busca por slug o ID con clave o slug)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug')?.trim();
    const id = searchParams.get('id');

    if (!slug && !id) {
      return NextResponse.json({ success: false, error: 'Slug o ID requerido' }, { status: 400 });
    }

    await initDb();
    const pool = getPool();

    let query = 'SELECT * FROM vcard_profiles WHERE ';
    const values = [];
    if (slug) {
      query += 'slug = $1';
      values.push(slug);
    } else {
      query += 'id = $1';
      values.push(id);
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 });
    }

    const profile = result.rows[0];
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error en portal profile GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT actualizar perfil desde el Portal Personal Business Elite
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, slug } = data;

    if (!id && !slug) {
      return NextResponse.json({ success: false, error: 'ID o Slug requerido para actualizar' }, { status: 400 });
    }

    await initDb();
    const pool = getPool();

    const {
      nombre = '',
      apellido = '',
      empresa = '',
      puesto = '',
      cedula_profesional = '',
      permisos_profesionales = '',
      telefono = '',
      whatsapp = '',
      correo = '',
      url = '',
      linkedin = '',
      instagram = '',
      facebook = '',
      calle = '',
      ciudad = '',
      estado = '',
      cp = '',
      pais = '',
      nota = '',
      google_maps_url = '',
      video_youtube_url = '',
      theme = 'modern',
      font_primary = 'Inter',
      font_secondary = 'Inter',
      color_primario = '#E11D48',
      color_secundario = '#00F0FF',
      color_cta = '#E11D48',
      logo_scale = 100,
      cover_position_y = 50,
      cover_zoom = 100,
      logo_img = null,
      cover_photo = null,
      plan_tier = 'elite',
      custom_fields = [],
      custom_layout = {},
      portfolio = [],
      google_calendar_url = '',
      gallery = [],
      marketing_carousel = [],
      customer_reviews = []
    } = data;

    const query = `
      UPDATE vcard_profiles SET
        nombre = $1,
        apellido = $2,
        empresa = $3,
        puesto = $4,
        cedula_profesional = $5,
        permisos_profesionales = $6,
        telefono = $7,
        whatsapp = $8,
        correo = $9,
        url = $10,
        linkedin = $11,
        instagram = $12,
        facebook = $13,
        calle = $14,
        ciudad = $15,
        estado = $16,
        cp = $17,
        pais = $18,
        nota = $19,
        google_maps_url = $20,
        video_youtube_url = $21,
        theme = $22,
        font_primary = $23,
        font_secondary = $24,
        color_primario = $25,
        color_secundario = $26,
        color_cta = $27,
        logo_scale = $28,
        cover_position_y = $29,
        cover_zoom = $30,
        logo_img = COALESCE($31, logo_img),
        cover_photo = COALESCE($32, cover_photo),
        custom_fields = $33,
        custom_layout = $34,
        portfolio = $35,
        google_calendar_url = $36,
        gallery = $37,
        marketing_carousel = $38,
        customer_reviews = $39,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $40 OR slug = $41
      RETURNING *;
    `;

    const values = [
      nombre, apellido, empresa, puesto,
      cedula_profesional, permisos_profesionales,
      telefono, whatsapp, correo, url, linkedin, instagram, facebook,
      calle, ciudad, estado, cp, pais, nota, google_maps_url, video_youtube_url,
      theme, font_primary, font_secondary,
      color_primario, color_secundario, color_cta,
      logo_scale, cover_position_y, cover_zoom,
      logo_img, cover_photo,
      JSON.stringify(custom_fields),
      JSON.stringify(custom_layout),
      JSON.stringify(portfolio),
      google_calendar_url,
      JSON.stringify(gallery),
      JSON.stringify(marketing_carousel),
      JSON.stringify(customer_reviews),
      id || 0,
      slug || ''
    ];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '¡Perfil y diseño de layout actualizados exitosamente!',
      profile: result.rows[0]
    });

  } catch (error) {
    console.error('Error en portal profile PUT:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
