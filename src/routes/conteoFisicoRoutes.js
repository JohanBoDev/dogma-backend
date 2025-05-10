import { Router } from 'express';
import { registrarConteoFisico, obtenerConteosFisicos, obtenerConteoPorProducto } from '../controllers/conteoFisicoController.js';
import { verificarToken, verificarRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para registrar un conteo físico (Solo líderes)
router.post(
    '/',
    verificarToken,
    verificarRol('líder'),
    registrarConteoFisico
);

// Ruta para obtener todos los conteos físicos (Solo líderes)
router.get(
    '/',
    verificarToken,
    verificarRol('líder'),
    obtenerConteosFisicos
);

// Ruta para obtener un conteo físico por producto (Solo líderes)
router.get(
    '/producto/:producto_id',
    verificarToken,
    verificarRol('líder'),
    obtenerConteoPorProducto
);

export default router;