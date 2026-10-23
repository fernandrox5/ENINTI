import { query } from '../../config/db.js';

// Plantas del cliente que inició sesión: nunca recibe el id por parámetro (HU-07)
export async function misPlantas(idCliente) {
  const { rows } = await query(
    `SELECT p.id_planta, p.direccion, co.nombre AS comuna, p.potencia_kw,
            s.estado AS estado_suscripcion, s.monto_mensual
     FROM planta p
     JOIN comuna co ON co.id_comuna = p.id_comuna
     LEFT JOIN suscripcion s ON s.id_planta = p.id_planta AND s.estado <> 'cancelada'
     WHERE p.id_cliente = $1
     ORDER BY p.direccion`,
    [idCliente],
  );
  return rows;
}
