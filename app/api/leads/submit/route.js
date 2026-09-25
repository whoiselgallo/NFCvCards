import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../lib/db';

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const {
      slug,
      lead_name,
      lead_email = '',
      lead_phone = '',
      lead_company = '',
      lead_note = '',
      source_type = 'direct'
    } = body;

    if (!slug || !lead_name) {
      return NextResponse.json(
        { success: false, error: 'Slug y Nombre del contacto son obligatorios' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // 1. Obtener perfil para vincular profile_id
    const profileRes = await pool.query(
      `SELECT id, correo, whatsapp, nombre FROM vcard_profiles WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    const profile = profileRes.rows[0];
    const profileId = profile ? profile.id : null;

    // 2. Insertar Lead Bidireccional
    const leadInsertRes = await pool.query(
      `INSERT INTO card_leads (
        profile_id, slug, lead_name, lead_email, lead_phone, lead_company, lead_note, source_type, notified_owner
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at`,
      [
        profileId,
        slug,
        lead_name.trim(),
        lead_email.trim(),
        lead_phone.trim(),
        lead_company.trim(),
        lead_note.trim(),
        source_type,
        true
      ]
    );

    // 3. Registrar Evento de Telemetría Structured Event
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    await pool.query(
      `INSERT INTO card_events (
        profile_id, slug, source_type, event_type, user_agent, ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [profileId, slug, source_type, 'lead_submit', userAgent, ip]
    );

    // 4. Disparar Webhooks de automatización (HubSpot, Salesforce, Zapier, Make)
    try {
      const { dispatchWebhook } = await import('../../../../lib/webhooks');
      dispatchWebhook('lead_submit', {
        lead_id: leadInsertRes.rows[0].id,
        slug,
        profile_id: profileId,
        lead_name,
        lead_email,
        lead_phone,
        lead_company,
        lead_note,
        source_type,
        created_at: leadInsertRes.rows[0].created_at
      });
    } catch (whErr) {
      console.error('Error enviando webhook:', whErr);
    }

    return NextResponse.json({
      success: true,
      lead: leadInsertRes.rows[0],
      message: '¡Contacto enviado exitosamente al propietario de la tarjeta!'
    });

  } catch (error) {
    console.error('Error al guardar lead bidireccional:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar el contacto' },
      { status: 500 }
    );
  }
}
