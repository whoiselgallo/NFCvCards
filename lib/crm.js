import { getServerSession } from 'next-auth/next';
import { authOptions } from './nextAuthOptions';

export const CRM_STATUSES = ['new', 'qualified', 'contacted', 'interested', 'customer', 'not_interested', 'do_not_contact'];

const ADMIN_EMAILS = new Set([
     'javier.gallardo@tsolutionsipidd.com',
     'whoiselgallo@gmail.com',
     'contacto@tsolutionsipidd.com',
     'admin@tsolutionsipidd.com'
]);

export async function requireCrmAdmin() {
     const session = await getServerSession(authOptions);
     const email = session?.user?.email?.toLowerCase() || '';
     if (!ADMIN_EMAILS.has(email) && !email.endsWith('@tsolutionsipidd.com')) return null;
     return session;
}

export function cleanPhone(value) {
     const digits = String(value || '').replace(/\D/g, '');
     return digits.length >= 10 ? digits.slice(-10) : '';
}

export function cleanPostalCode(value) {
     const digits = String(value || '').replace(/\D/g, '');
     return digits ? digits.padStart(5, '0').slice(-5) : '';
}

export function cleanUrl(value) {
     const raw = String(value || '').trim();
     if (!raw) return '';
     return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export function cleanCoordinate(value, min, max) {
     const number = Number(String(value || '').replace(',', '.'));
     return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

export function parseCsv(text) {
     const rows = [];
     let row = [];
     let cell = '';
     let quoted = false;

     for (let index = 0; index < text.length; index += 1) {
          const char = text[index];
          const next = text[index + 1];
          if (char === '"' && quoted && next === '"') {
               cell += '"';
               index += 1;
          } else if (char === '"') {
               quoted = !quoted;
          } else if (char === ',' && !quoted) {
               row.push(cell);
               cell = '';
          } else if ((char === '\n' || char === '\r') && !quoted) {
               if (char === '\r' && next === '\n') index += 1;
               row.push(cell);
               if (row.some(value => value.trim() !== '')) rows.push(row);
               row = [];
               cell = '';
          } else {
               cell += char;
          }
     }

     row.push(cell);
     if (row.some(value => value.trim() !== '')) rows.push(row);
     if (!rows.length) return [];

     const headers = rows.shift().map(header => header.replace(/^\uFEFF/, '').trim().toLowerCase());
     return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()])));
}

export function mapDenueRow(row) {
     const companyName = row.nom_estab || row.nom_establecimiento || '';
     const street = [row.tipo_vial, row.nom_vial, row.numero_ext].filter(Boolean).join(' ');
     return {
          externalId: row.id || '',
          source: 'DENUE_INEGI',
          companyName,
          legalName: row.raz_social || '',
          displayName: companyName || row.raz_social || '',
          industry: row.nombre_act || '',
          phoneNumber: cleanPhone(row.telefono),
          email: String(row.correoelec || '').trim().toLowerCase(),
          website: cleanUrl(row.www),
          streetAddress: street,
          neighborhood: row.nomb_asent || '',
          city: row.municipio || '',
          state: row.entidad || '',
          postalCode: cleanPostalCode(row.cod_postal),
          latitude: cleanCoordinate(row.latitud, -90, 90),
          longitude: cleanCoordinate(row.longitud, -180, 180)
     };
}

export function hasContactChannel(contact) {
     return Boolean(contact.phoneNumber || contact.email || contact.website);
}
