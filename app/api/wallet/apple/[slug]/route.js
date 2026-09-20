import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../../lib/db';
import { generateApplePass } from '../../../../../lib/wallet/applePass';

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

    // Determinar la URL origen de la solicitud
    const host = request.headers.get('host') || 'rosecard.io';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const originUrl = `${protocol}://${host}`;

    // Generar binario .pkpass de Apple Wallet
    const pkpassBuffer = await generateApplePass(profile, originUrl);

    // Registrar evento de analítica (Apple Wallet Download)
    try {
      const userAgent = request.headers.get('user-agent') || '';
      await pool.query(
        `INSERT INTO analytics_events (profile_id, profile_slug, event_type, user_agent, device_type)
         VALUES ($1, $2, 'apple_wallet_download', $3, 'ios')`,
        [profile.id, slug, userAgent]
      );
    } catch (analyticsErr) {
      console.warn('Advertencia al guardar analítica de Apple Wallet:', analyticsErr.message);
    }

    return new NextResponse(pkpassBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${slug}.pkpass"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error al generar Apple Wallet Pass:', error);
    return NextResponse.json({ success: false, error: 'Error al generar Apple Wallet Pass' }, { status: 500 });
  }
}
