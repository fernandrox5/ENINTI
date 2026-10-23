import { query } from '../../config/db.js';
import { HttpError } from '../../shared/utils/httpError.js';

// Las consultas siempre filtran por el cliente de la sesión, nunca por un id recibido (HU-07)
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

// Ficha técnica de una planta del cliente (HU-10, T-17)
export async function fichaPlanta(idCliente, idPlanta) {
  const { rows } = await query(
    `SELECT p.id_planta, p.direccion, co.nombre AS comuna, p.potencia_kw, p.inversor,
            p.paneles, p.baterias, p.fecha_instalacion,
            s.estado AS estado_suscripcion, s.monto_mensual, s.dia_cobro, s.mantenciones_anuales
     FROM planta p
     JOIN comuna co ON co.id_comuna = p.id_comuna
     LEFT JOIN suscripcion s ON s.id_planta = p.id_planta AND s.estado <> 'cancelada'
     WHERE p.id_planta = $1 AND p.id_cliente = $2`,
    [idPlanta, idCliente],
  );
  // Misma respuesta si la planta no existe o es de otro cliente
  if (!rows.length) throw new HttpError(404, 'Planta no encontrada');
  return rows[0];
}
