import { NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/resend';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const to = body.to || 'javier.gallardo@tsolutionsipidd.com';
    const subject = body.subject || 'Hello World';
    const html = body.html || '<p>Congrats on sending your <strong>first email</strong>!</p>';
    const from = body.from || 'onboarding@resend.dev';

    const result = await sendEmail({ from, to, subject, html });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
