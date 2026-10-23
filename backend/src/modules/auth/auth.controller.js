import * as auth from './auth.service.js';

export async function registrar(req, res) {
  res.status(201).json(await auth.registrarCliente(req.body ?? {}));
}

export async function login(req, res) {
  res.json(await auth.iniciarSesion(req.body ?? {}));
}

export async function yo(req, res) {
  res.json(await auth.obtenerUsuario(req.usuario.id));
}
