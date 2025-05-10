import { Router } from 'express';
import { registrarProductoDanado, obtenerProductosDanados, obtenerProductoDanadoPorProducto } from '../controllers/productoDanadoController.js';
import { verificarToken, verificarRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para registrar un producto dañado (Solo líderes y colaboradores)
router.post(
    '/',
    verificarToken,
    (req, res, next) => {
        if (req.usuario.rol === 'líder' || req.usuario.rol === 'colaborador') {
            next();
        } else {
            return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta" });
        }
    },
    registrarProductoDanado
);

// Ruta para obtener todos los productos dañados (Solo líderes)
router.get(
    '/',
    verificarToken,
    verificarRol('líder'),
    obtenerProductosDanados
);

// Ruta para obtener productos dañados por producto (Solo líderes)
router.get(
    '/producto/:producto_id',
    verificarToken,
    verificarRol('líder'),
    obtenerProductoDanadoPorProducto
);

export default router;
