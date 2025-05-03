import db from '../config/db.js';

// Endpoint para registrar un producto entrante
export const registrarProductoEntrante = async (req, res) => {
    const { producto_id, cantidad, fecha_vencimiento, lote, planta_id, numero_transporte, colaborador_id } = req.body;

    try {
        if (cantidad <= 0) {
            res.status(400).json({ message: "La cantidad debe ser mayor a 0" })
            return
        }
        const respuesta = await db.query(`INSERT INTO entradas (producto_id,cantidad, fecha_vencimiento, lote, planta_id, numero_transporte, colaborador_id) VALUES (?, ?, ?, ?, ?, ?, ?) `, [producto_id, cantidad, fecha_vencimiento, lote, planta_id, numero_transporte, colaborador_id]);
        res.status(201).json({ message: "Producto registrado", id: respuesta.insertId });
    }
     catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar el producto" });
    }
}


// Endpoint para crear un nuevo producto
export const crearProducto = async (req, res) => {
  const { codigo, nombre, embalaje, tamaño_cubeta, unidad } = req.body;

  try {
    if (!codigo || !nombre || !embalaje || !tamaño_cubeta || !unidad) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si ya existe un producto con el mismo código
    const [existe] = await db.query('SELECT * FROM productos WHERE codigo = ?', [codigo]);
    if (existe.length > 0) {
      return res.status(400).json({ message: 'Ya existe un producto con ese código' });
    }

    // Insertar producto
    const [resultado] = await db.query(
      `INSERT INTO productos (codigo, nombre, embalaje, tamaño_cubeta, unidad) VALUES (?, ?, ?, ?, ?)`,
      [codigo, nombre, embalaje, tamaño_cubeta, unidad]
    );

    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto_id: resultado.insertId
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error en el servidor al crear producto' });
  }
};


// Endpoint para registrar una confirmación de producto

export const registrarConfirmacion = async (req, res) => {
  const { producto_id, lote, cantidad, estacion_id, colaborador_id } = req.body;

  if (!producto_id || !lote || !cantidad || !estacion_id || !colaborador_id) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Buscar en tabla de entradas
    const [entradas] = await db.query(
      `SELECT * FROM entradas WHERE producto_id = ? AND lote = ? ORDER BY id DESC LIMIT 1`,
      [producto_id, lote]
    );

    if (entradas.length === 0) {
      return res.status(404).json({ message: 'No se encontró ese lote del producto en las entradas' });
    }

    const entrada = entradas[0];

    // Validar fecha de vencimiento
    const hoy = new Date().toISOString().split('T')[0];
    if (entrada.fecha_vencimiento < hoy) {
      return res.status(400).json({ message: 'La fecha de vencimiento está vencida' });
    }

    // Validar cantidad disponible
    if (cantidad > entrada.cantidad) {
      return res.status(400).json({ message: 'La cantidad excede la disponible en el lote' });
    }

    // Insertar en confirmaciones
    const [resultado] = await db.query(
      `INSERT INTO confirmaciones (producto_id, lote, cantidad, estacion_id, colaborador_id)
       VALUES (?, ?, ?, ?, ?)`,
      [producto_id, lote, cantidad, estacion_id, colaborador_id]
    );

    res.status(201).json({ message: 'Confirmación registrada correctamente', confirmacion_id: resultado.insertId });

  } catch (error) {
    console.error('Error en registrarConfirmacion:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};