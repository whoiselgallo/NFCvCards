import JSZip from 'jszip';
import crypto from 'crypto';

// Minimal PNG transparente de 1x1 píxel en Base64 para fallback de iconos PassKit
const BASE64_1X1_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const MINIMAL_PNG_BUFFER = Buffer.from(BASE64_1X1_PNG, 'base64');

/**
 * Convierte color hex (#E11D48 o #FFF) a formato rgb(...) para Apple PassKit
 */
function hexToRgbString(hex, defaultRgb = 'rgb(225, 29, 72)') {
  if (!hex || typeof hex !== 'string') return defaultRgb;
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) return defaultRgb;
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Genera el archivo binario Buffer (.pkpass) de Apple Wallet para un perfil vCard
 */
export async function generateApplePass(profile = {}, originUrl = 'https://rosecard.io') {
  const slug = profile.slug || 'tarjeta-nfc';
  const nombre = profile.nombre || 'Contacto';
  const apellido = profile.apellido || '';
  const fullName = `${nombre} ${apellido}`.trim();
  const empresa = profile.empresa || 'Empresa';
  const puesto = profile.puesto || 'Tarjeta Digital NFC';
  const telefono = profile.telefono || profile.whatsapp || '';
  const correo = profile.correo || '';
  const url = profile.url || '';

  const profileUrl = `${originUrl}/p/${slug}`;

  // 1. Estructura JSON del pase PassKit (pass.json)
  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || 'pass.com.t-solutions.nfc',
    serialNumber: `nfc-${slug}-${Date.now()}`,
    teamIdentifier: process.env.APPLE_TEAM_ID || 'TSOLUTIONS_TEAM',
    organizationName: 'TSolutions NFC Digital Identity',
    description: `Tarjeta Digital NFC - ${fullName}`,
    logoText: empresa || fullName,
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: hexToRgbString(profile.color_primario, 'rgb(15, 23, 42)'),
    labelColor: hexToRgbString(profile.color_secundario, 'rgb(225, 29, 72)'),
    barcodes: [
      {
        format: 'PKBarcodeFormatQR',
        message: profileUrl,
        messageEncoding: 'iso-8859-1',
        altText: 'Escanear para perfil completo NFC'
      }
    ],
    generic: {
      primaryFields: [
        {
          key: 'name',
          label: 'CONTACTO DIGITAL',
          value: fullName
        }
      ],
      secondaryFields: [
        {
          key: 'job',
          label: 'PUESTO',
          value: puesto
        },
        {
          key: 'company',
          label: 'EMPRESA',
          value: empresa
        }
      ],
      auxiliaryFields: [
        ...(telefono ? [{ key: 'phone', label: 'TELÉFONO', value: telefono }] : []),
        ...(correo ? [{ key: 'email', label: 'CORREO', value: correo }] : [])
      ],
      backFields: [
        {
          key: 'card_url',
          label: 'ENLACE AL PERFIL DIGITAL',
          value: profileUrl
        },
        ...(url ? [{ key: 'website', label: 'SITIO WEB', value: url }] : []),
        {
          key: 'powered',
          label: 'TECNOLOGÍA',
          value: 'TSOLUTIONS IPIDD • vCard & Review Engine'
        }
      ]
    }
  };

  const passJsonBuffer = Buffer.from(JSON.stringify(passJson, null, 2), 'utf8');

  // 2. Colección de archivos que componen el paquete .pkpass
  const files = {
    'pass.json': passJsonBuffer,
    'icon.png': MINIMAL_PNG_BUFFER,
    'icon@2x.png': MINIMAL_PNG_BUFFER,
    'logo.png': MINIMAL_PNG_BUFFER,
    'logo@2x.png': MINIMAL_PNG_BUFFER
  };

  // 3. Generar manifest.json conteniendo SHA-1 de cada archivo
  const manifest = {};
  for (const [filename, buffer] of Object.entries(files)) {
    const hash = crypto.createHash('sha1').update(buffer).digest('hex');
    manifest[filename] = hash;
  }
  const manifestBuffer = Buffer.from(JSON.stringify(manifest, null, 2), 'utf8');
  files['manifest.json'] = manifestBuffer;

  // 4. Generar firma PKCS#7 (signature)
  let signatureBuffer;
  const certPem = process.env.APPLE_PASS_CERT;
  const keyPem = process.env.APPLE_PASS_KEY;

  if (certPem && keyPem) {
    try {
      // Si las claves de certificado existen en .env, firmar manifest con RSA-SHA256
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(manifestBuffer);
      signatureBuffer = signer.sign(keyPem);
    } catch (err) {
      console.warn('Advertencia al firmar Apple PassKit manifest:', err.message);
      signatureBuffer = Buffer.from('UNSIGNED_MOCK_SIGNATURE', 'utf8');
    }
  } else {
    // Si no están configurados los certificados Apple Developer en .env, usar firma dummy
    signatureBuffer = Buffer.from('UNSIGNED_MOCK_SIGNATURE', 'utf8');
  }

  files['signature'] = signatureBuffer;

  // 5. Empaquetar en archivo ZIP (.pkpass)
  const zip = new JSZip();
  for (const [filename, buffer] of Object.entries(files)) {
    zip.file(filename, buffer);
  }

  const pkpassBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  return pkpassBuffer;
}
