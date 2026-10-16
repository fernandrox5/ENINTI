import * as suscripciones from './suscripciones.service.js';
import { parseId } from './plantas.controller.js';

export async function listarPlanes(_req, res) {
  res.json(await suscripciones.listarPlanes());
}

export async function actualizar(req, res) {
  res.json(await suscripciones.actualizar(parseId(req.params.id), req.body ?? {}));
}
