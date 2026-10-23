import { NavLink, Outlet } from 'react-router-dom';
import BotonSalir from '../components/BotonSalir.jsx';

export default function ClienteLayout() {
  return (
    <div className="layout vista-cliente">
      <header className="topbar">
        <span className="marca">ENINTI</span>
        <nav>
          <NavLink to="/cliente" end>Mis plantas</NavLink>
        </nav>
        <BotonSalir />
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}
