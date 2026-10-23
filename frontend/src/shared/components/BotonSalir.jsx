import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function BotonSalir() {
  const { cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  return <button type="button" className="boton-salir" onClick={salir}>Cerrar sesión</button>;
}
