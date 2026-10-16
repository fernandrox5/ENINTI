import { query } from '../../config/db.js';

// Listado básico para selectores. La administración completa de clientes es T-15.
export async function listar() {
  const { rows } = await query('SELECT id, rut, nombre FROM clientes ORDER BY nombre');
  return rows;
}
