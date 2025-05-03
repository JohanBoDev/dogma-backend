import db from '../config/db.js';

export const crearEstacion = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });

  try {
    const [resultado] = await db.query('INSERT INTO estaciones (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ message: 'Estación creada', estacion_id: resultado.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la estación' });
  }
};

export const obtenerEstaciones = async (req, res) => {
  try {
    const [estaciones] = await db.query('SELECT * FROM estaciones');
    res.status(200).json(estaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las estaciones' });
  }
};
