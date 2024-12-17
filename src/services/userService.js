import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export default class UserService {
  static async register(userData) {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await UserModel.create(userData);
    return { ...user, password: undefined };
  }

  static async login(email, password) {
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        console.log('User not found:', email);
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        throw new Error('Invalid credentials');
      }

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        console.error('JWT_SECRET is not defined in environment variables');
        throw new Error('JWT secret is not defined');
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          is_nutritionist: user.is_nutritionist 
        },
        secretKey,
        { expiresIn: '24h' }
      );

      return { token, user: { ...user, password: undefined } };
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  }

  static async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user, password: undefined };
  }

  static async getAppointments(userId) {
    return await UserModel.getAppointments(userId);
  }
}

