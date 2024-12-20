import pool from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

export const userController = {
  async register(req, res, next) {
    const { first_name, last_name, email, password, age } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, age, role_id) VALUES ($1, $2, $3, $4, $5, (SELECT id FROM roles WHERE name = $6)) RETURNING id, email',
        [first_name, last_name, email, hashedPassword, age, 'user']
      );

      const user = result.rows[0];
      const token = generateToken({ id: user.id, email: user.email, role: 'user' });

      res.status(201).json({ message: 'Usuario registrado exitosamente', user, token });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const result = await pool.query(
        'SELECT users.*, roles.name as role FROM users JOIN roles ON users.role_id = roles.id WHERE email = $1',
        [email]
      );

      const user = result.rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      res.status(200).json({ message: 'Inicio de sesión exitoso', user, token });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const result = await pool.query(
        'SELECT users.*, roles.name as role FROM users JOIN roles ON users.role_id = roles.id WHERE id = $1',
        [req.user.id]
      );
      const data = result.rows[0];
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    const { first_name, last_name, age } = req.body;

    try {
      const result = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, age = $3 WHERE id = $4 RETURNING *',
        [first_name, last_name, age, req.user.id]
      );
      const data = result.rows[0];
      res.status(200).json({ message: 'Perfil actualizado exitosamente', user: data });
    } catch (error) {
      next(error);
    }
  },

  // Nuevas funciones para el administrador
  async getAllUsers(req, res, next) {
    try {
      const result = await pool.query(
        'SELECT users.*, roles.name as role FROM users JOIN roles ON users.role_id = roles.id'
      );
      const data = result.rows;
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    const { id } = req.params;
    const { first_name, last_name, age, role_id } = req.body;

    try {
      const result = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, age = $3, role_id = $4 WHERE id = $5 RETURNING *',
        [first_name, last_name, age, role_id, id]
      );
      const data = result.rows[0];
      res.status(200).json({ message: 'Usuario actualizado exitosamente', user: data });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1',
        [id]
      );
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      next(error);
    }
  }
};

