import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerCliente } from '../services/clientesService.js';
import EstadoSuscripcion from '../../../shared/components/EstadoSuscripcion.jsx';
import Mensaje from '../../../shared/components/Mensaje.jsx';

export default function ClienteDetallePage() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerCliente(id).then(setCliente).catch(setError);
  }, [id]);

  if (error) return <Mensaje error={error} />;
  if (!cliente) return <p>Cargando…</p>;

  const datos = [
    ['RUT', cliente.rut],
    ['Teléfono', cliente.telefono ?? '—'],
    ['Dirección de contacto', cliente.direccion ?? '—'],
    ['Comuna', cliente.comuna ?? '—'],
    ['Cuenta en la plataforma', cliente.email ?? 'Aún no se registra'],
  ];

  return (
    <section>
      <p><Link to="/admin/clientes">← Volver a clientes</Link></p>
      <div className="encabezado">
        <h1>{cliente.nombre}</h1>
        <Link className="boton secundario" to={`/admin/clientes/${id}/editar`}>Editar datos</Link>
      </div>

      <div className="columnas">
        <article className="tarjeta">
          <h2>Datos del cliente</h2>
          <dl className="ficha">
            {datos.map(([etiqueta, valor]) => (
              <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor}</dd></div>
            ))}
          </dl>
        </article>

        <article className="tarjeta">
          <div className="encabezado">
            <h2>Plantas ({cliente.plantas.length})</h2>
            <Link className="boton secundario" to={`/admin/plantas/nueva?cliente=${id}`}>Agregar planta</Link>
          </div>
          {cliente.plantas.length === 0 ? (
            <p>Este cliente aún no tiene plantas registradas.</p>
          ) : (
            <ul className="lista-simple">
              {cliente.plantas.map((p) => (
                <li key={p.id_planta}>
                  <Link to={`/admin/plantas/${p.id_planta}`}>{p.direccion}</Link>
                  <span>{p.comuna} · {p.potencia_kw} kW</span>
                  <EstadoSuscripcion estado={p.estado_suscripcion} />
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
