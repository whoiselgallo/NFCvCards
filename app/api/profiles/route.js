import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../lib/db';
import { getAgent, getAllAgents } from '../../../lib/vipPasses';
import { getPlatformAccessConfig } from '../../../lib/accessConfig';

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
        theme, font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
        logo_scale, cover_position_y, cover_zoom, logo_img, cover_photo, custom_layout, calendly_url, google_calendar_url, icloud_calendar_url, paypal_url, bank_details, pdf_url, referred_by, plan_tier
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26, $27, $28,
        $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42
      )
      RETURNING id, slug, created_at;
    `;

    const referredBy = data.referred_by || data.referredBy || formData.referred_by || formData.referredBy || null;
    const referringAgent = referredBy ? getAgent(referredBy) : null;

    if (referredBy && !referringAgent) {
      return NextResponse.json({ success: false, error: 'Código de agente inválido.' }, { status: 400 });
    }

    // Preparar JSON para custom_layout
    const customLayout = {
      logoPosition: design.logoPosition || 'center',
      infoAlignment: design.infoAlignment || 'center',
      socialIconShape: design.socialIconShape || 'circle',
      socialIconStyle: design.socialIconStyle || 'default',
      linksDisplayMode: design.linksDisplayMode || 'icons',
      hideBanner: !!design.hideBanner,
      hideBio: !!design.hideBio,
      hideContact: !!design.hideContact,
      hideSocial: !!design.hideSocial,
      hideMap: !!design.hideMap,
      hideVideo: !!design.hideVideo,
      customLabels: design.customLabels || {}
    };

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
      design.fontPrimary || design.fontFamily || 'Inter',
      design.fontPrimary || 'Inter',
      design.fontSecondary || 'Inter',
      design.colorPrimario || '#ff0003',
      design.colorSecundario || '#00E5FF',
      design.colorCTA || '#ff0003',
      design.logoScale || 100,
      design.coverPositionY || 50,
      design.coverZoom || 100,
      logoImg,
      coverPhoto,
      JSON.stringify(customLayout),
      formData.calendlyUrl || '',
      formData.googleCalendarUrl || '',
      formData.icloudCalendarUrl || '',
      formData.paypalUrl || '',
      formData.bankDetails || '',
      formData.pdfUrl || '',
      referredBy,
      'elite'
    ];

    const client = await pool.connect();
    let saved;
    try {
      await client.query('BEGIN');

      if (referringAgent) {
        const accessConfig = await getPlatformAccessConfig(pool);
        const canonicalSlugs = getAllAgents().map(agent => agent.slug.toLowerCase());
        await client.query('SELECT pg_advisory_xact_lock($1)', [250250]);

        const countResult = await client.query(`
          SELECT
            COUNT(*) FILTER (WHERE LOWER(referred_by) = $1)::int AS agent_count,
            COUNT(*) FILTER (WHERE LOWER(referred_by) = ANY($2::text[]))::int AS total_count
          FROM vcard_profiles
        `, [referringAgent.slug.toLowerCase(), canonicalSlugs]);
        const agentCount = countResult.rows[0]?.agent_count || 0;
        const totalCount = countResult.rows[0]?.total_count || 0;
        const agentQuota = Math.min(referringAgent.giftQuota || 50, accessConfig.agentFreePassLimit);

        if (agentCount >= agentQuota || totalCount >= accessConfig.agentFreePassLimit) {
          await client.query('ROLLBACK');
          return NextResponse.json({
            success: false,
            error: 'El lote de pases gratuitos de agentes se agotó.',
            code: 'AGENT_FREE_QUOTA_EXHAUSTED'
          }, { status: 409 });
        }
      }

      const result = await client.query(query, values);
      saved = result.rows[0];
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

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
