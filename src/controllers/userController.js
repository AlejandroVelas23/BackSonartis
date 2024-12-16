import UserService from '../services/userService.js';
import { validationResult } from 'express-validator';

export default class UserController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await UserService.register(req.body);
      res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
      if (error.message === 'Email already registered') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Error en el registro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      console.error('Error en el login:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserService.getProfile(req.user.id);
      res.json(user);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getAppointments(req, res) {
    try {
      const appointments = await UserService.getAppointments(req.user.id);
      res.json(appointments);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

