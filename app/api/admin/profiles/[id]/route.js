import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { verifySessionToken } from '../../../../../lib/auth';

// GET perfil individual
export async function GET(request, { params }) {
  try {
    const token = request.cookies.get('tsolutions_admin_session')?.value;
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
    const token = request.cookies.get('tsolutions_admin_session')?.value;
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
      color_primario = '#F97316',
      color_secundario = '#00E5FF',
      color_cta = '#F97316',
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
        telefono = $6,
        whatsapp = $7,
        correo = $8,
        url = $9,
        linkedin = $10,
        instagram = $11,
        facebook = $12,
        calle = $13,
        ciudad = $14,
        estado = $15,
        cp = $16,
        pais = $17,
        nota = $18,
        google_maps_url = $19,
        video_youtube_url = $20,
        theme = $21,
        font_family = $22,
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
        tags = $33,
        status = $34,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $35
      RETURNING *;
    `;

    const values = [
      mode, nombre, apellido, empresa, puesto,
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
    const token = request.cookies.get('tsolutions_admin_session')?.value;
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
      message: 'Perfil eliminado exitosamente de Google Cloud SQL',
      deleted: result.rows[0]
    });

  } catch (error) {
    console.error('Error al eliminar perfil en admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
