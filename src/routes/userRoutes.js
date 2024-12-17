import { Router } from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Validaciones para el registro
const registerValidations = [
  body('email').isEmail().withMessage('Ingrese un email válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('first_name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('last_name').trim().notEmpty().withMessage('El apellido es requerido')
];

// Validaciones para el login
const loginValidations = [
  body('email').isEmail().withMessage('Ingrese un email válido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Rutas públicas
router.post('/register', registerValidations, UserController.register);
router.post('/login', loginValidations, UserController.login);

// Rutas protegidas
router.use(authMiddleware);
router.get('/profile', UserController.getProfile);
router.get('/appointments', UserController.getAppointments);

export default router;

