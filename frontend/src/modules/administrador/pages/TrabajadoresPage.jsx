import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { actualizarTrabajador, listarTrabajadores } from '../services/trabajadoresService.js';
import Mensaje from '../../../shared/components/Mensaje.jsx';

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(null);
  const [error, setError] = useState(null);

  const cargar = useCallback(
    () => listarTrabajadores().then(setTrabajadores).catch(setError).finally(() => setCargando(false)),
    [],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function cambiarEstado(trabajador) {
    const accion = trabajador.activo ? 'desactivar' : 'activar';
    if (trabajador.activo && !window.confirm(`¿Desactivar a ${trabajador.nombre}? No podrá iniciar sesión.`)) return;
    setEnviando(trabajador.id_usuario);
    setError(null);
    try {
      await actualizarTrabajador(trabajador.id_usuario, { activo: !trabajador.activo });
      await cargar();
    } catch (err) {
      setError(new Error(`No se pudo ${accion}: ${err.message}`));
    } finally {
      setEnviando(null);
    }
  }

  return (
    <section>
      <div className="encabezado">
        <h1>Trabajadores</h1>
        <Link className="boton" to="/admin/trabajadores/nuevo">Nuevo trabajador</Link>
      </div>

      <Mensaje error={error} />
      {cargando && <p>Cargando…</p>}
      {!cargando && !error && trabajadores.length === 0 && <p>Aún no hay trabajadores registrados.</p>}

      {trabajadores.length > 0 && (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trabajadores.map((t) => (
              <tr key={t.id_usuario}>
                <td data-label="Nombre">{t.nombre}</td>
                <td data-label="Correo">{t.email}</td>
                <td data-label="Estado">
                  {t.activo
                    ? <span className="etiqueta ok">Activo</span>
                    : <span className="etiqueta neutro">Desactivado</span>}
                </td>
                <td data-label="Acciones">
                  <span className="acciones-fila">
                    <Link to={`/admin/trabajadores/${t.id_usuario}/editar`}>Editar</Link>
                    <button
                      type="button"
                      className="enlace"
                      disabled={enviando === t.id_usuario}
                      onClick={() => cambiarEstado(t)}
                    >
                      {t.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
