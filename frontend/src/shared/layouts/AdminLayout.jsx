import { NavLink, Outlet } from 'react-router-dom';
import BotonSalir from '../components/BotonSalir.jsx';

export default function AdminLayout() {
  return (
    <div className="layout">
      <header className="topbar">
        <span className="marca">ENINTI</span>
        <nav>
          <NavLink to="/admin/plantas">Plantas</NavLink>
        </nav>
        <BotonSalir />
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}
