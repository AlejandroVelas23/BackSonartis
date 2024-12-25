import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, lastName, email, phone, message } = req.body

    // Configura el transporter de nodemailer
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER, // tu dirección de correo
        pass: process.env.EMAIL_PASS, // tu contraseña
      },
    });

    try {
      // Envía el correo
      await transporter.sendMail({
        from: `"Formulario de Contacto" <${process.env.EMAIL_USER}>`,
        to: "tucorreo@ejemplo.com", // dirección donde quieres recibir los mensajes
        subject: "Nuevo mensaje de contacto",
        text: `
          Nombre: ${name} ${lastName}
          Email: ${email}
          Teléfono: ${phone}
          Mensaje: ${message}
        `,
        html: `
          <h1>Nuevo mensaje de contacto</h1>
          <p><strong>Nombre:</strong> ${name} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        `,
      });

      res.status(200).json({ message: 'Email enviado con éxito' })
    } catch (error) {
      console.error('Error al enviar el email:', error)
      res.status(500).json({ error: 'Error al enviar el email' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
