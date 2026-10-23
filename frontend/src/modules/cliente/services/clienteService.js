import { api } from '../../../shared/utils/api.js';

export const listarMisPlantas = () => api('/cliente/plantas');
export const obtenerFichaPlanta = (id) => api(`/cliente/plantas/${id}`);
