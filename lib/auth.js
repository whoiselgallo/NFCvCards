import crypto from 'crypto';
import brandConfig from '../brand.config';
import { isAuthorizedAdminEmail } from './brand';

const AUTH_SECRET = process.env.AUTH_SECRET || 'rose-card-whitelabel-secret-key-2026-nfc-engine';
export const SESSION_COOKIE_NAME = brandConfig?.adminAuth?.sessionCookieName || 'rose_admin_session';

/**
 * Valida si el correo tiene permisos para acceder o registrarse como administrador
 */
export function isCorporateEmail(email) {
  return isAuthorizedAdminEmail(email);
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
  const durationDays = brandConfig?.adminAuth?.sessionDurationDays || 7;
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name || '',
    role: user.role || 'admin',
    exp: Date.now() + durationDays * 24 * 60 * 60 * 1000
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
