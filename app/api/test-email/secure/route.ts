import { NextResponse } from "next/server"

// Función simulada para entorno de vista previa
export async function GET(request: Request) {
  // Simulamos un pequeño retraso para que parezca que estamos haciendo algo
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // En un entorno real, aquí se conectaría al servidor SMTP con SSL
    console.log("Simulando conexión a smtp.zoho.com:465 (SSL)...")

    // Devolvemos una respuesta simulada
    return NextResponse.json({
      success: true,
      messageId: "<simulado-ssl-123456@zoho.com>",
      message: "Simulación de email SSL completada (entorno de vista previa)",
      note: "Esta es una simulación. En un entorno real, se conectaría al servidor SMTP con SSL.",
    })
  } catch (error: any) {
    console.error("Error simulado:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error simulado en entorno de vista previa (SSL)",
        note: "Esta es una simulación. En un entorno real, se mostraría el error específico.",
      },
      { status: 500 },
    )
  }
}
