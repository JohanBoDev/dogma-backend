import {crearProducto, registrarProductoEntrante, registrarConfirmacion} from '../controllers/productosController.js';
import { Router } from 'express';

const router = Router();
// Endpoint para registrar un producto entrante
router.post('/entrantes', registrarProductoEntrante);

// Endpoint para crear un nuevo producto
router.post('/', crearProducto);

// Endpoint para registrar una confirmación de producto
router.post('/confirmacion', registrarConfirmacion);

export default router;