import { Router } from 'express';
import auth from '../modules/auth/auth.routes.js';
import cliente from '../modules/cliente/cliente.routes.js';
import administrador from '../modules/administrador/administrador.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.use('/auth', auth);
router.use('/cliente', cliente);
router.use('/admin', administrador);

export default router;
