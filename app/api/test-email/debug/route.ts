import { NextResponse } from "next/server"

// Función simulada para entorno de vista previa
export async function GET(request: Request) {
  // Simulamos un pequeño retraso para que parezca que estamos haciendo algo
  await new Promise((resolve) => setTimeout(resolve, 1800))

  try {
    // En un entorno real, aquí se conectaría al servidor SMTP con modo debug
    console.log("Simulando conexión a smtp.zoho.com:587 (Debug)...")

    // Simulamos información de depuración
    const debugInfo = {
      connection: {
        id: "simulado-connection-id",
        status: "connected",
        secure: false,
      },
      authentication: {
        method: "LOGIN",
        user: "notificaciones@c4a.cl",
        status: "authenticated",
      },
      commands: [
        { command: "EHLO", response: "250-smtp.zoho.com" },
        { command: "STARTTLS", response: "220 Ready to start TLS" },
        { command: "AUTH LOGIN", response: "235 Authentication successful" },
      ],
    }

    // Devolvemos una respuesta simulada con información de depuración
    return NextResponse.json({
      success: true,
      messageId: "<simulado-debug-123456@zoho.com>",
      message: "Simulación de email con debug completada (entorno de vista previa)",
      debugInfo: debugInfo,
      note: "Esta es una simulación. En un entorno real, se mostraría información de depuración real.",
    })
  } catch (error: any) {
    console.error("Error simulado:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error simulado en entorno de vista previa (Debug)",
        debugInfo: {
          lastCommand: "AUTH LOGIN",
          response: "535 Authentication failed",
          error: "Invalid username or password",
        },
        note: "Esta es una simulación. En un entorno real, se mostraría información de depuración real del error.",
      },
      { status: 500 },
    )
  }
}
