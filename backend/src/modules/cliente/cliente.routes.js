import { Router } from 'express';
import { autenticar, permitirRoles } from '../../shared/middlewares/auth.js';
import * as cliente from './cliente.controller.js';

const router = Router();

router.use(autenticar, permitirRoles('cliente'));

router.get('/plantas', cliente.misPlantas);

export default router;
