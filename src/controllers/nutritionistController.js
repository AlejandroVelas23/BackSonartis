import pool from '../config/database.js';

export const nutritionistController = {
  async getAllNutritionists(req, res, next) {
    try {
      const result = await pool.query(
        'SELECT nutritionists.*, users.first_name, users.last_name, users.email FROM nutritionists JOIN users ON nutritionists.user_id = users.id'
      );
      res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  async getNutritionistById(req, res, next) {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'SELECT nutritionists.*, users.first_name, users.last_name, users.email FROM nutritionists JOIN users ON nutritionists.user_id = users.id WHERE nutritionists.id = $1',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Nutricionista no encontrado' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async updateAvailability(req, res, next) {
    const { id } = req.params;
    const { availability } = req.body;
    try {
      await pool.query('BEGIN');
      
      // Eliminar disponibilidad existente
      await pool.query('DELETE FROM availability WHERE nutritionist_id = $1', [id]);
      
      // Insertar nueva disponibilidad
      for (let avail of availability) {
        await pool.query(
          'INSERT INTO availability (nutritionist_id, day_of_week, start_time, end_time, is_available) VALUES ($1, $2, $3, $4, $5)',
          [id, avail.day_of_week, avail.start_time, avail.end_time, avail.is_available]
        );
      }
      
      await pool.query('COMMIT');
      
      res.status(200).json({ message: 'Disponibilidad actualizada exitosamente' });
    } catch (error) {
      await pool.query('ROLLBACK');
      next(error);
    }
  }
};

