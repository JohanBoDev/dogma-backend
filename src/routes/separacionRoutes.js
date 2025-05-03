import {Router} from 'express';
import { generarConsolidadoSeparacion } from '../controllers/separacionController.js';
import { verificarToken, verificarRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta protegida: solo para usuarios con rol "líder"
router.post(
  '/consolidado',
  verificarToken,
  verificarRol('líder'),
  generarConsolidadoSeparacion
);

export default router;
