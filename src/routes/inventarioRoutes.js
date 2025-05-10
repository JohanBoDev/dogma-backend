import express from 'express';
import { consultarHistorialProducto } from '../controllers/inventarioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:codigoProducto', verificarToken, consultarHistorialProducto);

export default router;