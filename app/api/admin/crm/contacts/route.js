import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { requireCrmAdmin, CRM_STATUSES } from '../../../../../lib/crm';

export async function GET(request) {
     try {
          if (!await requireCrmAdmin()) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
          await initDb();
          const { searchParams } = new URL(request.url);
          const search = (searchParams.get('search') || '').trim();
          const status = searchParams.get('status') || '';
          const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 100, 1), 500);
          const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);
          const pool = getPool();
          const values = [];
          const filters = [];

          if (search) {
               values.push(`%${search}%`);
               filters.push(`(company_name ILIKE $${values.length} OR display_name ILIKE $${values.length} OR email ILIKE $${values.length} OR phone_number ILIKE $${values.length} OR city ILIKE $${values.length} OR state ILIKE $${values.length})`);
          }
          if (status && CRM_STATUSES.includes(status)) {
               values.push(status);
               filters.push(`status = $${values.length}`);
          }

          const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
          const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM crm_contacts ${where}`, values);
          values.push(limit, offset);
          const result = await pool.query(`
      SELECT * FROM crm_contacts
      ${where}
      ORDER BY updated_at DESC, id DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `, values);

          return NextResponse.json({ success: true, contacts: result.rows, total: countResult.rows[0]?.total || 0, statuses: CRM_STATUSES });
     } catch (error) {
          console.error('Error al consultar CRM:', error);
          return NextResponse.json({ success: false, error: 'No se pudieron cargar los contactos' }, { status: 500 });
     }
}

export async function PATCH(request) {
     try {
          if (!await requireCrmAdmin()) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
          const body = await request.json();
          const id = Number(body.id);
          if (!Number.isInteger(id) || id < 1) return NextResponse.json({ success: false, error: 'Contacto inválido' }, { status: 400 });
          if (body.status && !CRM_STATUSES.includes(body.status)) return NextResponse.json({ success: false, error: 'Estado inválido' }, { status: 400 });
          await initDb();
          const pool = getPool();
          const result = await pool.query(`
      UPDATE crm_contacts
      SET status = COALESCE($1, status),
          lead_score = COALESCE($2, lead_score),
          do_not_contact = COALESCE($3, do_not_contact),
          notes = COALESCE($4, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [body.status || null, body.leadScore == null ? null : Number(body.leadScore), body.doNotContact == null ? null : Boolean(body.doNotContact), body.notes == null ? null : String(body.notes), id]);
          if (!result.rows.length) return NextResponse.json({ success: false, error: 'Contacto no encontrado' }, { status: 404 });
          return NextResponse.json({ success: true, contact: result.rows[0] });
     } catch (error) {
          console.error('Error al actualizar contacto CRM:', error);
          return NextResponse.json({ success: false, error: 'No se pudo actualizar el contacto' }, { status: 500 });
     }
}
