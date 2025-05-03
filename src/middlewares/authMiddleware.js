import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_temporal';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // ← queda disponible como req.usuario en el controlador
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const verificarRol = (rolPermitido) => {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== rolPermitido) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
    }
    next();
  };
};
