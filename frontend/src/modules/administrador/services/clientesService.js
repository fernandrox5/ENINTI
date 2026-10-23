import { api } from '../../../shared/utils/api.js';

export const listarClientes = () => api('/admin/clientes');
export const obtenerCliente = (id) => api(`/admin/clientes/${id}`);
export const crearCliente = (datos) => api('/admin/clientes', { method: 'POST', body: datos });
export const actualizarCliente = (id, datos) => api(`/admin/clientes/${id}`, { method: 'PUT', body: datos });

export const listarComunas = () => api('/admin/comunas');
