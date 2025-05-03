import db from '../config/db.js';

export const crearPlanta = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });

  try {
    const [resultado] = await db.query('INSERT INTO planta (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ message: 'Planta creada', planta_id: resultado.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la planta' });
  }
};

export const obtenerPlantas = async (req, res) => {
  try {
    const [plantas] = await db.query('SELECT * FROM planta');
    res.json(plantas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las plantas' });
  }
};
