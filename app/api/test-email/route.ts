import { NextResponse } from "next/server"

// Función simulada para entorno de vista previa
export async function GET(request: Request) {
  // Simulamos un pequeño retraso para que parezca que estamos haciendo algo
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // En un entorno real, aquí se conectaría al servidor SMTP
    console.log("Simulando conexión a smtp.zoho.com:587...")

    // Devolvemos una respuesta simulada
    return NextResponse.json({
      success: true,
      messageId: "<simulado-123456@zoho.com>",
      message: "Simulación de email completada (entorno de vista previa)",
      note: "Esta es una simulación. En un entorno real, se conectaría al servidor SMTP.",
    })
  } catch (error: any) {
    console.error("Error simulado:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error simulado en entorno de vista previa",
        note: "Esta es una simulación. En un entorno real, se mostraría el error específico.",
      },
      { status: 500 },
    )
  }
}
