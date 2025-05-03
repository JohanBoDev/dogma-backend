import {Router} from 'express';
import { registrarUsuario, iniciarSesion } from '../controllers/authController.js';

const router = Router();

// Registrar nuevo usuario
router.post('/registro', registrarUsuario);

// Iniciar sesión
router.post('/login', iniciarSesion);

export default router;
