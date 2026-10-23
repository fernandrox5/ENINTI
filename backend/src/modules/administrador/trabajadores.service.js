import { query } from '../../config/db.js';
import { HttpError } from '../../shared/utils/httpError.js';
import { hashPassword } from '../../shared/utils/password.js';
import { EMAIL_VALIDO, LARGO_MINIMO_PASSWORD, esTextoNoVacio } from '../../shared/utils/validacion.js';

// Cuentas de trabajadores (HU-15, T-18). Un trabajador desactivado no puede iniciar sesión.
const COLUMNAS = 'id_usuario, nombre, email, activo, fecha_creacion';

export async function listar() {
  const { rows } = await query(
    `SELECT ${COLUMNAS} FROM usuario WHERE rol = 'trabajador' ORDER BY activo DESC, nombre`,
  );
  return rows;
}

export async function obtener(id) {
  const { rows } = await query(
    `SELECT ${COLUMNAS} FROM usuario WHERE id_usuario = $1 AND rol = 'trabajador'`,
    [id],
  );
  if (!rows.length) throw new HttpError(404, 'Trabajador no encontrado');
  return rows[0];
}

async function validar(datos, { parcial }) {
  const errores = [];
  const limpio = {};

  if ('nombre' in datos || !parcial) {
    if (esTextoNoVacio(datos.nombre)) limpio.nombre = datos.nombre.trim();
    else errores.push('El nombre es obligatorio');
  }
  if ('email' in datos || !parcial) {
    if (typeof datos.email === 'string' && EMAIL_VALIDO.test(datos.email.trim())) {
      limpio.email = datos.email.trim().toLowerCase();
    } else errores.push('El correo no es válido');
  }
  // Al editar, la contraseña solo cambia si viene con valor
  if ((datos.password !== undefined && datos.password !== '') || !parcial) {
    if (typeof datos.password === 'string' && datos.password.length >= LARGO_MINIMO_PASSWORD) {
      limpio.password_hash = await hashPassword(datos.password);
    } else errores.push(`La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres`);
  }
  if ('activo' in datos) {
    if (typeof datos.activo === 'boolean') limpio.activo = datos.activo;
    else errores.push('activo debe ser verdadero o falso');
  }

  if (errores.length) throw new HttpError(400, 'Datos del trabajador inválidos', errores);
  if (parcial && !Object.keys(limpio).length) throw new HttpError(400, 'No hay campos para actualizar');
  return limpio;
}

const conflictoEmail = (err) => {
  if (err.code === '23505') throw new HttpError(409, 'Ese correo ya está registrado');
  throw err;
};

export async function crear(datos) {
  const { nombre, email, password_hash } = await validar(datos, { parcial: false });
  const { rows } = await query(
    `INSERT INTO usuario (nombre, email, password_hash, rol)
     VALUES ($1, $2, $3, 'trabajador')
     RETURNING ${COLUMNAS}`,
    [nombre, email, password_hash],
  ).catch(conflictoEmail);
  return rows[0];
}

export async function actualizar(id, datos) {
  const cambios = await validar(datos, { parcial: true });
  const campos = Object.keys(cambios);
  const { rows } = await query(
    `UPDATE usuario SET ${campos.map((c, i) => `${c} = $${i + 2}`).join(', ')}
     WHERE id_usuario = $1 AND rol = 'trabajador'
     RETURNING ${COLUMNAS}`,
    [id, ...Object.values(cambios)],
  ).catch(conflictoEmail);
  if (!rows.length) throw new HttpError(404, 'Trabajador no encontrado');
  return rows[0];
}
