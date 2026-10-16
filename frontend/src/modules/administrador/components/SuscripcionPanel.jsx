import { useState } from 'react';
import { actualizarSuscripcion, crearSuscripcion } from '../services/plantasService.js';
import EstadoSuscripcion from './EstadoSuscripcion.jsx';
import Mensaje from '../../../shared/components/Mensaje.jsx';
import { formatoFecha, formatoPesos, hoy } from '../../../shared/utils/formato.js';

export default function SuscripcionPanel({ plantaId, suscripciones, planes, onCambio }) {
  const vigente = suscripciones.find((s) => s.estado !== 'cancelada');
  const historial = suscripciones.filter((s) => s.estado === 'cancelada');

  const [planId, setPlanId] = useState('');
  const [fechaInicio, setFechaInicio] = useState(hoy());
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  async function ejecutar(accion) {
    setEnviando(true);
    setError(null);
    try {
      await accion();
      setPlanId('');
      await onCambio();
    } catch (err) {
      setError(err);
    } finally {
      setEnviando(false);
    }
  }

  const crear = (e) => {
    e.preventDefault();
    ejecutar(() => crearSuscripcion(plantaId, { plan_id: Number(planId), fecha_inicio: fechaInicio }));
  };

  const cambiarPlan = (e) => {
    e.preventDefault();
    ejecutar(() => actualizarSuscripcion(vigente.id, { plan_id: Number(planId) }));
  };

  const cambiarEstado = (estado) => ejecutar(() => actualizarSuscripcion(vigente.id, { estado }));

  const cancelar = () => {
    if (window.confirm('¿Cancelar la suscripción? Esta acción no se puede deshacer.')) {
      cambiarEstado('cancelada');
    }
  };

  const selectorPlan = (excluirId) => (
    <select value={planId} onChange={(e) => setPlanId(e.target.value)} required>
      <option value="">Selecciona un plan</option>
      {planes.filter((p) => p.id !== excluirId).map((p) => (
        <option key={p.id} value={p.id}>
          {p.nombre} · {formatoPesos(p.precio_mensual)}/mes · cada {p.frecuencia_mantencion_meses} meses
        </option>
      ))}
    </select>
  );

  return (
    <article className="tarjeta">
      <h2>Suscripción</h2>
      <Mensaje error={error} />

      {vigente ? (
        <>
          <dl className="ficha">
            <div><dt>Plan</dt><dd>{vigente.plan_nombre} · {formatoPesos(vigente.precio_mensual)}/mes</dd></div>
            <div><dt>Estado</dt><dd><EstadoSuscripcion estado={vigente.estado} /></dd></div>
            <div><dt>Desde</dt><dd>{formatoFecha(vigente.fecha_inicio)}</dd></div>
          </dl>

          <form className="fila" onSubmit={cambiarPlan}>
            <label>
              Cambiar plan
              {selectorPlan(vigente.plan_id)}
            </label>
            <button type="submit" className="boton secundario" disabled={enviando || !planId}>Cambiar</button>
          </form>

          <div className="acciones">
            {vigente.estado === 'al_dia' ? (
              <button className="boton secundario" disabled={enviando} onClick={() => cambiarEstado('morosa')}>
                Marcar morosa
              </button>
            ) : (
              <button className="boton secundario" disabled={enviando} onClick={() => cambiarEstado('al_dia')}>
                Marcar al día
              </button>
            )}
            <button className="boton peligro" disabled={enviando} onClick={cancelar}>Cancelar suscripción</button>
          </div>
        </>
      ) : (
        <form className="formulario-simple" onSubmit={crear}>
          <p>Esta planta no tiene una suscripción vigente.</p>
          <label>
            Plan
            {selectorPlan()}
          </label>
          <label>
            Fecha de inicio
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
          </label>
          <button type="submit" className="boton" disabled={enviando || !planId}>Crear suscripción</button>
        </form>
      )}

      {historial.length > 0 && (
        <>
          <h3>Suscripciones anteriores</h3>
          <ul className="historial">
            {historial.map((s) => (
              <li key={s.id}>
                {s.plan_nombre} · {formatoFecha(s.fecha_inicio)} al {formatoFecha(s.fecha_cancelacion)}
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
