import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { requireCrmAdmin } from '../../../../../lib/crm';

export async function GET() {
     if (!await requireCrmAdmin()) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
     await initDb();
     const result = await getPool().query('SELECT * FROM crm_campaigns ORDER BY created_at DESC');
     return NextResponse.json({ success: true, campaigns: result.rows });
}

export async function POST(request) {
     try {
          if (!await requireCrmAdmin()) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
          const { name, channel = 'email', subject = '', body = '' } = await request.json();
          if (!String(name || '').trim()) return NextResponse.json({ success: false, error: 'El nombre es obligatorio.' }, { status: 400 });
          await initDb();
          const result = await getPool().query(`
      INSERT INTO crm_campaigns (name, channel, subject, body) VALUES ($1, $2, $3, $4) RETURNING *
    `, [String(name).trim(), channel, subject, body]);
          return NextResponse.json({ success: true, campaign: result.rows[0] });
     } catch (error) {
          return NextResponse.json({ success: false, error: error.message || 'No se pudo crear la campaña' }, { status: 500 });
     }
}
