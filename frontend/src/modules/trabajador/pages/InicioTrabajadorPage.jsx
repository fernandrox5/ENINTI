import { useAuth } from '../../../shared/context/AuthContext.jsx';

// Página de entrada del trabajador. La agenda de visitas (HU-14) la construye el Equipo 2.
export default function InicioTrabajadorPage() {
  const { usuario } = useAuth();

  return (
    <section>
      <h1>Hola, {usuario.nombre.split(' ')[0]}</h1>
      <article className="tarjeta">
        <p>Tu cuenta de trabajador está activa.</p>
        <p className="ayuda">Aquí verás tu agenda de visitas asignadas cuando esté disponible.</p>
      </article>
    </section>
  );
}
