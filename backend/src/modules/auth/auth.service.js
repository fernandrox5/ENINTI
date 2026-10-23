import jwt from 'jsonwebtoken';
import { pool, query } from '../../config/db.js';
import { HttpError } from '../../shared/utils/httpError.js';
import { hashPassword, verificarPassword } from '../../shared/utils/password.js';
import { normalizarRut } from '../../shared/utils/rut.js';

const DURACION_SESION = '8h';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MINIMO_PASSWORD = 8;

function emitirToken(usuario) {
  if (!process.env.JWT_SECRET) throw new Error('Falta JWT_SECRET en el .env');
  return jwt.sign(
    { id: usuario.id_usuario, rol: usuario.rol, id_cliente: usuario.id_cliente ?? undefined },
    process.env.JWT_SECRET,
    { expiresIn: DURACION_SESION },
  );
}

const sesion = (usuario) => ({
  token: emitirToken(usuario),
  usuario: {
    id_usuario: usuario.id_usuario,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    id_cliente: usuario.id_cliente ?? null,
  },
});

// Registro del cliente (HU-07): solo pueden registrarse clientes que ENINTI ya tiene
// en su base, identificados por RUT. La cuenta queda enlazada a ese cliente.
export async function registrarCliente({ rut, email, password }) {
  const errores = [];
  const rutNormalizado = normalizarRut(rut);
  if (!rutNormalizado) errores.push('El RUT no es válido');
  if (typeof email !== 'string' || !EMAIL.test(email.trim())) errores.push('El correo no es válido');
  if (typeof password !== 'string' || password.length < LARGO_MINIMO_PASSWORD) {
    errores.push(`La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres`);
  }
  if (errores.length) throw new HttpError(400, 'Revisa los datos del registro', errores);

  const correo = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const conexion = await pool.connect();
  try {
    await conexion.query('BEGIN');
    const { rows: clientes } = await conexion.query(
      'SELECT id_cliente, nombre, id_usuario FROM cliente WHERE rut = $1 FOR UPDATE',
      [rutNormalizado],
    );
    if (!clientes.length) {
      throw new HttpError(404, 'No encontramos un cliente de ENINTI con ese RUT. Comunícate con ENINTI para revisarlo.');
    }
    const cliente = clientes[0];
    if (cliente.id_usuario) throw new HttpError(409, 'Este RUT ya tiene una cuenta. Inicia sesión con tu correo.');

    const { rows: usuarios } = await conexion.query(
      `INSERT INTO usuario (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, 'cliente')
       RETURNING id_usuario, nombre, email, rol`,
      [cliente.nombre, correo, passwordHash],
    );
    const usuario = { ...usuarios[0], id_cliente: cliente.id_cliente };
    await conexion.query('UPDATE cliente SET id_usuario = $1 WHERE id_cliente = $2', [usuario.id_usuario, cliente.id_cliente]);
    await conexion.query('COMMIT');
    return sesion(usuario);
  } catch (err) {
    await conexion.query('ROLLBACK');
    if (err.code === '23505') throw new HttpError(409, 'Ese correo ya está registrado');
    throw err;
  } finally {
    conexion.release();
  }
}

const SELECT_USUARIO = `
  SELECT u.id_usuario, u.nombre, u.email, u.rol, u.activo, u.password_hash, c.id_cliente
  FROM usuario u
  LEFT JOIN cliente c ON c.id_usuario = u.id_usuario`;

export async function iniciarSesion({ email, password }) {
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    throw new HttpError(400, 'Ingresa tu correo y tu contraseña');
  }
  const { rows } = await query(`${SELECT_USUARIO} WHERE u.email = $1`, [email.trim().toLowerCase()]);
  const usuario = rows[0];
  // Mismo mensaje si el correo no existe o la contraseña no coincide
  if (!usuario || !(await verificarPassword(password, usuario.password_hash))) {
    throw new HttpError(401, 'Correo o contraseña incorrectos');
  }
  if (!usuario.activo) throw new HttpError(403, 'Tu cuenta está desactivada. Comunícate con ENINTI.');
  return sesion(usuario);
}

export async function obtenerUsuario(idUsuario) {
  const { rows } = await query(`${SELECT_USUARIO} WHERE u.id_usuario = $1`, [idUsuario]);
  const usuario = rows[0];
  if (!usuario || !usuario.activo) throw new HttpError(401, 'Sesión inválida o expirada');
  return sesion(usuario).usuario;
}
