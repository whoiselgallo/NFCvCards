import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'tsolutions-ipidd-super-secret-key-2026-nfc-engine';
const REQUIRED_DOMAIN = '@tsolutionsipidd.com';

/**
 * Valida si el correo pertenece exclusivamente al dominio corporativo @tsolutionsipidd.com
 */
export function isCorporateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return clean.endsWith(REQUIRED_DOMAIN) && clean.length > REQUIRED_DOMAIN.length;
}

/**
 * Genera un hash seguro con PBKDF2 y salt criptográfico
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

/**
 * Verifica la contraseña comparándola con el salt y hash almacenados
 */
export function verifyPassword(password, storedHash, storedSalt) {
  if (!password || !storedHash || !storedSalt) return false;
  const hash = crypto.pbkdf2Sync(password, storedSalt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Crea un token de sesión firmado para la cookie HTTP-Only
 */
export function createSessionToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name || '',
    role: user.role || 'admin',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 días de validez
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadBase64).digest('base64url');
  return `${payloadBase64}.${signature}`;
}

/**
 * Verifica y decodifica un token de sesión
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadBase64).digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return null; // Expirado
    return payload;
  } catch (err) {
    return null;
  }
}
