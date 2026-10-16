import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="layout">
      <header className="topbar">
        <span className="marca">ENINTI</span>
        <nav>
          <NavLink to="/admin/plantas">Plantas</NavLink>
        </nav>
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}
