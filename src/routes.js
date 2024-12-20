import express from 'express';
import { userController } from './controllers/userController.js';
import { nutritionistController } from './controllers/nutritionistController.js';
import { appointmentController } from './controllers/appointmentController.js';
import { paymentController } from './controllers/paymentController.js';
import { authenticateToken, authenticateRole } from './middlewares/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas
router.use(authenticateToken);

// Rutas de usuario
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Rutas de nutricionista
router.get('/nutritionists', nutritionistController.getAllNutritionists);
router.get('/nutritionists/:id', nutritionistController.getNutritionistById);
router.put('/nutritionists/:id/availability', authenticateRole(['nutritionist', 'admin']), nutritionistController.updateAvailability);

// Rutas de citas
router.post('/appointments', appointmentController.createAppointment);
router.get('/user/appointments', appointmentController.getUserAppointments);
router.get('/nutritionist/appointments', authenticateRole(['nutritionist', 'admin']), appointmentController.getNutritionistAppointments);
router.put('/appointments/:id/status', authenticateRole(['nutritionist', 'admin']), appointmentController.updateAppointmentStatus);

// Rutas de pagos
router.post('/payments', paymentController.createPayment);
router.get('/user/payments', paymentController.getUserPayments);
router.put('/payments/:id/status', authenticateRole(['nutritionist', 'admin']), paymentController.updatePaymentStatus);

// Rutas de administrador
router.get('/admin/users', authenticateRole(['admin']), userController.getAllUsers);
router.put('/admin/users/:id', authenticateRole(['admin']), userController.updateUser);
router.delete('/admin/users/:id', authenticateRole(['admin']), userController.deleteUser);

export default router;

