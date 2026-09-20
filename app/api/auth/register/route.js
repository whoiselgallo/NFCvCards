import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';
import { isOrganizationEmail } from '../../../../lib/brand';
import { getPlatformAccessConfig, isEmailInDomains } from '../../../../lib/accessConfig';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, 'rose_salt_2026', 1000, 64, 'sha512').toString('hex');
}

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const pool = getPool();
    const client = await pool.connect();
    const accessConfig = await getPlatformAccessConfig(pool);
    const hasFreeDomain = isOrganizationEmail(email) || isEmailInDomains(email, accessConfig.freeDomains);

    // Auto-create column if missing
    try {
      await client.query('ALTER TABLE users ADD COLUMN password_hash TEXT;');
    } catch (e) { }

    const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (res.rows.length > 0) {
      client.release();
      return NextResponse.json({ success: false, error: 'El correo ya est registrado' }, { status: 400 });
    }

    const hashed = hashPassword(password);
    await client.query(
      'INSERT INTO users (name, email, password_hash, plan_id, card_limit) VALUES ($1, $2, $3, $4, $5)',
      [name, email, hashed, hasFreeDomain ? 'elite' : 'free', hasFreeDomain ? accessConfig.organizationCardLimit : 1]
    );
    client.release();

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
