import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';

// Provisional hasta que el Equipo 2 entregue la autenticación (T-09).
// Espera un token con { id, rol } donde rol es 'cliente', 'trabajador' o 'administrador'.
export function autenticar(req, _res, next) {
  if (process.env.AUTH_BYPASS === 'true') {
    req.usuario = { id: 0, rol: 'administrador' };
    return next();
  }

  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  if (tipo !== 'Bearer' || !token) throw new HttpError(401, 'Token requerido');

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, 'Token inválido o expirado');
  }
  next();
}

export const permitirRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.usuario?.rol)) throw new HttpError(403, 'Acceso no permitido para este rol');
  next();
};
