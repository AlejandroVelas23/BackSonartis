import pool from '../config/database.js';

export const paymentController = {
  async createPayment(req, res, next) {
    const { appointment_id, amount, payment_method } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO payments (appointment_id, amount, status, payment_date, payment_method) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [appointment_id, amount, 'paid', new Date(), payment_method]
      );
      res.status(201).json({ message: 'Pago registrado exitosamente', payment: result.rows[0] });
    } catch (error) {
      next(error);
    }
  },

  async getUserPayments(req, res, next) {
    const userId = req.user.id;
    try {
      const result = await pool.query(
        'SELECT payments.*, appointments.appointment_date, users.first_name, users.last_name FROM payments JOIN appointments ON payments.appointment_id = appointments.id JOIN users ON appointments.nutritionist_id = users.id WHERE appointments.user_id = $1',
        [userId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  async updatePaymentStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const result = await pool.query(
        'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }
      res.status(200).json({ message: 'Estado del pago actualizado exitosamente', payment: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
};

