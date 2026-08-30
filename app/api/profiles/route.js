import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../lib/db';

export async function POST(request) {
  try {
    await initDb();
    const data = await request.json();

    const {
      mode = 'vcard',
      formData = {},
      design = {},
      logoImg = null,
      coverPhoto = null
    } = data;

    let baseSlug = (formData.nombre || 'card') + '-' + (formData.apellido || formData.empresa || 'profile');
    baseSlug = baseSlug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'vcard';

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${randomSuffix}`;

    const pool = getPool();
    const query = `
      INSERT INTO vcard_profiles (
        slug, mode, nombre, apellido, empresa, puesto,
        telefono, whatsapp, correo, url, linkedin, instagram, facebook,
        calle, ciudad, estado, cp, pais, nota, google_maps_url, video_youtube_url,
        theme, font_family, color_primario, color_secundario, color_cta,
        logo_scale, cover_position_y, cover_zoom, logo_img, cover_photo
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26,
        $27, $28, $29, $30, $31
      )
      RETURNING id, slug, created_at;
    `;

    const values = [
      slug,
      mode,
      formData.nombre || '',
      formData.apellido || '',
      formData.empresa || '',
      formData.puesto || '',
      formData.telefono || '',
      formData.whatsapp || '',
      formData.correo || '',
      formData.url || '',
      formData.linkedin || '',
      formData.instagram || '',
      formData.facebook || '',
      formData.calle || '',
      formData.ciudad || '',
      formData.estado || '',
      formData.cp || '',
      formData.pais || '',
      formData.nota || '',
      formData.googleMapsUrl || '',
      formData.videoYoutubeUrl || '',
      design.theme || 'modern',
      design.customFont?.trim() || design.fontFamily || 'Inter',
      design.colorPrimario || '#F97316',
      design.colorSecundario || '#00E5FF',
      design.colorCTA || '#F97316',
      design.logoScale || 100,
      design.coverPositionY || 50,
      design.coverZoom || 100,
      logoImg,
      coverPhoto
    ];

    const result = await pool.query(query, values);
    const saved = result.rows[0];

    return NextResponse.json({
      success: true,
      profile: saved,
      slug: saved.slug,
      message: 'Perfil guardado exitosamente en Google Cloud SQL'
    });

  } catch (error) {
    console.error('Error al guardar en Cloud SQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al conectar con la base de datos' },
      { status: 500 }
    );
  }
}
