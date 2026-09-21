import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { requireCrmAdmin } from '../../../../../lib/crm';

export async function POST(request) {
     try {
          if (!await requireCrmAdmin()) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
          const { contactId, consentType = 'marketing', source = 'manual', revoked = false } = await request.json();
          if (!Number.isInteger(Number(contactId))) return NextResponse.json({ success: false, error: 'Contacto inválido.' }, { status: 400 });
          await initDb();
          const pool = getPool();
          const client = await pool.connect();
          try {
               await client.query('BEGIN');
               if (revoked) {
                    await client.query(`UPDATE crm_consent_log SET revoked_at = CURRENT_TIMESTAMP WHERE contact_id = $1 AND consent_type = $2 AND revoked_at IS NULL`, [contactId, consentType]);
                    await client.query(`UPDATE crm_contacts SET do_not_contact = true, status = 'do_not_contact', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [contactId]);
               } else {
                    await client.query(`INSERT INTO crm_consent_log (contact_id, consent_type, source) VALUES ($1, $2, $3)`, [contactId, consentType, source]);
                    await client.query(`UPDATE crm_contacts SET do_not_contact = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [contactId]);
               }
               await client.query('COMMIT');
          } catch (error) {
               await client.query('ROLLBACK');
               throw error;
          } finally {
               client.release();
          }
          return NextResponse.json({ success: true });
     } catch (error) {
          return NextResponse.json({ success: false, error: error.message || 'No se pudo registrar el consentimiento' }, { status: 500 });
     }
}
