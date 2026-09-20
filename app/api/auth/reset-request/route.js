import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPool } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Correo requerido.' }, { status: 400 });
    }

    const pool = getPool();
    const lower = email.trim().toLowerCase();

    // Check if user exists — don't reveal if they do or don't (security)
    const { rows } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [lower]
    );

    if (rows.length === 0) {
      // Respond with success anyway to avoid user enumeration
      return NextResponse.json({ ok: true });
    }

    const userId = rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store token (upsert per user)
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at`,
      [userId, token, expiresAt]
    );

    const baseUrl = process.env.NEXTAUTH_URL || 'https://vc.tsolutionsipidd.com';
    const resetUrl = `${baseUrl}/recuperar-contrasena?token=${token}&email=${encodeURIComponent(lower)}`;

    // Log the reset link to server console (for now — replace with email service later)
    console.log(`[PASSWORD RESET] ${lower} → ${resetUrl}`);

    // TODO: Send email via Resend or Nodemailer when email service is configured
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: 'noreply@tsolutionsipidd.com', to: lower,
    //   subject: 'Recupera tu contraseña', html: `<a href="${resetUrl}">Recuperar contraseña</a>` });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[reset-request]', err);
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 });
  }
}
