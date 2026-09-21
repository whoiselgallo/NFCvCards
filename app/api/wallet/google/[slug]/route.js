import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { generateGoogleWalletUrl } from '../../../../../lib/wallet/googlePass';

export async function GET(request, context) {
  try {
    await initDb();
    const params = await context.params;
    const slug = params?.slug;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug no proporcionado' }, { status: 400 });
    }

    const pool = getPool();
    const result = await pool.query('SELECT * FROM vcard_profiles WHERE LOWER(slug) = LOWER($1) LIMIT 1', [slug]);
    const profile = result.rows[0];

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Perfil no encontrado' }, { status: 404 });
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'rosecard.io';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const originUrl = `${protocol}://${host}`;

    let googleWalletUrl;
    try {
      googleWalletUrl = generateGoogleWalletUrl(profile, originUrl);
    } catch (walletError) {
      console.error('Configuración de Google Wallet inválida:', walletError.message);
      return NextResponse.json({
        success: false,
        error: 'Google Wallet aún no está configurado en este servidor.',
        details: process.env.NODE_ENV === 'development' ? walletError.message : undefined
      }, { status: 503 });
    }

    // Registrar evento de analítica (Google Wallet Download)
    try {
      const userAgent = request.headers.get('user-agent') || '';
      await pool.query(
        `INSERT INTO analytics_events (profile_id, profile_slug, event_type, user_agent, device_type)
         VALUES ($1, $2, 'google_wallet_download', $3, 'android')`,
        [profile.id, slug, userAgent]
      );
    } catch (analyticsErr) {
      console.warn('Advertencia al guardar analítica de Google Wallet:', analyticsErr.message);
    }

    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('application/json')) {
      return NextResponse.json({ success: true, url: googleWalletUrl });
    }

    // Por defecto redirigir al flujo de guardado nativo de Google Wallet
    return NextResponse.redirect(googleWalletUrl, 303);
  } catch (error) {
    console.error('Error al generar Google Wallet Link:', error);
    return NextResponse.json({ success: false, error: 'Error al generar enlace de Google Wallet' }, { status: 500 });
  }
}
