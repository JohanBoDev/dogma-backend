import { Router } from 'express';
import { generarConsolidadoSeparacion, obtenerConsolidados, obtenerConsolidadoPorEstacion } from '../controllers/separacionController.js';
import { verificarToken, verificarRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para crear un consolidado de separación (Solo líderes)
router.post(
  '/consolidado',
  verificarToken,
  verificarRol('líder'),
  generarConsolidadoSeparacion
);

// Ruta para obtener todos los consolidados (Solo líderes)
router.get(
  '/consolidado',
  verificarToken,
  verificarRol('líder'),
  obtenerConsolidados
);

// Ruta para obtener un consolidado por estación (Solo líderes)
router.get(
  '/consolidado/:estacion_id',
  verificarToken,
  verificarRol('líder'),
  obtenerConsolidadoPorEstacion
);

export default router;
