import { type NextRequest, NextResponse } from "next/server"
import { getTipoDiagnosticoByEvaluationId } from "@/services/subscription-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const evaluationId = searchParams.get("evaluationId")

    if (!evaluationId) {
      return NextResponse.json({ error: "Se requiere el parámetro evaluationId" }, { status: 400 })
    }

    const result = await getTipoDiagnosticoByEvaluationId(evaluationId)

    if (!result.success || !result.data) {
      return NextResponse.json({ error: "Error al obtener información del plan" }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error en API plan-info:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
