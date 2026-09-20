import crypto from 'crypto';

/**
 * Convierte un objeto o buffer a string Base64URL (compatible con spec de JWT / RFC 7515)
 */
function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(typeof input === 'string' ? input : JSON.stringify(input));
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Genera la URL firmada (JWT) de Google Wallet ("Save to Google Wallet") para un perfil vCard
 */
export function generateGoogleWalletUrl(profile = {}, originUrl = 'https://rosecard.io') {
  const slug = profile.slug || 'tarjeta-nfc';
  const nombre = profile.nombre || 'Contacto';
  const apellido = profile.apellido || '';
  const fullName = `${nombre} ${apellido}`.trim();
  const empresa = profile.empresa || 'Empresa';
  const puesto = profile.puesto || 'Tarjeta Digital NFC';
  const telefono = profile.telefono || profile.whatsapp || '';
  const correo = profile.correo || '';

  const profileUrl = `${originUrl}/p/${slug}`;
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || '3388000000022119900';
  const serviceAccountEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL || 'service-account@tsolutions-nfc.iam.gserviceaccount.com';
  let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY || '';

  // Limpiar saltos de línea de la clave privada de Google si viene escapada en .env
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // 1. Header de JWT
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  // 2. Payload de Google Wallet Generic Object Pass
  const payload = {
    iss: serviceAccountEmail,
    aud: 'google',
    typ: 'savetowallet',
    iat: Math.floor(Date.now() / 1000),
    origins: [originUrl],
    payload: {
      genericObjects: [
        {
          id: `${issuerId}.nfc_${slug}_${Date.now()}`,
          classId: `${issuerId}.nfc_vcard_class`,
          state: 'ACTIVE',
          cardTitle: {
            defaultValue: {
              language: 'es',
              value: empresa || 'Tarjeta Digital NFC'
            }
          },
          header: {
            defaultValue: {
              language: 'es',
              value: fullName
            }
          },
          subheader: {
            defaultValue: {
              language: 'es',
              value: puesto
            }
          },
          barcode: {
            type: 'QR_CODE',
            value: profileUrl,
            alternateText: 'Escanear Perfil NFC'
          },
          textModulesData: [
            ...(telefono ? [{ header: 'TELÉFONO', body: telefono, id: 'phone' }] : []),
            ...(correo ? [{ header: 'CORREO', body: correo, id: 'email' }] : []),
            { header: 'PERFIL DIGITAL', body: profileUrl, id: 'card_url' }
          ],
          hexBackgroundColor: profile.color_primario || '#e11d48'
        }
      ]
    }
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const tokenToSign = `${encodedHeader}.${encodedPayload}`;

  let signature = '';
  if (privateKey) {
    try {
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(tokenToSign);
      const signatureBuffer = signer.sign(privateKey);
      signature = base64UrlEncode(signatureBuffer);
    } catch (err) {
      console.warn('Advertencia al firmar JWT de Google Wallet:', err.message);
      signature = base64UrlEncode(Buffer.from('MOCK_GOOGLE_WALLET_SIGNATURE', 'utf8'));
    }
  } else {
    signature = base64UrlEncode(Buffer.from('MOCK_GOOGLE_WALLET_SIGNATURE', 'utf8'));
  }

  const jwtToken = `${tokenToSign}.${signature}`;
  return `https://pay.google.com/gp/v/save/${jwtToken}`;
}
