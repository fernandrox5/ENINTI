import { api } from '../../../shared/utils/api.js';

export const listarMisPlantas = () => api('/cliente/plantas');
