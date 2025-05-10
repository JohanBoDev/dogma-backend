import db from '../config/db.js';
import { validationResult } from 'express-validator';

export const generarConsolidadoSeparacion = async (req, res) => {
  // Validación de datos
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { estacion_id, productos } = req.body;
  const usuario = req.usuario;

  // Verificación de rol
  if (usuario.rol !== 'líder') {
    return res.status(403).json({ message: 'Solo los líderes pueden generar consolidado de separación.' });
  }

  if (!estacion_id || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ message: 'Faltan datos obligatorios o lista de productos vacía.' });
  }

  try {
    // Fecha de generación
    const fecha_generacion = new Date();

    // Recorrido de productos y registro en la base de datos
    for (const producto of productos) {
      const { producto_id, cantidad } = producto;

      if (!producto_id || !cantidad || cantidad <= 0) {
        return res.status(400).json({ message: 'Producto inválido en la lista.' });
      }

      await db.query(
        `INSERT INTO separaciones (estacion_id, producto_id, cantidad, fecha, lider_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [estacion_id, producto_id, cantidad, fecha_generacion, usuario.id]
      );
    }

    // Respuesta exitosa
    res.status(201).json({
      message: 'Consolidado de separación registrado correctamente',
      cantidad_productos: productos.length
    });

  } catch (error) {
    console.error('Error al generar consolidado:', error.message);
    res.status(500).json({ message: 'Error del servidor al registrar el consolidado.' });
  }
};

// Obtener todos los consolidados
export const obtenerConsolidados = async (req, res) => {
  try {
    const [consolidados] = await db.query(`SELECT * FROM separaciones`);
    res.status(200).json(consolidados);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al obtener los consolidados de separación.' });
  }
};

// Obtener un consolidado por estación
export const obtenerConsolidadoPorEstacion = async (req, res) => {
  const { estacion_id } = req.params;
  try {
    const [consolidado] = await db.query(`SELECT * FROM separaciones WHERE estacion_id = ?`, [estacion_id]);
    if (consolidado.length === 0) {
      return res.status(404).json({ message: 'No se encontró el consolidado para esta estación.' });
    }
    res.status(200).json(consolidado);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al obtener el consolidado de separación.' });
  }
};
