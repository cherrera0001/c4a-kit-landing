import { type NextRequest, NextResponse } from "next/server"
import { checkFeatureAvailability } from "@/services/subscription-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const evaluationId = searchParams.get("evaluationId")
    const feature = searchParams.get("feature") as
      | "pdf_detallado"
      | "comparativa_industria"
      | "recomendaciones_personalizadas"

    if (!evaluationId || !feature) {
      return NextResponse.json({ error: "Se requieren los parámetros evaluationId y feature" }, { status: 400 })
    }

    // Validar que el feature sea uno de los permitidos
    if (!["pdf_detallado", "comparativa_industria", "recomendaciones_personalizadas"].includes(feature)) {
      return NextResponse.json({ error: "Característica no válida" }, { status: 400 })
    }

    const result = await checkFeatureAvailability(evaluationId, feature)

    if (!result.success) {
      return NextResponse.json({ error: "Error al verificar disponibilidad de característica" }, { status: 500 })
    }

    return NextResponse.json({ available: result.available })
  } catch (error) {
    console.error("Error en API check-feature:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
