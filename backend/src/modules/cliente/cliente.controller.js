import * as cliente from './cliente.service.js';
import { HttpError } from '../../shared/utils/httpError.js';

export async function misPlantas(req, res) {
  if (!req.usuario.id_cliente) throw new HttpError(403, 'La cuenta no está asociada a un cliente');
  res.json(await cliente.misPlantas(req.usuario.id_cliente));
}
