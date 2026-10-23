import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const LARGO_HASH = 64;

// Formato guardado: scrypt$<salt hex>$<hash hex>
export async function hashPassword(plano) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(plano, salt, LARGO_HASH);
  return `scrypt$${salt}$${hash.toString('hex')}`;
}

export async function verificarPassword(plano, guardado) {
  const [algoritmo, salt, hashHex] = String(guardado ?? '').split('$');
  if (algoritmo !== 'scrypt' || !salt || !hashHex) return false;
  const esperado = Buffer.from(hashHex, 'hex');
  const hash = await scrypt(plano, salt, esperado.length || LARGO_HASH);
  return esperado.length === hash.length && timingSafeEqual(esperado, hash);
}
