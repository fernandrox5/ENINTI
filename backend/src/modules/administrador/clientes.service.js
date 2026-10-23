import { query } from '../../config/db.js';
import { HttpError } from '../../shared/utils/httpError.js';
import { normalizarRut } from '../../shared/utils/rut.js';
import { TELEFONO_VALIDO, esIdValido, esTextoNoVacio } from '../../shared/utils/validacion.js';

// Administración de clientes (HU-03, T-15)
const SELECT_CLIENTE = `
  SELECT c.id_cliente, c.rut, c.nombre, c.telefono, c.direccion, c.id_comuna,
         co.nombre AS comuna, u.email,
         (SELECT count(*)::int FROM planta p WHERE p.id_cliente = c.id_cliente) AS total_plantas
  FROM cliente c
  LEFT JOIN comuna co ON co.id_comuna = c.id_comuna
  LEFT JOIN usuario u ON u.id_usuario = c.id_usuario`;

export async function listar() {
  const { rows } = await query(`${SELECT_CLIENTE} ORDER BY c.nombre`);
  return rows;
}

export async function obtener(id) {
  const { rows } = await query(`${SELECT_CLIENTE} WHERE c.id_cliente = $1`, [id]);
  if (!rows.length) throw new HttpError(404, 'Cliente no encontrado');

  const { rows: plantas } = await query(
    `SELECT p.id_planta, p.direccion, co.nombre AS comuna, p.potencia_kw, s.estado AS estado_suscripcion
     FROM planta p
     JOIN comuna co ON co.id_comuna = p.id_comuna
     LEFT JOIN suscripcion s ON s.id_planta = p.id_planta AND s.estado <> 'cancelada'
     WHERE p.id_cliente = $1
     ORDER BY p.direccion`,
    [id],
  );
  return { ...rows[0], plantas };
}

// Convierte '' en null para los campos opcionales
const opcional = (v) => (typeof v === 'string' && v.trim() === '' ? null : v);

function validar(datos, { parcial }) {
  const errores = [];
  const limpio = {};

  if ('rut' in datos || !parcial) {
    const rut = normalizarRut(datos.rut);
    if (rut) limpio.rut = rut;
    else errores.push('El RUT no es válido');
  }
  if ('nombre' in datos || !parcial) {
    if (esTextoNoVacio(datos.nombre)) limpio.nombre = datos.nombre.trim();
    else errores.push('El nombre es obligatorio');
  }
  if ('telefono' in datos) {
    const telefono = opcional(datos.telefono);
    if (telefono === null || (typeof telefono === 'string' && TELEFONO_VALIDO.test(telefono.trim()))) {
      limpio.telefono = telefono?.trim() ?? null;
    } else errores.push('El teléfono no es válido');
  }
  if ('direccion' in datos) {
    const direccion = opcional(datos.direccion);
    if (direccion === null || typeof direccion === 'string') limpio.direccion = direccion?.trim() ?? null;
    else errores.push('La dirección no es válida');
  }
  if ('id_comuna' in datos) {
    const idComuna = opcional(datos.id_comuna);
    if (idComuna === null || esIdValido(idComuna)) limpio.id_comuna = idComuna;
    else errores.push('La comuna no es válida');
  }

  if (errores.length) throw new HttpError(400, 'Datos del cliente inválidos', errores);
  if (parcial && !Object.keys(limpio).length) throw new HttpError(400, 'No hay campos para actualizar');
  return limpio;
}

const conflictoRut = (err) => {
  if (err.code === '23505') throw new HttpError(409, 'Ya existe un cliente con ese RUT');
  throw err;
};

export async function crear(datos) {
  const cliente = validar(datos, { parcial: false });
  const campos = Object.keys(cliente);
  const { rows } = await query(
    `INSERT INTO cliente (${campos.join(', ')})
     VALUES (${campos.map((_, i) => `$${i + 1}`).join(', ')})
     RETURNING id_cliente`,
    Object.values(cliente),
  ).catch(conflictoRut);
  return obtener(rows[0].id_cliente);
}

export async function actualizar(id, datos) {
  const cambios = validar(datos, { parcial: true });
  const campos = Object.keys(cambios);
  const { rowCount } = await query(
    `UPDATE cliente SET ${campos.map((c, i) => `${c} = $${i + 2}`).join(', ')} WHERE id_cliente = $1`,
    [id, ...Object.values(cambios)],
  ).catch(conflictoRut);
  if (!rowCount) throw new HttpError(404, 'Cliente no encontrado');
  return obtener(id);
}

export async function listarComunas() {
  const { rows } = await query('SELECT id_comuna, nombre FROM comuna ORDER BY nombre');
  return rows;
}
