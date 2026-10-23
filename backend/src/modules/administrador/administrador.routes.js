import { Router } from 'express';
import { autenticar, permitirRoles } from '../../shared/middlewares/auth.js';
import * as clientes from './clientes.controller.js';
import * as plantas from './plantas.controller.js';
import * as suscripciones from './suscripciones.controller.js';
import * as trabajadores from './trabajadores.controller.js';

const router = Router();

router.use(autenticar, permitirRoles('administrador'));

// Clientes (HU-03)
router.get('/clientes', clientes.listar);
router.post('/clientes', clientes.crear);
router.get('/clientes/:id', clientes.obtener);
router.put('/clientes/:id', clientes.actualizar);
router.get('/comunas', clientes.listarComunas);

// Plantas y ficha técnica (HU-03)
router.get('/plantas', plantas.listar);
router.post('/plantas', plantas.crear);
router.get('/plantas/:id', plantas.obtener);
router.put('/plantas/:id', plantas.actualizar);

// Suscripciones asociadas a una planta (HU-03)
router.get('/plantas/:id/suscripciones', plantas.listarSuscripciones);
router.post('/plantas/:id/suscripciones', plantas.crearSuscripcion);
router.patch('/suscripciones/:id', suscripciones.actualizar);

// Cuentas de trabajadores (HU-15)
router.get('/trabajadores', trabajadores.listar);
router.post('/trabajadores', trabajadores.crear);
router.get('/trabajadores/:id', trabajadores.obtener);
router.put('/trabajadores/:id', trabajadores.actualizar);

export default router;
