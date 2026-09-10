import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      profile_slug,
      referred_by,
      feedback_type = 'construction',
      ease_level = null,
      friendly_ui = null,
      fields_feedback = [],
      issues_reported = null,
      recommendations = '',
      rating = 5,
      nps_score = null,
      usage_highlights = [],
      client_email = null
    } = body;

    if (!feedback_type) {
      return NextResponse.json(
        { success: false, error: 'El tipo de feedback es obligatorio' },
        { status: 400 }
      );
    }

    await initDb();
    const pool = getPool();

    let profileId = null;
    let finalReferredBy = referred_by || null;

    if (profile_slug) {
      const pRes = await pool.query(
        'SELECT id, referred_by FROM vcard_profiles WHERE slug = $1 LIMIT 1',
        [profile_slug]
      );
      if (pRes.rows.length > 0) {
        profileId = pRes.rows[0].id;
        if (!finalReferredBy) finalReferredBy = pRes.rows[0].referred_by;
      }
    }

    // Insertar en card_feedback
    const insertQuery = `
      INSERT INTO card_feedback (
        profile_id,
        profile_slug,
        referred_by,
        feedback_type,
        ease_level,
        friendly_ui,
        fields_feedback,
        issues_reported,
        recommendations,
        rating,
        nps_score,
        usage_highlights,
        client_email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, created_at
    `;

    const result = await pool.query(insertQuery, [
      profileId,
      profile_slug || null,
      finalReferredBy,
      feedback_type,
      ease_level,
      friendly_ui,
      JSON.stringify(fields_feedback || []),
      issues_reported,
      recommendations,
      rating ? parseInt(rating, 10) : 5,
      nps_score ? parseInt(nps_score, 10) : null,
      JSON.stringify(usage_highlights || []),
      client_email
    ]);

    // Si tenemos el perfil, marcar la bandera correspondiente
    if (profileId) {
      if (feedback_type === 'construction') {
        await pool.query(
          'UPDATE vcard_profiles SET construction_feedback_completed = true WHERE id = $1',
          [profileId]
        );
      } else if (feedback_type === 'usage_experience') {
        await pool.query(
          'UPDATE vcard_profiles SET usage_feedback_completed = true WHERE id = $1',
          [profileId]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Retroalimentación registrada correctamente',
      feedbackId: result.rows[0]?.id
    });
  } catch (error) {
    console.error('Error guardando feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno guardando feedback: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const agentSlug = searchParams.get('agent');

    await initDb();
    const pool = getPool();

    let query = 'SELECT * FROM card_feedback ORDER BY created_at DESC LIMIT 100';
    let params = [];

    if (slug) {
      query = 'SELECT * FROM card_feedback WHERE profile_slug = $1 ORDER BY created_at DESC';
      params = [slug];
    } else if (agentSlug) {
      query = 'SELECT * FROM card_feedback WHERE referred_by = $1 ORDER BY created_at DESC';
      params = [agentSlug];
    }

    const res = await pool.query(query, params);
    return NextResponse.json({ success: true, count: res.rows.length, feedback: res.rows });
  } catch (error) {
    console.error('Error consultando feedback:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
