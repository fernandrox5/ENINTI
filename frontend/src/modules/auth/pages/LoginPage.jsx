import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/authService.js';
import { INICIO_POR_ROL, useAuth } from '../../../shared/context/AuthContext.jsx';
import Mensaje from '../../../shared/components/Mensaje.jsx';

export default function LoginPage() {
  const { usuario, iniciarSesion: guardarSesion } = useAuth();
  const navigate = useNavigate();
  const desde = useLocation().state?.desde;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  if (usuario) return <Navigate to={INICIO_POR_ROL[usuario.rol] ?? '/'} replace />;

  async function entrar(e) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const sesion = await iniciarSesion({ email, password });
      const inicio = INICIO_POR_ROL[sesion.usuario.rol];
      if (!inicio) {
        setError(new Error('Tu perfil todavía no tiene acceso a esta plataforma.'));
        setEnviando(false);
        return;
      }
      guardarSesion(sesion);
      // Vuelve a la página que pedía antes de iniciar sesión, solo si es de su propia área
      const area = `/${inicio.split('/')[1]}`;
      navigate(desde?.startsWith(area) ? desde : inicio, { replace: true });
    } catch (err) {
      setError(err);
      setEnviando(false);
    }
  }

  return (
    <main className="pantalla-acceso vista-cliente">
      <div className="tarjeta acceso">
        <p className="marca-acceso">ENINTI</p>
        <h1>Iniciar sesión</h1>

        <form className="formulario-simple" onSubmit={entrar}>
          <Mensaje error={error} />
          <label>
            Correo electrónico
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Contraseña
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" className="boton" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="pie-acceso">
          ¿Eres cliente de ENINTI y aún no tienes cuenta? <Link to="/registro">Crear mi cuenta</Link>
        </p>
      </div>
    </main>
  );
}
