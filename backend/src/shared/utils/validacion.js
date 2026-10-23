export const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const LARGO_MINIMO_PASSWORD = 8;
export const TELEFONO_VALIDO = /^\+?[\d\s]{8,16}$/;

export const esTextoNoVacio = (v) => typeof v === 'string' && v.trim() !== '';
export const esIdValido = (v) => Number.isInteger(v) && v > 0;
