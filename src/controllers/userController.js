import UserService from '../services/userService.js';
import { validationResult } from 'express-validator';

export default class UserController {
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
}

