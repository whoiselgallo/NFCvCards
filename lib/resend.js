import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Enviar correo de prueba o transaccional
 */
export async function sendEmail({
  from = 'onboarding@resend.dev',
  to = 'javier.gallardo@tsolutionsipidd.com',
  subject = 'Hello World',
  html = '<p>Congrats on sending your <strong>first email</strong>!</p>'
}) {
  if (!resend) {
    throw new Error('RESEND_API_KEY no está configurada en las variables de entorno (.env).');
  }

  return await resend.emails.send({
    from,
    to,
    subject,
    html
  });
}
