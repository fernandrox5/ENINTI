import { query } from '../../config/db.js';

// Listados básicos para selectores. La administración completa de clientes es T-15.
export async function listar() {
  const { rows } = await query('SELECT id_cliente, rut, nombre FROM cliente ORDER BY nombre');
  return rows;
}

export async function listarComunas() {
  const { rows } = await query('SELECT id_comuna, nombre FROM comuna ORDER BY nombre');
  return rows;
}
