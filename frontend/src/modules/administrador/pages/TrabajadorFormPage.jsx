import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { actualizarTrabajador, crearTrabajador, obtenerTrabajador } from '../services/trabajadoresService.js';
import Mensaje from '../../../shared/components/Mensaje.jsx';

const LARGO_MINIMO = 8;

export default function TrabajadorFormPage() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!editando) return;
    obtenerTrabajador(id)
      .then((t) => setForm({ nombre: t.nombre, email: t.email, password: '' }))
      .catch(setError)
      .finally(() => setCargando(false));
  }, [id, editando]);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      if (editando) await actualizarTrabajador(id, form);
      else await crearTrabajador(form);
      navigate('/admin/trabajadores');
    } catch (err) {
      setError(err);
      setGuardando(false);
    }
  }

  if (cargando) return <p>Cargando…</p>;

  return (
    <section>
      <div className="encabezado">
        <h1>{editando ? 'Editar trabajador' : 'Nuevo trabajador'}</h1>
      </div>

      <form className="formulario" onSubmit={guardar}>
        <Mensaje error={error} />

        <fieldset>
          <legend>Cuenta del trabajador</legend>
          <label>
            Nombre completo
            <input name="nombre" value={form.nombre} onChange={cambiar} required maxLength={120} />
          </label>
          <label>
            Correo electrónico
            <input name="email" type="email" value={form.email} onChange={cambiar} required maxLength={120} autoComplete="off" />
          </label>
          <label className="ancho-completo">
            {editando ? 'Nueva contraseña' : 'Contraseña inicial'}{' '}
            <span className="opcional">
              {editando ? '(déjala en blanco para no cambiarla)' : `(mínimo ${LARGO_MINIMO} caracteres; entrégasela al trabajador)`}
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={cambiar}
              required={!editando}
              minLength={LARGO_MINIMO}
              autoComplete="new-password"
            />
          </label>
        </fieldset>

        <div className="acciones">
          <Link className="boton secundario" to="/admin/trabajadores">Cancelar</Link>
          <button type="submit" className="boton" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </section>
  );
}
