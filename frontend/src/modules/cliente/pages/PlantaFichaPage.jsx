import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerFichaPlanta } from '../services/clienteService.js';
import EstadoSuscripcion from '../../../shared/components/EstadoSuscripcion.jsx';
import Mensaje from '../../../shared/components/Mensaje.jsx';
import { formatoFecha, formatoPesos } from '../../../shared/utils/formato.js';

// Ficha técnica de la planta para el cliente (HU-10)
export default function PlantaFichaPage() {
  const { id } = useParams();
  const [planta, setPlanta] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerFichaPlanta(id).then(setPlanta).catch(setError);
  }, [id]);

  const volver = <p><Link to="/cliente">← Volver a mis plantas</Link></p>;
  if (error) return <>{volver}<Mensaje error={error} /></>;
  if (!planta) return <p>Cargando…</p>;

  const ficha = [
    ['Dirección', `${planta.direccion}, ${planta.comuna}`],
    ['Potencia', `${planta.potencia_kw} kW`],
    ['Inversor', planta.inversor],
    ['Paneles', planta.paneles],
    ['Baterías', planta.baterias ?? 'Sin baterías'],
    ['Fecha de instalación', formatoFecha(planta.fecha_instalacion)],
  ];

  return (
    <section>
      {volver}
      <h1>{planta.direccion}</h1>

      <div className="columnas">
        <article className="tarjeta">
          <h2>Ficha técnica</h2>
          <dl className="ficha">
            {ficha.map(([etiqueta, valor]) => (
              <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor}</dd></div>
            ))}
          </dl>
        </article>

        <article className="tarjeta">
          <h2>Mi suscripción</h2>
          {planta.estado_suscripcion ? (
            <dl className="ficha">
              <div><dt>Estado</dt><dd><EstadoSuscripcion estado={planta.estado_suscripcion} /></dd></div>
              <div><dt>Cuota mensual</dt><dd>{formatoPesos(planta.monto_mensual)}</dd></div>
              <div><dt>Día de cobro</dt><dd>{planta.dia_cobro} de cada mes</dd></div>
              <div><dt>Mantenciones</dt><dd>{planta.mantenciones_anuales} al año</dd></div>
            </dl>
          ) : (
            <p>Esta planta no tiene una suscripción vigente. Comunícate con ENINTI si quieres contratarla.</p>
          )}
        </article>
      </div>
    </section>
  );
}
