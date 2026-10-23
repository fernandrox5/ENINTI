import * as trabajadores from './trabajadores.service.js';
import { parseId } from '../../shared/utils/parametros.js';

export async function listar(_req, res) {
  res.json(await trabajadores.listar());
}

export async function obtener(req, res) {
  res.json(await trabajadores.obtener(parseId(req.params.id)));
}

export async function crear(req, res) {
  res.status(201).json(await trabajadores.crear(req.body ?? {}));
}

export async function actualizar(req, res) {
  res.json(await trabajadores.actualizar(parseId(req.params.id), req.body ?? {}));
}
