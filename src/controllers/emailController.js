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
      from: 'velasquito2333@gmail.com',
      to: 'info@sonartsis.com.mx',
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