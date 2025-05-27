import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"
import { logSessionEvent, type SessionEventType } from "@/services/session-log-service"

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario está autenticado
    const supabase = getSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await request.json()
    const { event_type, event_reason } = body

    if (!event_type) {
      return NextResponse.json({ error: "Tipo de evento inválido" }, { status: 400 })
    }

    // Obtener información adicional de la solicitud
    const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const user_agent = request.headers.get("user-agent") || "unknown"

    // Registrar el evento
    const result = await logSessionEvent({
      user_id: session.user.id,
      event_type: event_type as SessionEventType,
      event_reason,
      ip_address: ip_address.toString(),
      user_agent,
    })

    if (!result.success) {
      return NextResponse.json({ error: "Error al registrar el evento" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error en session-log API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
