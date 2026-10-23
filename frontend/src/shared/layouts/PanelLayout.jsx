import { NavLink, Outlet } from 'react-router-dom';
import BotonSalir from '../components/BotonSalir.jsx';

// Estructura común de los paneles: barra superior con navegación y cierre de sesión.
// enlaces: [{ to, texto, end? }]; claseVista agrega estilos por perfil (p. ej. 'vista-cliente').
export default function PanelLayout({ enlaces, claseVista = '' }) {
  return (
    <div className={`layout ${claseVista}`}>
      <header className="topbar">
        <span className="marca">ENINTI</span>
        <nav>
          {enlaces.map(({ to, texto, end }) => (
            <NavLink key={to} to={to} end={end}>{texto}</NavLink>
          ))}
        </nav>
        <BotonSalir />
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}
