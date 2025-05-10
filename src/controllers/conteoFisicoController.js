import db from '../config/db.js';
import { validationResult } from 'express-validator';

// Registrar un conteo físico
export const registrarConteoFisico = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { producto_id, cantidad_fisica, lider_id } = req.body;

    try {
        // Validar que el producto existe en el inventario
        const [producto] = await db.query(
            `SELECT * FROM productos WHERE id = ?`, [producto_id]
        );

        if (producto.length === 0) {
            return res.status(404).json({ message: 'El producto no existe en el inventario.' });
        }

        // Obtener la cantidad documentada
        const cantidad_documentada = producto[0].stock;
        const diferencia = cantidad_fisica - cantidad_documentada;

        // Definir el tipo de diferencia
        let tipo_diferencia = 'Coincide';
        if (diferencia > 0) tipo_diferencia = 'Sobrante';
        if (diferencia < 0) tipo_diferencia = 'Faltante';

        const fecha_conteo = new Date();

        // Registrar el conteo físico en la base de datos
        await db.query(
            `INSERT INTO conteos_fisicos (producto_id, cantidad_fisica, fecha_conteo, lider_id) 
             VALUES (?, ?, ?, ?)`,
            [producto_id, cantidad_fisica, fecha_conteo, lider_id]
        );

        res.status(201).json({ 
            message: 'Conteo físico registrado correctamente.',
            cantidad_documentada,
            cantidad_fisica,
            diferencia,
            tipo_diferencia
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al registrar el conteo físico.' });
    }
};

// Obtener todos los conteos físicos
export const obtenerConteosFisicos = async (req, res) => {
    try {
        const [conteosFisicos] = await db.query(`SELECT * FROM conteos_fisicos`);
        res.status(200).json(conteosFisicos);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener los conteos físicos.' });
    }
};

// Obtener un conteo físico por producto
export const obtenerConteoPorProducto = async (req, res) => {
    const { producto_id } = req.params;
    try {
        const [conteo] = await db.query(`SELECT * FROM conteos_fisicos WHERE producto_id = ?`, [producto_id]);
        if (conteo.length === 0) {
            return res.status(404).json({ message: 'No se encontraron conteos físicos para este producto.' });
        }
        res.status(200).json(conteo);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener el conteo físico del producto.' });
    }
};
