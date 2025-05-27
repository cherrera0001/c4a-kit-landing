import { type NextRequest, NextResponse } from "next/server"
import { checkQuestionExists } from "@/services/question-validation-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar que se proporcione el texto de la pregunta
    if (!body.text) {
      return NextResponse.json({ error: "El texto de la pregunta es requerido" }, { status: 400 })
    }

    // Verificar si la pregunta ya existe
    const result = await checkQuestionExists(body.text, body.domain_id)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error al validar pregunta:", error)
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 })
  }
}
