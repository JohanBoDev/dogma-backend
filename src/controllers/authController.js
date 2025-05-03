import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ;

// Registrar usuario
export const registrarUsuario = async (req, res) => {
  const { nombre_usuario, contraseña, rol_id, colaborador_id } = req.body;

  if (!nombre_usuario || !contraseña || !rol_id || !colaborador_id) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si ya existe el nombre de usuario
    const [existe] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
    if (existe.length > 0) {
      return res.status(400).json({ message: 'El nombre de usuario ya está registrado' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);

    // Insertar el nuevo usuario
    const [resultado] = await db.query(
      `INSERT INTO usuarios (nombre_usuario, contraseña, rol_id, colaborador_id) VALUES (?, ?, ?, ?)`,
      [nombre_usuario, contraseñaHash, rol_id, colaborador_id]
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario_id: resultado.insertId
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};

// Iniciar sesión
export const iniciarSesion = async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;

  if (!nombre_usuario || !contraseña) {
    return res.status(400).json({ message: 'Nombre de usuario y contraseña son obligatorios' });
  }

  try {
    const [usuarios] = await db.query(
      `SELECT usuarios.*, roles.nombre AS rol FROM usuarios 
       JOIN roles ON usuarios.rol_id = roles.id 
       WHERE nombre_usuario = ?`,
      [nombre_usuario]
    );

    const usuario = usuarios[0];
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};
