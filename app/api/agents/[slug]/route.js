import { NextResponse } from 'next/server';
import { getAgent } from '../../../../lib/vipPasses';
import { getPool, initDb } from '../../../../lib/db';

export async function GET(request, context) {
  try {
    await initDb();
    const params = await context.params;
    const slug = params?.slug;
    const agent = getAgent(slug);

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agente no encontrado' }, { status: 404 });
    }

    const pool = getPool();
    const query = `
      SELECT id, slug, nombre, apellido, empresa, puesto, telefono, correo, status, views_count, created_at
      FROM vcard_profiles
      WHERE LOWER(referred_by) = LOWER($1)
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [agent.slug]);
    const cards = result.rows || [];
    const giftedCount = cards.length;
    const giftQuota = agent.giftQuota || 50;
    const remaining = Math.max(0, giftQuota - giftedCount);

    return NextResponse.json({
      success: true,
      agent: {
        slug: agent.slug,
        name: agent.name,
        company: agent.company,
        role: agent.role,
        giftQuota,
        giftedCount,
        remaining
      },
      cards
    });
  } catch (err) {
    console.error('Error in agent stats API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Permite al agente borrar una tarjeta (por duplicada o sin uso) y recuperar su cupo
export async function DELETE(request, context) {
  try {
    await initDb();
    const params = await context.params;
    const slug = params?.slug;
    const agent = getAgent(slug);

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agente no autorizado' }, { status: 404 });
    }

    const body = await request.json();
    const { cardId, cardSlug, reason } = body;

    if (!cardId && !cardSlug) {
      return NextResponse.json({ success: false, error: 'Identificador de tarjeta requerido' }, { status: 400 });
    }

    const pool = getPool();

    // 1. Verificar que la tarjeta efectivamente pertenezca al agente
    const checkQuery = `
      SELECT id, slug, nombre, apellido, empresa
      FROM vcard_profiles
      WHERE (id = $1 OR slug = $2) AND LOWER(referred_by) = LOWER($3)
      LIMIT 1;
    `;
    const checkRes = await pool.query(checkQuery, [cardId || -1, cardSlug || '', agent.slug]);

    if (!checkRes.rows || checkRes.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tarjeta no encontrada o no pertenece a tu cupo de agente' 
      }, { status: 404 });
    }

    const targetCard = checkRes.rows[0];

    // 2. Eliminar la tarjeta de vcard_profiles (o limpiar su vínculo)
    // También limpiamos registros de telemetría/feedback asociados si existieran
    try {
      await pool.query(`DELETE FROM feedback_responses WHERE profile_slug = $1`, [targetCard.slug]);
      await pool.query(`DELETE FROM telemetry_events WHERE profile_slug = $1`, [targetCard.slug]);
    } catch (e) {
      // Ignorar si las tablas accesorias no existen aún en esta instancia
    }

    const deleteQuery = `
      DELETE FROM vcard_profiles
      WHERE id = $1 AND LOWER(referred_by) = LOWER($2);
    `;
    await pool.query(deleteQuery, [targetCard.id, agent.slug]);

    // 3. Recalcular el conteo actual de tarjetas del agente
    const countQuery = `
      SELECT COUNT(*) as total
      FROM vcard_profiles
      WHERE LOWER(referred_by) = LOWER($1);
    `;
    const countRes = await pool.query(countQuery, [agent.slug]);
    const currentGifted = parseInt(countRes.rows[0]?.total || 0, 10);
    const giftQuota = agent.giftQuota || 50;
    const remaining = Math.max(0, giftQuota - currentGifted);

    return NextResponse.json({
      success: true,
      message: `Tarjeta de ${targetCard.nombre || targetCard.slug} eliminada correctamente. Se ha liberado 1 cupo de tu cuota.`,
      deletedCard: targetCard,
      reason: reason || 'No especificado',
      stats: {
        giftedCount: currentGifted,
        remaining
      }
    });
  } catch (err) {
    console.error('Error deleting agent card:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

