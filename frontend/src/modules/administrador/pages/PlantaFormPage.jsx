import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { actualizarPlanta, crearPlanta, listarClientes, obtenerPlanta } from '../services/plantasService.js';
import Mensaje from '../../../shared/components/Mensaje.jsx';

const VACIO = {
  cliente_id: '',
  direccion: '',
  comuna: '',
  potencia_kwp: '',
  inversor_marca: '',
  inversor_modelo: '',
  paneles_cantidad: '',
  paneles_modelo: '',
  baterias: '',
  fecha_instalacion: '',
};

// Convierte los valores del formulario (todos texto) a los tipos que espera la API
function aDatosApi(form) {
  return {
    ...form,
    cliente_id: Number(form.cliente_id),
    potencia_kwp: Number(form.potencia_kwp),
    paneles_cantidad: Number(form.paneles_cantidad),
    baterias: form.baterias.trim() || null,
  };
}

export default function PlantaFormPage() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(VACIO);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([listarClientes(), editando ? obtenerPlanta(id) : null])
      .then(([listaClientes, planta]) => {
        setClientes(listaClientes);
        if (planta) {
          setForm(Object.fromEntries(Object.keys(VACIO).map((k) => [k, String(planta[k] ?? '')])));
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
    try {
      const planta = editando
        ? await actualizarPlanta(id, aDatosApi(form))
        : await crearPlanta(aDatosApi(form));
      navigate(`/admin/plantas/${planta.id}`);
    } catch (err) {
      setError(err);
      setGuardando(false);
    }
  }

  if (cargando) return <p>Cargando…</p>;

  return (
    <section>
      <div className="encabezado">
        <h1>{editando ? 'Editar planta' : 'Nueva planta'}</h1>
      </div>

      <form className="formulario" onSubmit={guardar}>
        <Mensaje error={error} />

        <fieldset>
          <legend>Cliente y ubicación</legend>
          <label>
            Cliente
            <select name="cliente_id" value={form.cliente_id} onChange={cambiar} required>
              <option value="">Selecciona un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} · {c.rut}</option>
              ))}
            </select>
          </label>
          <label>
            Dirección
            <input name="direccion" value={form.direccion} onChange={cambiar} required maxLength={200} />
          </label>
          <label>
            Comuna
            <input name="comuna" value={form.comuna} onChange={cambiar} required maxLength={80} />
          </label>
        </fieldset>

        <fieldset>
          <legend>Ficha técnica</legend>
          <label>
            Potencia (kWp)
            <input name="potencia_kwp" type="number" step="0.01" min="0.01" value={form.potencia_kwp} onChange={cambiar} required />
          </label>
          <label>
            Fecha de instalación
            <input name="fecha_instalacion" type="date" value={form.fecha_instalacion} onChange={cambiar} required />
          </label>
          <label>
            Marca del inversor
            <input name="inversor_marca" value={form.inversor_marca} onChange={cambiar} required maxLength={80} />
          </label>
          <label>
            Modelo del inversor
            <input name="inversor_modelo" value={form.inversor_modelo} onChange={cambiar} required maxLength={80} />
          </label>
          <label>
            Cantidad de paneles
            <input name="paneles_cantidad" type="number" step="1" min="1" value={form.paneles_cantidad} onChange={cambiar} required />
          </label>
          <label>
            Modelo de los paneles
            <input name="paneles_modelo" value={form.paneles_modelo} onChange={cambiar} required maxLength={80} />
          </label>
          <label className="ancho-completo">
            Baterías <span className="opcional">(opcional)</span>
            <input name="baterias" value={form.baterias} onChange={cambiar} maxLength={120} placeholder="Ej.: Pylontech US5000 x2" />
          </label>
        </fieldset>

        <div className="acciones">
          <Link className="boton secundario" to={editando ? `/admin/plantas/${id}` : '/admin/plantas'}>Cancelar</Link>
          <button type="submit" className="boton" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </section>
  );
}
