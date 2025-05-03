import db from '../config/db.js';

export const crearColaborador = async (req, res) => {
  const { nombre_completo, cedula } = req.body;

  if (!nombre_completo || !cedula)
    return res.status(400).json({ message: 'Nombre completo y cédula son obligatorios' });

  try {
    const [resultado] = await db.query(
      'INSERT INTO colaboradores (nombre_completo, cedula) VALUES (?, ?)',
      [nombre_completo, cedula]
    );
    res.status(201).json({ message: 'Colaborador creado', colaborador_id: resultado.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el colaborador' });
  }
};

export const obtenerColaboradores = async (req, res) => {
  try {
    const [colaboradores] = await db.query('SELECT * FROM colaboradores');
    res.json(colaboradores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los colaboradores' });
  }
};
