import * as clientes from './clientes.service.js';
import { parseId } from '../../shared/utils/parametros.js';

export async function listar(_req, res) {
  res.json(await clientes.listar());
}

export async function obtener(req, res) {
  res.json(await clientes.obtener(parseId(req.params.id)));
}

export async function crear(req, res) {
  res.status(201).json(await clientes.crear(req.body ?? {}));
}

export async function actualizar(req, res) {
  res.json(await clientes.actualizar(parseId(req.params.id), req.body ?? {}));
}

export async function listarComunas(_req, res) {
  res.json(await clientes.listarComunas());
}
