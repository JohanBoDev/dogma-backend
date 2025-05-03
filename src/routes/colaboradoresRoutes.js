import { Router } from 'express';
import { crearColaborador, obtenerColaboradores } from '../controllers/colaboradoresController.js';

const router = Router();

// Ruta para crear un nuevo colaborador

router.post('/', crearColaborador);

// Ruta para obtener todos los colaboradores

router.get('/', obtenerColaboradores);

export default router;