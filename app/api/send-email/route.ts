import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { serverEnv } from "@/lib/env"

// Configurar el transporter de Nodemailer con las credenciales SMTP
const transporter = nodemailer.createTransport({
  host: serverEnv.SMTP_HOST,
  port: Number.parseInt(serverEnv.SMTP_PORT || "587"),
  secure: serverEnv.SMTP_SECURE === "true",
  auth: {
    user: serverEnv.SMTP_USER,
    pass: serverEnv.SMTP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { name, email, subject, message, company } = await req.json()

    // Validar campos requeridos
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nombre, email y mensaje son campos obligatorios" }, { status: 400 })
    }

    // Configurar opciones del email
    const mailOptions = {
      from: `"${serverEnv.SMTP_FROM_NAME}" <${serverEnv.SMTP_FROM_EMAIL}>`,
      to: serverEnv.SMTP_TO_EMAIL,
      replyTo: email,
      subject: subject || `Nuevo mensaje de contacto de ${name}`,
      text: `
Nombre: ${name}
Email: ${email}
${company ? `Empresa: ${company}` : ""}

Mensaje:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #e11d48;">Nuevo mensaje de contacto</h2>
  <p><strong>Nombre:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ""}
  <div style="margin-top: 20px;">
    <h3 style="color: #333;">Mensaje:</h3>
    <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, "<br>")}</p>
  </div>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
    <p>Este mensaje fue enviado desde el formulario de contacto en c4a.cl</p>
  </div>
</div>
      `,
    }

    // Enviar el email
    await transporter.sendMail(mailOptions)

    // Guardar el mensaje en la base de datos (opcional)
    // Esto ya lo tenemos implementado en ContactService

    return NextResponse.json({
      success: true,
      message: "Email enviado correctamente",
    })
  } catch (error) {
    console.error("Error al enviar email:", error)
    return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 })
  }
}
