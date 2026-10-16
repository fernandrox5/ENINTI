import { Router } from 'express';
import administrador from '../modules/administrador/administrador.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.use('/admin', administrador);

export default router;
