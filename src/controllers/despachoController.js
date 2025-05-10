import db from '../config/db.js';
import { validationResult } from 'express-validator';

// Registrar un nuevo despacho
export const registrarDespacho = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { productos } = req.body;
    const usuario = req.usuario;

    if (usuario.rol !== 'líder') {
        return res.status(403).json({ message: 'Solo los líderes pueden registrar un despacho.' });
    }

    try {
        const fecha_despacho = new Date();

        for (const producto of productos) {
            const { producto_id, cantidad, lote, estacion_id } = producto;

            // Aquí debería estar la validación de existencia del producto:
            const [resultado] = await db.query(
                `SELECT * FROM productos WHERE id = ?`,
                [producto_id]
            );

            if (resultado.length === 0) {
                return res.status(404).json({ message: `El producto con ID ${producto_id} no existe en el inventario.` });
            }

            // Validación de stock suficiente
            if (resultado[0].stock < cantidad) {
                return res.status(400).json({ message: `Stock insuficiente. Disponible: ${resultado[0].stock}, requerido: ${cantidad}.` });
            }

            // Registrar el despacho
            await db.query(
                `INSERT INTO despachos (producto_id, cantidad, lote, estacion_id, fecha_despacho, lider_id) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [producto_id, cantidad, lote, estacion_id, fecha_despacho, usuario.id]
            );

            // Actualización del inventario
            await db.query(
                `UPDATE productos SET stock = stock - ? WHERE id = ?`,
                [cantidad, producto_id]
            );
        }

        res.status(201).json({ message: 'Despacho registrado correctamente.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al registrar el despacho.' });
    }
};


// Obtener todos los despachos
export const obtenerDespachos = async (req, res) => {
    try {
        const [despachos] = await db.query(`SELECT * FROM despachos`);
        res.status(200).json(despachos);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener los despachos.' });
    }
};

// Obtener despachos por estación
export const obtenerDespachoPorEstacion = async (req, res) => {
    const { estacion_id } = req.params;
    try {
        const [despacho] = await db.query(`SELECT * FROM despachos WHERE estacion_id = ?`, [estacion_id]);
        if (despacho.length === 0) {
            return res.status(404).json({ message: 'No se encontraron despachos para esta estación.' });
        }
        res.status(200).json(despacho);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener el despacho.' });
    }
};

// Actualizar estado del despacho
export const actualizarEstadoDespacho = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    // Lista de estados permitidos
    const estadosPermitidos = ["Pendiente", "Enviado", "Entregado"];

    // Validación: El estado debe ser válido
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
            message: `Estado no válido. Los estados permitidos son: ${estadosPermitidos.join(", ")}`
        });
    }

    try {
        // Verificamos si el despacho existe
        const [despacho] = await db.query(`SELECT * FROM despachos WHERE id = ?`, [id]);

        if (despacho.length === 0) {
            return res.status(404).json({ message: "No se encontró el despacho especificado." });
        }

        // Actualizamos el estado
        const [result] = await db.query(`UPDATE despachos SET estado = ? WHERE id = ?`, [estado, id]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ message: "No se pudo actualizar el estado del despacho." });
        }

        res.status(200).json({
            message: "Estado del despacho actualizado correctamente.",
            despacho_id: id,
            nuevo_estado: estado
        });

    } catch (error) {
        console.error("Error al actualizar el estado del despacho:", error.message);
        res.status(500).json({ message: "Error al actualizar el estado del despacho." });
    }
};

