import { pool, query } from '../../config/db.js';
import { HttpError } from '../../shared/utils/httpError.js';

const ESTADOS = ['al_dia', 'morosa', 'cancelada'];
const esId = (v) => Number.isInteger(v) && v > 0;

export async function listarPlanes() {
  const { rows } = await query('SELECT * FROM planes WHERE activo ORDER BY precio_mensual');
  return rows;
}

// Historial completo de suscripciones de una planta, la vigente primero
export async function listarPorPlanta(plantaId) {
  const { rows: planta } = await query('SELECT 1 FROM plantas WHERE id = $1', [plantaId]);
  if (!planta.length) throw new HttpError(404, 'Planta no encontrada');

  const { rows } = await query(
    `SELECT s.*, pn.nombre AS plan_nombre, pn.precio_mensual
     FROM suscripciones s JOIN planes pn ON pn.id = s.plan_id
     WHERE s.planta_id = $1
     ORDER BY (s.estado = 'cancelada'), s.fecha_inicio DESC`,
    [plantaId],
  );
  return rows;
}

export async function crear(plantaId, { plan_id, fecha_inicio }) {
  if (!esId(plan_id)) throw new HttpError(400, 'plan_id es obligatorio');
  if (fecha_inicio !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(fecha_inicio)) {
    throw new HttpError(400, 'fecha_inicio debe tener formato YYYY-MM-DD');
  }

  const { rows: planta } = await query('SELECT 1 FROM plantas WHERE id = $1', [plantaId]);
  if (!planta.length) throw new HttpError(404, 'Planta no encontrada');

  const { rows: plan } = await query('SELECT activo FROM planes WHERE id = $1', [plan_id]);
  if (!plan.length || !plan[0].activo) throw new HttpError(400, 'El plan no existe o no está activo');

  try {
    const { rows } = await query(
      `INSERT INTO suscripciones (planta_id, plan_id, fecha_inicio)
       VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE))
       RETURNING *`,
      [plantaId, plan_id, fecha_inicio ?? null],
    );
    return rows[0];
  } catch (err) {
    if (err.code === '23505') throw new HttpError(409, 'La planta ya tiene una suscripción vigente');
    throw err;
  }
}

// Cambia el plan o el estado. Cancelar registra la fecha (HU-12) y es definitivo.
export async function actualizar(id, { plan_id, estado }) {
  if (plan_id === undefined && estado === undefined) {
    throw new HttpError(400, 'Indica plan_id o estado');
  }
  if (plan_id !== undefined && !esId(plan_id)) throw new HttpError(400, 'plan_id no es válido');
  if (estado !== undefined && !ESTADOS.includes(estado)) {
    throw new HttpError(400, `estado debe ser uno de: ${ESTADOS.join(', ')}`);
  }

  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const { rows } = await cliente.query('SELECT * FROM suscripciones WHERE id = $1 FOR UPDATE', [id]);
    if (!rows.length) throw new HttpError(404, 'Suscripción no encontrada');
    if (rows[0].estado === 'cancelada') throw new HttpError(409, 'La suscripción está cancelada');

    if (plan_id !== undefined) {
      const { rows: plan } = await cliente.query('SELECT activo FROM planes WHERE id = $1', [plan_id]);
      if (!plan.length || !plan[0].activo) throw new HttpError(400, 'El plan no existe o no está activo');
    }

    const { rows: actualizada } = await cliente.query(
      `UPDATE suscripciones
       SET plan_id = COALESCE($2, plan_id),
           estado = COALESCE($3, estado),
           fecha_cancelacion = CASE WHEN $3 = 'cancelada' THEN CURRENT_DATE ELSE fecha_cancelacion END,
           updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, plan_id ?? null, estado ?? null],
    );
    await cliente.query('COMMIT');
    return actualizada[0];
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
}
