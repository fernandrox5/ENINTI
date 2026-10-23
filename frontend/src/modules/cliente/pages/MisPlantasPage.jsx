import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarMisPlantas } from '../services/clienteService.js';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import EstadoSuscripcion from '../../../shared/components/EstadoSuscripcion.jsx';
import Mensaje from '../../../shared/components/Mensaje.jsx';
import { formatoPesos } from '../../../shared/utils/formato.js';

export default function MisPlantasPage() {
  const { usuario } = useAuth();
  const [plantas, setPlantas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarMisPlantas().then(setPlantas).catch(setError).finally(() => setCargando(false));
  }, []);

  return (
    <section>
      <h1>Hola, {usuario.nombre.split(' ')[0]}</h1>
      <p className="ayuda">Estas son tus plantas solares con ENINTI.</p>

      <Mensaje error={error} />
      {cargando && <p>Cargando…</p>}
      {!cargando && !error && plantas.length === 0 && (
        <p>Aún no tienes plantas registradas. Si crees que es un error, comunícate con ENINTI.</p>
      )}

      <ul className="lista-plantas">
        {plantas.map((p) => (
          <li key={p.id_planta} className="tarjeta">
            <h2>{p.direccion}</h2>
            <dl className="ficha">
              <div><dt>Comuna</dt><dd>{p.comuna}</dd></div>
              <div><dt>Potencia</dt><dd>{p.potencia_kw} kW</dd></div>
              <div><dt>Suscripción</dt><dd><EstadoSuscripcion estado={p.estado_suscripcion} /></dd></div>
              {p.monto_mensual && <div><dt>Cuota mensual</dt><dd>{formatoPesos(p.monto_mensual)}</dd></div>}
            </dl>
            <Link className="boton secundario ver-ficha" to={`/cliente/plantas/${p.id_planta}`}>
              Ver ficha técnica
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
