import { Router } from 'express';
import { registrarDevolucion, obtenerDevoluciones, obtenerDevolucionesPorProducto } from '../controllers/devolucionesController.js';
import { verificarToken, verificarRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para registrar una nueva devolución (Acepta colaborador y líder)
router.post(
    '/',
    verificarToken,
    (req, res, next) => {
        // Validación para aceptar tanto "colaborador" como "líder"
        if (req.usuario.rol === 'colaborador' || req.usuario.rol === 'líder') {
            next();
        } else {
            return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta" });
        }
    },
    registrarDevolucion
);

// Ruta para obtener todas las devoluciones (Solo líderes)
router.get(
    '/',
    verificarToken,
    verificarRol('líder'),
    obtenerDevoluciones
);

// Ruta para obtener devoluciones de un producto específico (Solo líderes)
router.get(
    '/producto/:producto_id',
    verificarToken,
    verificarRol('líder'),
    obtenerDevolucionesPorProducto
);

export default router;
