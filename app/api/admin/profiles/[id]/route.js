import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { verifySessionToken, SESSION_COOKIE_NAME } from '../../../../../lib/auth';

// GET perfil individual
export async function GET(request, { params }) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);
    if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

    const { id } = await params;
    await initDb();
    const pool = getPool();

    const result = await pool.query('SELECT * FROM vcard_profiles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT actualizar todos los campos de un perfil
export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);
    if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

    const { id } = await params;
    const data = await request.json();

    const {
      slug,
      mode = 'vcard',
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
      font_family = 'Inter',
      font_primary = 'Inter',
      font_secondary = 'Inter',
      color_primario = '#ff0003',
      color_secundario = '#00E5FF',
      color_cta = '#ff0003',
      logo_scale = 100,
      cover_position_y = 50,
      cover_zoom = 100,
      logo_img = null,
      cover_photo = null,
      tags = '',
      status = 'active'
    } = data;

    await initDb();
    const pool = getPool();

    const query = `
      UPDATE vcard_profiles SET
        mode = $1,
        nombre = $2,
        apellido = $3,
        empresa = $4,
        puesto = $5,
        cedula_profesional = $6,
        permisos_profesionales = $7,
        telefono = $8,
        whatsapp = $9,
        correo = $10,
        url = $11,
        linkedin = $12,
        instagram = $13,
        facebook = $14,
        calle = $15,
        ciudad = $16,
        estado = $17,
        cp = $18,
        pais = $19,
        nota = $20,
        google_maps_url = $21,
        video_youtube_url = $22,
        theme = $23,
        font_family = $24,
        font_primary = $25,
        font_secondary = $26,
        color_primario = $27,
        color_secundario = $28,
        color_cta = $29,
        logo_scale = $30,
        cover_position_y = $31,
        cover_zoom = $32,
        logo_img = COALESCE($33, logo_img),
        cover_photo = COALESCE($34, cover_photo),
        tags = $35,
        status = $36,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $37
      RETURNING *;
    `;

    const values = [
      mode, nombre, apellido, empresa, puesto,
      cedula_profesional, permisos_profesionales,
      telefono, whatsapp, correo, url, linkedin, instagram, facebook,
      calle, ciudad, estado, cp, pais, nota, google_maps_url, video_youtube_url,
      theme, font_primary || font_family || 'Inter', font_primary || 'Inter', font_secondary || 'Inter',
      color_primario, color_secundario, color_cta,
      logo_scale, cover_position_y, cover_zoom,
      logo_img, cover_photo,
      tags, status,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado para actualizar' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      profile: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar perfil en admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE eliminar perfil permanentemente
export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);
    if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });

    const { id } = await params;
    await initDb();
    const pool = getPool();

    const result = await pool.query('DELETE FROM vcard_profiles WHERE id = $1 RETURNING id, nombre, empresa, slug;', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil eliminado exitosamente',
      deleted: result.rows[0]
    });

  } catch (error) {
    console.error('Error al eliminar perfil en admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
