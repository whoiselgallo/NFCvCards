import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const path = url.pathname;

  // Interceptar visitas a tarjetas públicas (/p/[slug] o /pass/[slug])
  if (path.startsWith('/p/') || path.startsWith('/pass/')) {
    const srcParam = url.searchParams.get('src') || url.searchParams.get('ref') || url.searchParams.get('utm_source');
    let sourceType = 'direct';

    if (srcParam) {
      const lower = srcParam.toLowerCase();
      if (lower === 'nfc' || lower.includes('nfc') || lower.includes('chip')) {
        sourceType = 'nfc';
      } else if (lower === 'qr' || lower.includes('qr') || lower.includes('code')) {
        sourceType = 'qr';
      } else if (lower === 'wallet' || lower.includes('apple') || lower.includes('google')) {
        sourceType = 'wallet';
      } else if (lower === 'share' || lower.includes('wa') || lower.includes('link')) {
        sourceType = 'share';
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-rose-source-type', sourceType);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/p/:slug*', '/pass/:slug*'],
};
