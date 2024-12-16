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
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
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

