import { api } from '../../../shared/utils/api.js';

export const iniciarSesion = (datos) => api('/auth/login', { method: 'POST', body: datos });
export const registrarCliente = (datos) => api('/auth/registro', { method: 'POST', body: datos });
