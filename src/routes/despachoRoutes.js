import { Router } from 'express';
import { registrarDespacho, obtenerDespachos, obtenerDespachoPorEstacion, actualizarEstadoDespacho } from '../controllers/despachoController.js';
import { verificarToken, verificarRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para registrar un nuevo despacho (Solo líderes)
router.post(
    '/',
    verificarToken,
    verificarRol('líder'),
    registrarDespacho
);

// Ruta para obtener todos los despachos (Solo líderes)
router.get(
    '/',
    verificarToken,
    verificarRol('líder'),
    obtenerDespachos
);

// Ruta para obtener un despacho por zona (Solo líderes)
router.get(
    '/:estacion_id',
    verificarToken,
    verificarRol('líder'),
    obtenerDespachoPorEstacion
);

// Ruta para actualizar el estado de un despacho (Solo líderes)
router.put(
    '/:id',
    verificarToken,
    verificarRol('líder'),
    actualizarEstadoDespacho
);

export default router;
