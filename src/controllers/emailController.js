import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (req, res) => {
  try {
    const { name, lastName, email, phone, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@sonartis.com.mx',
      subject: 'Nuevo mensaje de contacto',
      text: `
        Nombre: ${name} ${lastName}
        Correo: ${email}
        Teléfono: ${phone}
        Mensaje: ${message}
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el email:', error);
    res.status(500).json({ message: 'Error al enviar el email', error: error.message });
  }
};