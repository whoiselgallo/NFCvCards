import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { requireCrmAdmin, parseCsv, mapDenueRow, hasContactChannel } from '../../../../../lib/crm';

export async function POST(request) {
     try {
          if (!await requireCrmAdmin()) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
          const formData = await request.formData();
          const file = formData.get('file');
          if (!file || typeof file.text !== 'function') return NextResponse.json({ success: false, error: 'Selecciona un archivo CSV.' }, { status: 400 });
          if (Number(file.size) > 25 * 1024 * 1024) return NextResponse.json({ success: false, error: 'El CSV supera el límite de 25 MB.' }, { status: 413 });

          const rows = parseCsv(await file.text());
          if (!rows.length) return NextResponse.json({ success: false, error: 'El CSV no contiene registros.' }, { status: 400 });
          if (rows.length > 100000) return NextResponse.json({ success: false, error: 'El CSV supera el límite de 100,000 registros por lote.' }, { status: 413 });
          await initDb();
          const pool = getPool();
          const client = await pool.connect();
          let importedCount = 0;
          let updatedCount = 0;
          let rejectedCount = 0;
          const errors = [];

          try {
               await client.query('BEGIN');
               const batch = await client.query(`
        INSERT INTO crm_import_batches (filename, source) VALUES ($1, 'DENUE_INEGI') RETURNING id
      `, [file.name || 'denue_import.csv']);
               const batchId = batch.rows[0].id;

               for (const [index, rawRow] of rows.entries()) {
                    const contact = mapDenueRow(rawRow);
                    if (!contact.externalId || !hasContactChannel(contact)) {
                         rejectedCount += 1;
                         if (errors.length < 20) errors.push({ row: index + 2, reason: 'Falta id o teléfono, correo y sitio web.' });
                         continue;
                    }

                    const result = await client.query(`
          INSERT INTO crm_contacts (
            external_id, source, company_name, legal_name, display_name, industry,
            phone_number, email, website, street_address, neighborhood, city, state,
            postal_code, latitude, longitude
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (source, external_id) DO UPDATE SET
            company_name = EXCLUDED.company_name,
            legal_name = EXCLUDED.legal_name,
            display_name = EXCLUDED.display_name,
            industry = EXCLUDED.industry,
            phone_number = EXCLUDED.phone_number,
            email = EXCLUDED.email,
            website = EXCLUDED.website,
            street_address = EXCLUDED.street_address,
            neighborhood = EXCLUDED.neighborhood,
            city = EXCLUDED.city,
            state = EXCLUDED.state,
            postal_code = EXCLUDED.postal_code,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            updated_at = CURRENT_TIMESTAMP
          RETURNING (xmax = 0) AS inserted
        `, [contact.externalId, contact.source, contact.companyName, contact.legalName, contact.displayName, contact.industry, contact.phoneNumber, contact.email, contact.website, contact.streetAddress, contact.neighborhood, contact.city, contact.state, contact.postalCode, contact.latitude, contact.longitude]);
                    if (result.rows[0]?.inserted) importedCount += 1;
                    else updatedCount += 1;
               }

               await client.query(`
        UPDATE crm_import_batches
        SET imported_count = $1, updated_count = $2, rejected_count = $3, errors = $4
        WHERE id = $5
      `, [importedCount, updatedCount, rejectedCount, JSON.stringify(errors), batchId]);
               await client.query('COMMIT');
          } catch (error) {
               await client.query('ROLLBACK');
               throw error;
          } finally {
               client.release();
          }

          return NextResponse.json({ success: true, importedCount, updatedCount, rejectedCount, errors });
     } catch (error) {
          console.error('Error al importar CRM:', error);
          return NextResponse.json({ success: false, error: error.message || 'No se pudo importar el CSV' }, { status: 500 });
     }
}
