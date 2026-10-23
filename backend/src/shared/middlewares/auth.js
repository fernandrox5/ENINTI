import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';

// Verifica el token emitido por /api/auth/login: { id, rol, id_cliente? }
// donde rol es 'cliente', 'trabajador' o 'administrador'.
export function autenticar(req, _res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');

  if (tipo === 'Bearer' && token) {
    try {
      req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new HttpError(401, 'Sesión inválida o expirada');
    }
    return next();
  }

  // Solo desarrollo: sin token, la petición pasa como administrador
  if (process.env.AUTH_BYPASS === 'true') {
    req.usuario = { id: 0, rol: 'administrador' };
    return next();
  }
  throw new HttpError(401, 'Debes iniciar sesión');
}

export const permitirRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.usuario?.rol)) throw new HttpError(403, 'Acceso no permitido para este rol');
  next();
};
