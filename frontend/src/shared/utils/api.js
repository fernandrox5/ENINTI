import { leerToken } from './sesion.js';

// Cliente HTTP común: agrega el token de sesión cuando existe
export async function api(ruta, { method = 'GET', body } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = leerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${ruta}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(datos?.error ?? `Error ${res.status}`);
    error.status = res.status;
    error.detalles = datos?.detalles;
    throw error;
  }
  return datos;
}
