import { NextResponse } from "next/server"
import { getTiposDiagnostico } from "@/services/subscription-service"

export async function GET() {
  try {
    const result = await getTiposDiagnostico()

    if (!result.success) {
      return NextResponse.json({ error: "Error al obtener tipos de diagnóstico" }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error en API tipos-diagnostico:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
