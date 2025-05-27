import { type NextRequest, NextResponse } from "next/server"
import { preparePdfData } from "@/services/pdf-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const evaluationId = params.id

    if (!evaluationId) {
      return NextResponse.json({ error: "ID de evaluación no proporcionado" }, { status: 400 })
    }

    // Preparar los datos para el PDF
    const pdfData = await preparePdfData(evaluationId)

    return NextResponse.json(pdfData)
  } catch (error) {
    console.error("Error al generar datos para PDF:", error)
    return NextResponse.json({ error: "Error al generar datos para PDF" }, { status: 500 })
  }
}
