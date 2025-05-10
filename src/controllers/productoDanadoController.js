import db from '../config/db.js';
import { validationResult } from 'express-validator';

// Registrar un producto dañado
export const registrarProductoDanado = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { producto_id, lote, cantidad, motivo, proceso_afectado, colaborador_id, estacion_id } = req.body;

    try {
        // 1️⃣ Validar que el producto existe en inventario
        const [producto] = await db.query(
            `SELECT * FROM productos WHERE id = ?`, [producto_id]
        );

        if (producto.length === 0) {
            return res.status(404).json({ message: 'El producto no existe en el inventario.' });
        }

        // 2️⃣ Validar que hay suficiente stock para descontar
        if (producto[0].stock < cantidad) {
            return res.status(400).json({ message: `Stock insuficiente. Disponible: ${producto[0].stock}, requerido: ${cantidad}.` });
        }

        // 3️⃣ Validar que el lote existe en las entradas
        const [loteExistente] = await db.query(
            `SELECT * FROM entradas WHERE lote = ? AND producto_id = ?`, [lote, producto_id]
        );

        if (loteExistente.length === 0) {
            return res.status(404).json({ message: `El lote ${lote} no existe para este producto en inventario.` });
        }

        const fecha_registro = new Date();

        // 4️⃣ Registrar el producto en mal estado
        await db.query(
            `INSERT INTO productos_danados (producto_id, lote, cantidad, motivo, proceso_afectado, fecha_registro, colaborador_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [producto_id, lote, cantidad, motivo, proceso_afectado, fecha_registro, colaborador_id]
        );

        // 5️⃣ Actualización del inventario
        await db.query(
            `UPDATE productos SET stock = stock - ? WHERE id = ?`,
            [cantidad, producto_id]
        );

        console.log(`Producto dañado registrado: -${cantidad} unidades al producto ${producto_id}`);
        
        res.status(201).json({ message: 'Producto dañado registrado correctamente.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al registrar el producto dañado.' });
    }
};

// Obtener todos los productos dañados
export const obtenerProductosDanados = async (req, res) => {
    try {
        const [productosDanados] = await db.query(`SELECT * FROM productos_danados`);
        res.status(200).json(productosDanados);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener los productos dañados.' });
    }
};

// Obtener productos dañados por producto
export const obtenerProductoDanadoPorProducto = async (req, res) => {
    const { producto_id } = req.params;
    try {
        const [productosDanados] = await db.query(`SELECT * FROM productos_danados WHERE producto_id = ?`, [producto_id]);
        if (productosDanados.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos dañados para este producto.' });
        }
        res.status(200).json(productosDanados);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener los productos dañados del producto.' });
    }
};
