import { Navigate, Route, Routes } from 'react-router-dom';
import RutaProtegida from '../shared/components/RutaProtegida.jsx';
import AdminLayout from '../shared/layouts/AdminLayout.jsx';
import ClienteLayout from '../shared/layouts/ClienteLayout.jsx';
import LoginPage from '../modules/auth/pages/LoginPage.jsx';
import RegistroPage from '../modules/auth/pages/RegistroPage.jsx';
import MisPlantasPage from '../modules/cliente/pages/MisPlantasPage.jsx';
import PlantasPage from '../modules/administrador/pages/PlantasPage.jsx';
import PlantaFormPage from '../modules/administrador/pages/PlantaFormPage.jsx';
import PlantaDetallePage from '../modules/administrador/pages/PlantaDetallePage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route path="/cliente" element={<RutaProtegida rol="cliente"><ClienteLayout /></RutaProtegida>}>
        <Route index element={<MisPlantasPage />} />
      </Route>

      <Route path="/admin" element={<RutaProtegida rol="administrador"><AdminLayout /></RutaProtegida>}>
        <Route index element={<Navigate to="plantas" replace />} />
        <Route path="plantas" element={<PlantasPage />} />
        <Route path="plantas/nueva" element={<PlantaFormPage />} />
        <Route path="plantas/:id" element={<PlantaDetallePage />} />
        <Route path="plantas/:id/editar" element={<PlantaFormPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
