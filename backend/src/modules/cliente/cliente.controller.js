import * as cliente from './cliente.service.js';
import { HttpError } from '../../shared/utils/httpError.js';
import { parseId } from '../../shared/utils/parametros.js';

function idCliente(req) {
  if (!req.usuario.id_cliente) throw new HttpError(403, 'La cuenta no está asociada a un cliente');
  return req.usuario.id_cliente;
}

export async function misPlantas(req, res) {
  res.json(await cliente.misPlantas(idCliente(req)));
}

export async function fichaPlanta(req, res) {
  res.json(await cliente.fichaPlanta(idCliente(req), parseId(req.params.id)));
}
