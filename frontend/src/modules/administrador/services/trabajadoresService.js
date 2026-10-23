import { api } from '../../../shared/utils/api.js';

export const listarTrabajadores = () => api('/admin/trabajadores');
export const obtenerTrabajador = (id) => api(`/admin/trabajadores/${id}`);
export const crearTrabajador = (datos) => api('/admin/trabajadores', { method: 'POST', body: datos });
export const actualizarTrabajador = (id, datos) => api(`/admin/trabajadores/${id}`, { method: 'PUT', body: datos });
