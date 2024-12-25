import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, 
  logger: true
});

export const sendEmail = async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Credenciales de email no configuradas');
      }
    const { name, lastName, email, phone, message } = req.body;

    await transporter.verify();
    console.log('Servidor listo para enviar emails');

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

   console.log('Intentando enviar email con las siguientes credenciales:', {
      user: process.env.EMAIL_USER,
      passLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.response);
    
    res.status(200).json({ 
      message: 'Email enviado exitosamente',
      messageId: info.messageId 
    });
  }catch (error) {
    console.error('Error detallado al enviar el email:', error);
    res.status(500).json({ 
      message: 'Error al enviar el email', 
      error: error.message,
      details: error.stack
    });
  }
};