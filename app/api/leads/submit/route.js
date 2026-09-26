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

    // 4. Sincronización Automática con el CRM Nativo (crm_contacts)
    try {
      const emailClean = (lead_email || '').trim().toLowerCase();
      const phoneClean = (lead_phone || '').trim();
      const nameClean = lead_name.trim();
      const companyClean = (lead_company || '').trim();
      const noteClean = (lead_note || '').trim();

      // Lead Scoring inteligente según origen de contacto
      // NFC = 80 pts (interacción física alta intención), QR = 70 pts, Directo = 50 pts
      const initialScore = source_type === 'nfc' ? 80 : (source_type === 'qr' ? 70 : 50);

      // Buscar si el contacto ya existe por email o teléfono
      let existingContact = null;
      if (emailClean) {
        const byEmail = await pool.query(
          `SELECT id, display_name, phone_number, company_name, notes, lead_score FROM crm_contacts WHERE LOWER(email) = $1 LIMIT 1`,
          [emailClean]
        );
        if (byEmail.rows.length > 0) existingContact = byEmail.rows[0];
      }
      if (!existingContact && phoneClean) {
        const byPhone = await pool.query(
          `SELECT id, display_name, email, company_name, notes, lead_score FROM crm_contacts WHERE phone_number = $1 LIMIT 1`,
          [phoneClean]
        );
        if (byPhone.rows.length > 0) existingContact = byPhone.rows[0];
      }

      if (existingContact) {
        // Actualizar contacto existente: incrementar score (+15 pts), anexar interacción
        const newScore = Math.min((existingContact.lead_score || 50) + 15, 100);
        const dateStr = new Date().toISOString().slice(0, 10);
        const interactionNote = `\n[${dateStr} | vCard: ${slug} (${source_type.toUpperCase()})]: ${noteClean || 'Intercambio de contacto'}`;
        const updatedNotes = ((existingContact.notes || '') + interactionNote).trim();

        await pool.query(
          `UPDATE crm_contacts SET
            display_name = COALESCE(NULLIF($1, ''), display_name),
            company_name = COALESCE(NULLIF($2, ''), company_name),
            phone_number = COALESCE(NULLIF($3, ''), phone_number),
            notes = $4,
            lead_score = $5,
            status = CASE WHEN status = 'new' THEN 'contacted' ELSE status END,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $6`,
          [
            nameClean,
            companyClean,
            phoneClean,
            updatedNotes,
            newScore,
            existingContact.id
          ]
        );
      } else {
        // Insertar nuevo contacto en el CRM
        const noteText = noteClean
          ? `[vCard: ${slug} | Origen: ${source_type.toUpperCase()}] ${noteClean}`
          : `Contacto capturado desde vCard: ${slug} vía ${source_type.toUpperCase()}`;

        await pool.query(
          `INSERT INTO crm_contacts (
            external_id, source, display_name, company_name, phone_number, email, notes, status, lead_score
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (source, external_id) DO NOTHING`,
          [
            `vcard_lead_${leadInsertRes.rows[0].id}`,
            'vcard_lead',
            nameClean,
            companyClean,
            phoneClean,
            emailClean,
            noteText,
            'new',
            initialScore
          ]
        );
      }
    } catch (crmErr) {
      console.error('Error sincronizando lead con crm_contacts:', crmErr);
    }

    // 5. Disparar Webhooks de automatización (HubSpot, Salesforce, Zapier, Make)
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
