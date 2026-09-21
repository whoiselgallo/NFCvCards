import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { requireCrmAdmin } from '../../../../../lib/crm';

function escapeVCard(value) {
     return String(value || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

export async function GET(request) {
     try {
          if (!await requireCrmAdmin()) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
          await initDb();
          const { searchParams } = new URL(request.url);
          const format = searchParams.get('format') === 'vcf' ? 'vcf' : 'csv';
          const result = await getPool().query(`
      SELECT * FROM crm_contacts
      WHERE do_not_contact = false
      ORDER BY id DESC
      LIMIT 10000
    `);
          const contacts = result.rows;

          if (format === 'vcf') {
               const content = contacts.map(contact => [
                    'BEGIN:VCARD', 'VERSION:3.0', `FN:${escapeVCard(contact.display_name || contact.company_name)}`,
                    `ORG:${escapeVCard(contact.legal_name || contact.company_name)}`,
                    `TITLE:${escapeVCard(contact.industry)}`,
                    contact.phone_number && `TEL;TYPE=WORK,VOICE:${escapeVCard(contact.phone_number)}`,
                    contact.email && `EMAIL;TYPE=WORK:${escapeVCard(contact.email)}`,
                    contact.website && `URL:${escapeVCard(contact.website)}`,
                    `ADR;TYPE=WORK:;;${escapeVCard(contact.street_address)};${escapeVCard(contact.city)};${escapeVCard(contact.state)};${escapeVCard(contact.postal_code)};Mexico`,
                    contact.latitude != null && contact.longitude != null && `GEO:${contact.latitude};${contact.longitude}`,
                    'END:VCARD'
               ].filter(Boolean).join('\r\n')).join('\r\n');
               return new NextResponse(`${content}\r\n`, { headers: { 'Content-Type': 'text/vcard; charset=utf-8', 'Content-Disposition': 'attachment; filename="rose_crm_contacts.vcf"' } });
          }

          const headers = ['external_id', 'source', 'company_name', 'legal_name', 'display_name', 'industry', 'phone_number', 'email', 'website', 'street_address', 'neighborhood', 'city', 'state', 'postal_code', 'latitude', 'longitude', 'status', 'lead_score'];
          const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
          const content = [headers.join(','), ...contacts.map(contact => headers.map(header => quote(contact[header])).join(','))].join('\n');
          return new NextResponse(`\uFEFF${content}\n`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="rose_crm_contacts.csv"' } });
     } catch (error) {
          return NextResponse.json({ success: false, error: 'No se pudo exportar el CRM' }, { status: 500 });
     }
}
