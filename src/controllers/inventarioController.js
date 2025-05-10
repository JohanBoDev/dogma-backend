import db from '../config/db.js';

export const consultarHistorialProducto = async (req, res) => {
    const { codigoProducto } = req.params;

    try {
        // 1️⃣ Obtener información del producto
        const [producto] = await db.query(`
            SELECT * FROM productos WHERE codigo = ?
        `, [codigoProducto]);

        if (producto.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // 2️⃣ Obtener entradas del producto
        const [entradas] = await db.query(`
            SELECT e.*, p.nombre AS planta, c.nombre_completo AS colaborador 
            FROM entradas e 
            LEFT JOIN planta p ON e.planta_id = p.id
            LEFT JOIN colaboradores c ON e.colaborador_id = c.id
            WHERE e.producto_id = ?
            ORDER BY e.fecha_ingreso DESC
        `, [producto[0].id]);

        // 3️⃣ Obtener despachos del producto
        const [despachos] = await db.query(`
            SELECT d.*, e.nombre AS estacion, c.nombre_completo AS colaborador 
            FROM despachos d 
            LEFT JOIN estaciones e ON d.estacion_id = e.id
            LEFT JOIN colaboradores c ON d.lider_id = c.id
            WHERE d.producto_id = ?
            ORDER BY d.fecha_despacho DESC
        `, [producto[0].id]);

        // 4️⃣ Obtener devoluciones del producto
        const [devoluciones] = await db.query(`
            SELECT d.*, c.nombre_completo AS colaborador 
            FROM devoluciones d 
            LEFT JOIN colaboradores c ON d.colaborador_id = c.id
            WHERE d.producto_id = ?
            ORDER BY d.fecha_retorno DESC
        `, [producto[0].id]);

        // 5️⃣ Obtener productos dañados
        const [danados] = await db.query(`
            SELECT p.*, c.nombre_completo AS colaborador 
            FROM productos_danados p
            LEFT JOIN colaboradores c ON p.colaborador_id = c.id
            WHERE p.producto_id = ?
            ORDER BY p.fecha_registro DESC
        `, [producto[0].id]);

        // 6️⃣ Obtener conteos físicos
        const [conteosFisicos] = await db.query(`
            SELECT c.*, l.nombre_completo AS lider
            FROM conteos_fisicos c
            LEFT JOIN colaboradores l ON c.lider_id = l.id
            WHERE c.producto_id = ?
            ORDER BY c.fecha_conteo DESC
        `, [producto[0].id]);

        // 7️⃣ Unificar movimientos para ordenar cronológicamente
        const movimientos = [
            ...entradas.map(e => ({ tipo: 'Entrada', fecha: e.fecha_ingreso, detalle: e })),
            ...despachos.map(d => ({ tipo: 'Despacho', fecha: d.fecha_despacho, detalle: d })),
            ...devoluciones.map(d => ({ tipo: 'Devolución', fecha: d.fecha_retorno, detalle: d })),
            ...danados.map(d => ({ tipo: 'Producto Dañado', fecha: d.fecha_registro, detalle: d })),
            ...conteosFisicos.map(c => ({ tipo: 'Conteo Físico', fecha: c.fecha_conteo, detalle: c }))
        ];

        movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // 8️⃣ Resumen rápido:
        const resumen = {
            total_despachado: despachos.reduce((acc, cur) => acc + cur.cantidad, 0),
            total_devuelto: devoluciones.reduce((acc, cur) => acc + cur.cantidad, 0),
            total_danado: danados.reduce((acc, cur) => acc + cur.cantidad, 0),
            ultimo_movimiento: movimientos[0] ? movimientos[0].tipo : 'No hay movimientos registrados'
        };

        // 9️⃣ Respuesta estructurada
        const historialCompleto = {
            producto: producto[0],
            entradas,
            despachos,
            devoluciones,
            productos_danados: danados,
            conteos_fisicos: conteosFisicos,
            movimientos_ordenados: movimientos,
            resumen
        };

        return res.status(200).json(historialCompleto);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al consultar el historial del producto' });
    }
};
