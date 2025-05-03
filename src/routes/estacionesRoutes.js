import { Router } from 'express';
import { crearEstacion, obtenerEstaciones } from '../controllers/estacionesController.js';

const router = Router();

router.post('/', crearEstacion);
router.get('/', obtenerEstaciones);

export default router;
