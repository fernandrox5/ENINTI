import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarClientes } from '../services/clientesService.js';
import Mensaje from '../../../shared/components/Mensaje.jsx';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    listarClientes().then(setClientes).catch(setError).finally(() => setCargando(false));
  }, []);

  // Busca por nombre o RUT, con o sin puntos
  const texto = busqueda.trim().toLowerCase().replace(/\./g, '');
  const filtrados = clientes.filter((c) => `${c.nombre} ${c.rut}`.toLowerCase().includes(texto));

  return (
    <section>
      <div className="encabezado">
        <h1>Clientes</h1>
        <Link className="boton" to="/admin/clientes/nuevo">Nuevo cliente</Link>
      </div>

      <div className="filtros">
        <label>
          Buscar
          <input type="search" placeholder="Nombre o RUT" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </label>
      </div>

      <Mensaje error={error} />
      {cargando && <p>Cargando…</p>}
      {!cargando && !error && filtrados.length === 0 && <p>No hay clientes que coincidan.</p>}

      {filtrados.length > 0 && (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Comuna</th>
              <th>Plantas</th>
              <th>Cuenta en la plataforma</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => (
              <tr key={c.id_cliente}>
                <td data-label="Nombre"><Link to={`/admin/clientes/${c.id_cliente}`}>{c.nombre}</Link></td>
                <td data-label="RUT">{c.rut}</td>
                <td data-label="Comuna">{c.comuna ?? '—'}</td>
                <td data-label="Plantas">{c.total_plantas}</td>
                <td data-label="Cuenta">
                  {c.email
                    ? <span className="etiqueta ok">Registrado</span>
                    : <span className="etiqueta neutro">Sin cuenta</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
