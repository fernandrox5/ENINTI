import { Navigate, useLocation } from 'react-router-dom';
import { INICIO_POR_ROL, useAuth } from '../context/AuthContext.jsx';

// Solo deja pasar a usuarios con sesión y con el rol indicado
export default function RutaProtegida({ rol, children }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) return <p className="cargando-sesion">Cargando…</p>;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  if (usuario.rol !== rol) return <Navigate to={INICIO_POR_ROL[usuario.rol] ?? '/login'} replace />;
  return children;
}
