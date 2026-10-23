import { Navigate, Route, Routes } from 'react-router-dom';
import RutaProtegida from '../shared/components/RutaProtegida.jsx';
import PanelLayout from '../shared/layouts/PanelLayout.jsx';
import LoginPage from '../modules/auth/pages/LoginPage.jsx';
import RegistroPage from '../modules/auth/pages/RegistroPage.jsx';
import MisPlantasPage from '../modules/cliente/pages/MisPlantasPage.jsx';
import PlantaFichaPage from '../modules/cliente/pages/PlantaFichaPage.jsx';
import InicioTrabajadorPage from '../modules/trabajador/pages/InicioTrabajadorPage.jsx';
import PlantasPage from '../modules/administrador/pages/PlantasPage.jsx';
import PlantaFormPage from '../modules/administrador/pages/PlantaFormPage.jsx';
import PlantaDetallePage from '../modules/administrador/pages/PlantaDetallePage.jsx';
import ClientesPage from '../modules/administrador/pages/ClientesPage.jsx';
import ClienteFormPage from '../modules/administrador/pages/ClienteFormPage.jsx';
import ClienteDetallePage from '../modules/administrador/pages/ClienteDetallePage.jsx';
import TrabajadoresPage from '../modules/administrador/pages/TrabajadoresPage.jsx';
import TrabajadorFormPage from '../modules/administrador/pages/TrabajadorFormPage.jsx';

const ENLACES_CLIENTE = [{ to: '/cliente', texto: 'Mis plantas', end: true }];
const ENLACES_TRABAJADOR = [{ to: '/trabajador', texto: 'Inicio', end: true }];
const ENLACES_ADMIN = [
  { to: '/admin/plantas', texto: 'Plantas' },
  { to: '/admin/clientes', texto: 'Clientes' },
  { to: '/admin/trabajadores', texto: 'Trabajadores' },
];

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route
        path="/cliente"
        element={<RutaProtegida rol="cliente"><PanelLayout enlaces={ENLACES_CLIENTE} claseVista="vista-cliente" /></RutaProtegida>}
      >
        <Route index element={<MisPlantasPage />} />
        <Route path="plantas/:id" element={<PlantaFichaPage />} />
      </Route>

      <Route
        path="/trabajador"
        element={<RutaProtegida rol="trabajador"><PanelLayout enlaces={ENLACES_TRABAJADOR} /></RutaProtegida>}
      >
        <Route index element={<InicioTrabajadorPage />} />
      </Route>

      <Route
        path="/admin"
        element={<RutaProtegida rol="administrador"><PanelLayout enlaces={ENLACES_ADMIN} /></RutaProtegida>}
      >
        <Route index element={<Navigate to="plantas" replace />} />
        <Route path="plantas" element={<PlantasPage />} />
        <Route path="plantas/nueva" element={<PlantaFormPage />} />
        <Route path="plantas/:id" element={<PlantaDetallePage />} />
        <Route path="plantas/:id/editar" element={<PlantaFormPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="clientes/nuevo" element={<ClienteFormPage />} />
        <Route path="clientes/:id" element={<ClienteDetallePage />} />
        <Route path="clientes/:id/editar" element={<ClienteFormPage />} />
        <Route path="trabajadores" element={<TrabajadoresPage />} />
        <Route path="trabajadores/nuevo" element={<TrabajadorFormPage />} />
        <Route path="trabajadores/:id/editar" element={<TrabajadorFormPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
