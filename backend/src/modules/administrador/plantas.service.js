import { query } from '../../config/db.js';
import { HttpError } from '../../shared/utils/httpError.js';

// Campos de la ficha técnica y el tipo que se valida para cada uno
const CAMPOS = {
  cliente_id: 'entero',
  direccion: 'texto',
  comuna: 'texto',
  potencia_kwp: 'decimal',
  inversor_marca: 'texto',
  inversor_modelo: 'texto',
  paneles_cantidad: 'entero',
  paneles_modelo: 'texto',
  baterias: 'texto_opcional',
  fecha_instalacion: 'fecha',
};

const VALIDADORES = {
  entero: (v) => Number.isInteger(v) && v > 0,
  decimal: (v) => typeof v === 'number' && v > 0,
  texto: (v) => typeof v === 'string' && v.trim() !== '',
  texto_opcional: (v) => v === null || typeof v === 'string',
  fecha: (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v),
};

function validar(datos, { parcial }) {
  const errores = [];
  const limpio = {};

  for (const [campo, tipo] of Object.entries(CAMPOS)) {
    if (!(campo in datos)) {
      if (!parcial && tipo !== 'texto_opcional') errores.push(`${campo} es obligatorio`);
      continue;
    }
    const valor = typeof datos[campo] === 'string' ? datos[campo].trim() : datos[campo];
    if (!VALIDADORES[tipo](valor)) errores.push(`${campo} no es válido`);
    else limpio[campo] = tipo === 'texto_opcional' && valor === '' ? null : valor;
  }

  if (errores.length) throw new HttpError(400, 'Datos de la planta inválidos', errores);
  if (parcial && !Object.keys(limpio).length) throw new HttpError(400, 'No hay campos para actualizar');
  return limpio;
}

const SELECT_PLANTA = `
  SELECT p.*,
         json_build_object('id', c.id, 'rut', c.rut, 'nombre', c.nombre) AS cliente,
         CASE WHEN s.id IS NULL THEN NULL ELSE json_build_object(
           'id', s.id, 'estado', s.estado, 'fecha_inicio', s.fecha_inicio,
           'plan', json_build_object('id', pn.id, 'nombre', pn.nombre, 'precio_mensual', pn.precio_mensual)
         ) END AS suscripcion
  FROM plantas p
  JOIN clientes c ON c.id = p.cliente_id
  LEFT JOIN suscripciones s ON s.planta_id = p.id AND s.estado <> 'cancelada'
  LEFT JOIN planes pn ON pn.id = s.plan_id`;

export async function listar({ cliente_id, comuna }) {
  const condiciones = [];
  const params = [];
  if (cliente_id) {
    params.push(cliente_id);
    condiciones.push(`p.cliente_id = $${params.length}`);
  }
  if (comuna) {
    params.push(comuna);
    condiciones.push(`p.comuna ILIKE $${params.length}`);
  }
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const { rows } = await query(`${SELECT_PLANTA} ${where} ORDER BY p.id`, params);
  return rows;
}

export async function obtener(id) {
  const { rows } = await query(`${SELECT_PLANTA} WHERE p.id = $1`, [id]);
  if (!rows.length) throw new HttpError(404, 'Planta no encontrada');
  return rows[0];
}

export async function crear(datos) {
  const planta = validar(datos, { parcial: false });
  const campos = Object.keys(planta);
  const { rows } = await query(
    `INSERT INTO plantas (${campos.join(', ')})
     VALUES (${campos.map((_, i) => `$${i + 1}`).join(', ')})
     RETURNING id`,
    Object.values(planta),
  );
  return obtener(rows[0].id);
}

export async function actualizar(id, datos) {
  const cambios = validar(datos, { parcial: true });
  const campos = Object.keys(cambios);
  const { rowCount } = await query(
    `UPDATE plantas
     SET ${campos.map((c, i) => `${c} = $${i + 2}`).join(', ')}, updated_at = now()
     WHERE id = $1`,
    [id, ...Object.values(cambios)],
  );
  if (!rowCount) throw new HttpError(404, 'Planta no encontrada');
  return obtener(id);
}
