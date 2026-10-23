import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { actualizarCliente, crearCliente, listarComunas, obtenerCliente } from '../services/clientesService.js';
import Mensaje from '../../../shared/components/Mensaje.jsx';

const VACIO = { rut: '', nombre: '', telefono: '', direccion: '', id_comuna: '' };

export default function ClienteFormPage() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(VACIO);
  const [comunas, setComunas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([listarComunas(), editando ? obtenerCliente(id) : null])
      .then(([listaComunas, cliente]) => {
        setComunas(listaComunas);
        if (cliente) {
          setForm(Object.fromEntries(Object.keys(VACIO).map((k) => [k, String(cliente[k] ?? '')])));
        }
      })
      .catch(setError)
      .finally(() => setCargando(false));
  }, [id, editando]);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    const datos = { ...form, id_comuna: form.id_comuna ? Number(form.id_comuna) : null };
    try {
      const cliente = editando ? await actualizarCliente(id, datos) : await crearCliente(datos);
      navigate(`/admin/clientes/${cliente.id_cliente}`);
    } catch (err) {
      setError(err);
      setGuardando(false);
    }
  }

  if (cargando) return <p>Cargando…</p>;

  return (
    <section>
      <div className="encabezado">
        <h1>{editando ? 'Editar cliente' : 'Nuevo cliente'}</h1>
      </div>

      <form className="formulario" onSubmit={guardar}>
        <Mensaje error={error} />

        <fieldset>
          <legend>Datos del cliente</legend>
          <label>
            RUT
            <input name="rut" value={form.rut} onChange={cambiar} required placeholder="12.345.678-9" autoComplete="off" />
          </label>
          <label>
            Nombre completo
            <input name="nombre" value={form.nombre} onChange={cambiar} required maxLength={120} />
          </label>
          <label>
            Teléfono <span className="opcional">(opcional)</span>
            <input name="telefono" type="tel" value={form.telefono} onChange={cambiar} maxLength={20} placeholder="+56 9 1234 5678" />
          </label>
          <label>
            Comuna <span className="opcional">(opcional)</span>
            <select name="id_comuna" value={form.id_comuna} onChange={cambiar}>
              <option value="">Sin comuna</option>
              {comunas.map((c) => <option key={c.id_comuna} value={c.id_comuna}>{c.nombre}</option>)}
            </select>
          </label>
          <label className="ancho-completo">
            Dirección de contacto <span className="opcional">(opcional)</span>
            <input name="direccion" value={form.direccion} onChange={cambiar} maxLength={200} />
          </label>
        </fieldset>

        <div className="acciones">
          <Link className="boton secundario" to={editando ? `/admin/clientes/${id}` : '/admin/clientes'}>Cancelar</Link>
          <button type="submit" className="boton" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </section>
  );
}
