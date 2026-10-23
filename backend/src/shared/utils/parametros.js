import { HttpError } from './httpError.js';

// Valida el :id de la ruta como entero positivo
export function parseId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Id inválido');
  return id;
}
