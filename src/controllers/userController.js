import UserService from '../services/userService.js';
import { validationResult } from 'express-validator';

export default class UserController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userData = req.body;
      const user = await UserService.register(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error en el registro', error: error.message });
    }
  }

  static async login(req, res) {
    try {
      console.log('Login attempt:', {
        email: req.body.email,
        timestamp: new Date().toISOString()
      });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      const result = await UserService.login(email, password);
      
      console.log('Login successful:', {
        email,
        userId: result.user.id,
        timestamp: new Date().toISOString()
      });

      return res.json(result);
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ message: error.message });
      }

      return res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await UserService.getProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
    }
  }

  static async getAppointments(req, res) {
    try {
      const userId = req.user.id;
      const appointments = await UserService.getAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({ message: 'Error al obtener las citas', error: error.message });
    }
  }
}

