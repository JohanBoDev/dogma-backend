import {Router} from 'express';
import {crearPlanta, obtenerPlantas} from '../controllers/plantasController.js';

const router = Router();

// Ruta para crear una nueva planta
router.post('/', crearPlanta);

// Ruta para obtener todas las plantas
router.get('/', obtenerPlantas);

export default router;