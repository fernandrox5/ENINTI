import * as clientes from './clientes.service.js';

export async function listar(_req, res) {
  res.json(await clientes.listar());
}

export async function listarComunas(_req, res) {
  res.json(await clientes.listarComunas());
}
