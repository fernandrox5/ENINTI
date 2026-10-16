import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listarPlanes, listarSuscripciones, obtenerPlanta } from '../services/plantasService.js';
import SuscripcionPanel from '../components/SuscripcionPanel.jsx';
import Mensaje from '../../../shared/components/Mensaje.jsx';
import { formatoFecha } from '../../../shared/utils/formato.js';

export default function PlantaDetallePage() {
  const { id } = useParams();
  const [planta, setPlanta] = useState(null);
  const [suscripciones, setSuscripciones] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [error, setError] = useState(null);

  const cargar = useCallback(() => {
    return Promise.all([obtenerPlanta(id), listarSuscripciones(id), listarPlanes()])
      .then(([p, s, pl]) => {
        setPlanta(p);
        setSuscripciones(s);
        setPlanes(pl);
      })
      .catch(setError);
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (error && !planta) return <Mensaje error={error} />;
  if (!planta) return <p>Cargando…</p>;

  const ficha = [
    ['Cliente', `${planta.cliente.nombre} · ${planta.cliente.rut}`],
    ['Dirección', planta.direccion],
    ['Comuna', planta.comuna],
    ['Potencia', `${planta.potencia_kwp} kWp`],
    ['Inversor', `${planta.inversor_marca} ${planta.inversor_modelo}`],
    ['Paneles', `${planta.paneles_cantidad} × ${planta.paneles_modelo}`],
    ['Baterías', planta.baterias ?? 'Sin baterías'],
    ['Fecha de instalación', formatoFecha(planta.fecha_instalacion)],
  ];

  return (
    <section>
      <p><Link to="/admin/plantas">← Volver a plantas</Link></p>
      <div className="encabezado">
        <h1>{planta.direccion}</h1>
        <Link className="boton secundario" to={`/admin/plantas/${id}/editar`}>Editar ficha</Link>
      </div>

      <div className="columnas">
        <article className="tarjeta">
          <h2>Ficha técnica</h2>
          <dl className="ficha">
            {ficha.map(([etiqueta, valor]) => (
              <div key={etiqueta}>
                <dt>{etiqueta}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
        </article>

        <SuscripcionPanel plantaId={id} suscripciones={suscripciones} planes={planes} onCambio={cargar} />
      </div>
    </section>
  );
}
