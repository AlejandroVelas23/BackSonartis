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
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2D89EF; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">SONARTIS</h1>
          <p style="margin: 0;">Nuevo mensaje de contacto</p>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px;">¡Hola equipo de SONARTIS!</p>
          <p style="font-size: 16px;">Mi nombre es <strong>${name} ${lastName}</strong>, y quisiera ponerme en contacto con ustedes.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Mensaje:</strong></p>
          <blockquote style="background-color: #f9f9f9; border-left: 4px solid #2D89EF; padding: 10px 20px; margin: 0; font-style: italic;">
            ${message}
          </blockquote>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 14px; color: #555;">Espero su pronta respuesta. ¡Gracias por su atención!</p>
        </div>
        <div style="background-color: #f1f1f1; color: #555; padding: 10px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">SONARTIS | Innovación y Diseño</p>
        </div>
      </div>
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

