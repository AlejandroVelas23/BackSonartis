import pool from '../config/database.js';

export const appointmentController = {
  async createAppointment(req, res, next) {
    const { user_id, nutritionist_id, appointment_date, start_time, end_time } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO appointments (user_id, nutritionist_id, appointment_date, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [user_id, nutritionist_id, appointment_date, start_time, end_time, 'scheduled']
      );
      res.status(201).json({ message: 'Cita creada exitosamente', appointment: result.rows[0] });
    } catch (error) {
      next(error);
    }
  },

  async getUserAppointments(req, res, next) {
    const userId = req.user.id;
    try {
      const result = await pool.query(
        'SELECT appointments.*, users.first_name, users.last_name FROM appointments JOIN users ON appointments.nutritionist_id = users.id WHERE appointments.user_id = $1',
        [userId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  async getNutritionistAppointments(req, res, next) {
    const nutritionistId = req.user.id;
    try {
      const result = await pool.query(
        'SELECT appointments.*, users.first_name, users.last_name FROM appointments JOIN users ON appointments.user_id = users.id WHERE appointments.nutritionist_id = $1',
        [nutritionistId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  async updateAppointmentStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const result = await pool.query(
        'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
      res.status(200).json({ message: 'Estado de la cita actualizado exitosamente', appointment: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
};

