import { Router } from 'express';
import { autenticar, permitirRoles } from '../../shared/middlewares/auth.js';
import * as clientes from './clientes.controller.js';
import * as plantas from './plantas.controller.js';
import * as suscripciones from './suscripciones.controller.js';

const router = Router();

router.use(autenticar, permitirRoles('administrador'));

router.get('/clientes', clientes.listar);

// Plantas y ficha técnica (HU-03)
router.get('/plantas', plantas.listar);
router.post('/plantas', plantas.crear);
router.get('/plantas/:id', plantas.obtener);
router.put('/plantas/:id', plantas.actualizar);

// Suscripciones asociadas a una planta (HU-03)
router.get('/plantas/:id/suscripciones', plantas.listarSuscripciones);
router.post('/plantas/:id/suscripciones', plantas.crearSuscripcion);
router.patch('/suscripciones/:id', suscripciones.actualizar);
router.get('/planes', suscripciones.listarPlanes);

export default router;
