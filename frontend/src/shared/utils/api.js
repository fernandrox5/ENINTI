// Cliente HTTP común. Cuando exista la autenticación (T-09) aquí se agrega el token.
export async function api(ruta, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${ruta}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(datos?.error ?? `Error ${res.status}`);
    error.detalles = datos?.detalles;
    throw error;
  }
  return datos;
}
