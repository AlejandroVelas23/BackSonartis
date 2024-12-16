import jwt from 'jsonwebtoken';
import { promisify } from 'util';


export const authMiddleware = async (req, res, next) => {
  try {
    // Verificar si existe el token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verificar el token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Verificar si el token ha expirado
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const isNutritionist = (req, res, next) => {
  if (!req.user.is_nutritionist) {
    return res.status(403).json({ message: 'Access denied. Nutritionist only.' });
  }
  next();
};

