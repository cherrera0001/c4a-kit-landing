import { type NextRequest, NextResponse } from "next/server"
import { generatePdfBlob } from "@/services/pdf-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const evaluationId = params.id

    if (!evaluationId) {
      return NextResponse.json({ error: "ID de evaluación no proporcionado" }, { status: 400 })
    }

    // Generar el PDF como blob
    const pdfBlob = await generatePdfBlob(evaluationId)

    // Configurar los headers para la descarga
    const headers = new Headers()
    headers.set("Content-Type", "application/pdf")
    headers.set("Content-Disposition", `attachment; filename="evaluacion-${evaluationId}.pdf"`)

    return new NextResponse(pdfBlob, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error al generar PDF para descargar:", error)
    return NextResponse.json({ error: "Error al generar PDF para descargar" }, { status: 500 })
  }
}
