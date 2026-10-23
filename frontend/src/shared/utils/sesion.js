// Guarda el token de sesión en el navegador. Si el almacenamiento no está disponible
// (modo privado o bloqueado), la sesión dura solo mientras la pestaña siga abierta.
const CLAVE = 'eninti.token';
let enMemoria = null;

export function leerToken() {
  try {
    return localStorage.getItem(CLAVE) ?? enMemoria;
  } catch {
    return enMemoria;
  }
}

export function guardarToken(token) {
  enMemoria = token;
  try {
    if (token) localStorage.setItem(CLAVE, token);
    else localStorage.removeItem(CLAVE);
  } catch {
    // Sin almacenamiento: queda solo en memoria
  }
}
