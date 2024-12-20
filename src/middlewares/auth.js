import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const authenticateRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (!roles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
};



