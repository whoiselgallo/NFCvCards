import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPool } from '../../../../lib/db';

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, 'rose_salt_2026', 1000, 64, 'sha512').toString('hex');
}

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token y contraseña requeridos.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres.' }, { status: 400 });
    }

    const pool = getPool();

    // Validate token and expiry
    const { rows } = await pool.query(
      `SELECT user_id, expires_at
       FROM password_reset_tokens
       WHERE token = $1`,
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Enlace inválido o ya fue usado.' }, { status: 400 });
    }

    const { user_id, expires_at } = rows[0];

    if (new Date() > new Date(expires_at)) {
      await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
      return NextResponse.json({ error: 'El enlace de recuperación ha expirado. Solicita uno nuevo.' }, { status: 400 });
    }

    // Update password
    const hashed = hashPassword(password);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, user_id]);

    // Invalidate token
    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [user_id]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[reset-password]', err);
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 });
  }
}
