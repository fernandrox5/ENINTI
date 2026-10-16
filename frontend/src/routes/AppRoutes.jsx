import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../shared/layouts/AdminLayout.jsx';
import PlantasPage from '../modules/administrador/pages/PlantasPage.jsx';
import PlantaFormPage from '../modules/administrador/pages/PlantaFormPage.jsx';
import PlantaDetallePage from '../modules/administrador/pages/PlantaDetallePage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="plantas" replace />} />
        <Route path="plantas" element={<PlantasPage />} />
        <Route path="plantas/nueva" element={<PlantaFormPage />} />
        <Route path="plantas/:id" element={<PlantaDetallePage />} />
        <Route path="plantas/:id/editar" element={<PlantaFormPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/plantas" replace />} />
    </Routes>
  );
}
