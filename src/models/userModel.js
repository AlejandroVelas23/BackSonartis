import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

export default class UserModel {
  static async create({ email, password, first_name, last_name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (email, password, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name
    `;
    
    const values = [email, hashedPassword, first_name, last_name];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAppointments(userId) {
    const query = `
      SELECT a.*, u.first_name as nutritionist_first_name, u.last_name as nutritionist_last_name
      FROM appointments a
      JOIN nutritionists n ON a.nutritionist_id = n.id
      JOIN users u ON n.user_id = u.id
      WHERE a.client_id = $1
      ORDER BY a.appointment_date DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

