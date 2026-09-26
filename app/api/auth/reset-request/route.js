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

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { resend } = await import('../../../../lib/resend');
        if (resend) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: lower,
            subject: 'Recupera tu contraseña - ROSE Card',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #111;">Recuperación de Contraseña</h2>
                <p>Has solicitado restablecer tu contraseña en la plataforma.</p>
                <p style="margin: 24px 0;">
                  <a href="${resetUrl}" style="background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Restablecer Contraseña
                  </a>
                </p>
                <p style="color: #666; font-size: 13px;">Si no solicitaste este cambio, puedes ignorar este correo con total seguridad. Este enlace expirará en 30 minutos.</p>
              </div>
            `
          });
        }
      } catch (emailErr) {
        console.error('[reset-request:email-error]', emailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[reset-request]', err);
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 });
  }
}
