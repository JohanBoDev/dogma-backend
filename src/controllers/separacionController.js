import db from '../config/db.js';

export const generarConsolidadoSeparacion = async (req, res) => {
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
    for (const producto of productos) {
      const { producto_id, cantidad } = producto;

      if (!producto_id || !cantidad || cantidad <= 0) {
        return res.status(400).json({ message: 'Producto inválido en la lista.' });
      }

      await db.query(
        `INSERT INTO separaciones (estacion_id, producto_id, cantidad, fecha, lider_id) 
         VALUES (?, ?, ?, NOW(), ?)`,
        [estacion_id, producto_id, cantidad, usuario.id]
      );
    }

    res.status(201).json({
      message: 'Consolidado de separación registrado correctamente',
      cantidad_productos: productos.length
    });

  } catch (error) {
    console.error('Error al generar consolidado:', error);
    res.status(500).json({ message: 'Error del servidor al registrar el consolidado.' });
  }
};
