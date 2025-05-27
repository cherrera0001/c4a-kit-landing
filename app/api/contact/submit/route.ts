import { type NextRequest, NextResponse } from "next/server"
import { ContactService } from "@/services/contact-service"
import type { ContactFormValues } from "@/types/forms"

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as ContactFormValues

    // Validación básica
    if (!data.first_name || !data.last_name || !data.email || !data.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Todos los campos son obligatorios",
        },
        { status: 400 },
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "El formato del email no es válido",
        },
        { status: 400 },
      )
    }

    // Validar longitud del mensaje
    if (data.message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "El mensaje debe tener al menos 10 caracteres",
        },
        { status: 400 },
      )
    }

    // Guardar mensaje en la base de datos
    const messageId = await ContactService.saveContactMessage(data)

    // Intentar enviar email de notificación (opcional)
    let emailSent = false
    try {
      const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          company: data.company,
          subject: "Nuevo mensaje de contacto",
          message: data.message,
        }),
      })

      emailSent = emailResponse.ok
    } catch (emailError) {
      console.error("Error al enviar email de notificación:", emailError)
      // No interrumpimos el flujo por un error de email
    }

    return NextResponse.json({
      success: true,
      messageId,
      emailSent,
      message: "Mensaje enviado correctamente",
    })
  } catch (error: any) {
    console.error("Error al procesar formulario de contacto:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al procesar el formulario de contacto",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar si el usuario tiene permisos para ver los mensajes
    // Aquí deberías implementar tu lógica de autenticación

    const messages = await ContactService.getAllContactMessages()

    return NextResponse.json({
      success: true,
      data: messages,
    })
  } catch (error: any) {
    console.error("Error al obtener mensajes de contacto:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al obtener los mensajes de contacto",
      },
      { status: 500 },
    )
  }
}
