import db from '../config/db.js';
import { validationResult } from 'express-validator';

// Registrar una devolución
export const registrarDevolucion = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { producto_id, lote, cantidad, estado_retorno, motivo, colaborador_id } = req.body;

    try {
        // 1️⃣ Validar que el producto fue despachado antes
        const [productoDespachado] = await db.query(
            `SELECT * FROM despachos WHERE producto_id = ? AND lote = ?`, 
            [producto_id, lote]
        );

        if (productoDespachado.length === 0) {
            return res.status(404).json({ message: 'El producto o el lote no fueron despachados previamente.' });
        }

        // 2️⃣ Validar que el producto existe en inventario
        const [producto] = await db.query(
            `SELECT * FROM productos WHERE id = ?`, [producto_id]
        );

        if (producto.length === 0) {
            return res.status(404).json({ message: 'El producto no existe en el inventario.' });
        }

        const fecha_retorno = new Date();

        // 3️⃣ Registrar la devolución en la tabla incluyendo "motivo"
        await db.query(
            `INSERT INTO devoluciones (producto_id, lote, cantidad, estado_retorno, motivo, fecha_retorno, colaborador_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [producto_id, lote, cantidad, estado_retorno, motivo, fecha_retorno, colaborador_id]
        );

        // 4️⃣ Actualización del inventario si el producto está en buen estado
        if (estado_retorno === 'Bueno') {

            // Validación adicional para evitar valores negativos
            if (producto[0].stock + cantidad < 0) {
                return res.status(400).json({ message: 'Error: La cantidad de retorno supera el límite del inventario.' });
            }

            await db.query(
                `UPDATE productos SET stock = stock + ? WHERE id = ?`,
                [cantidad, producto_id]
            );

            console.log(`Inventario actualizado: +${cantidad} al producto ${producto_id}`);

        } else {
            console.log(`Producto registrado como 'Mal Estado': ${producto_id}`);
        }

        res.status(201).json({ message: 'Devolución registrada correctamente.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al registrar la devolución.' });
    }
};

// Obtener todas las devoluciones
export const obtenerDevoluciones = async (req, res) => {
    try {
        const [devoluciones] = await db.query(`SELECT * FROM devoluciones`);
        res.status(200).json(devoluciones);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener las devoluciones.' });
    }
};

// Obtener devoluciones por producto
export const obtenerDevolucionesPorProducto = async (req, res) => {
    const { producto_id } = req.params;
    try {
        const [devoluciones] = await db.query(`SELECT * FROM devoluciones WHERE producto_id = ?`, [producto_id]);
        if (devoluciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron devoluciones para este producto.' });
        }
        res.status(200).json(devoluciones);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener las devoluciones del producto.' });
    }
};
