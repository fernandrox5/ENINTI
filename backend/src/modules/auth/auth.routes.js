import { Router } from 'express';
import { HttpError } from '../../shared/utils/httpError.js';
import { autenticar } from '../../shared/middlewares/auth.js';
import * as auth from './auth.controller.js';

const router = Router();

router.post('/registro', auth.registrar);
router.post('/login', auth.login);

// /me exige un token real: el modo AUTH_BYPASS no representa a ningún usuario
router.get('/me', autenticar, (req, _res, next) => {
  if (!req.usuario?.id) throw new HttpError(401, 'Debes iniciar sesión');
  next();
}, auth.yo);

export default router;
