import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://sonartis.vercel.app',
  credentials: true
}));

app.use(helmet());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/api/send-email', async (req, res) => {
  const { name, lastName, email, phone, message } = req.body;

  const mailOptions = {
    from: 'velasquito2333@gmail.com',
    to: 'info@sonartis.com.mx',
    subject: 'Nuevo mensaje de contacto',
    text: `
      Yo: ${name} ${lastName}
      con correo: ${email}
      y celular: ${phone}
      le comunico: ${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});


// Add unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

