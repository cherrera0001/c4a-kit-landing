import { createClient } from "@supabase/supabase-js"
import { isPreviewEnvironment } from "@/app/api/config"
import { clientEnv } from "@/lib/env"

// Tipos para los eventos de sesión
export type SessionEventType = "login" | "logout" | "register" | "token_refresh" | "password_reset" | "idle_timeout"

export interface SessionLogEvent {
  user_id: string
  event_type: SessionEventType
  event_reason?: string
  ip_address?: string
  user_agent?: string
}

/**
 * Registra un evento de sesión en la base de datos
 */
export async function logSessionEvent(event: SessionLogEvent) {
  // En modo vista previa, solo simulamos el registro
  if (isPreviewEnvironment()) {
    console.log(`[PREVIEW] Simulando registro de evento de sesión:`, event)
    return { success: true, data: { id: "preview-log-id" } }
  }

  try {
    // Crear cliente de Supabase para el servidor
    const supabaseUrl = process.env.SUPABASE_URL || clientEnv.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || clientEnv.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Faltan variables de entorno para Supabase")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Registrar el evento en la tabla session_logs
    const { data, error } = await supabase
      .from("session_logs")
      .insert({
        user_id: event.user_id,
        event_type: event.event_type,
        event_reason: event.event_reason || null,
        ip_address: event.ip_address || null,
        user_agent: event.user_agent || null,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error al registrar evento de sesión:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error en session-log-service:", error)
    // No lanzamos el error para evitar interrumpir el flujo principal
    return { success: false, error }
  }
}

/**
 * Obtiene los últimos eventos de sesión para un usuario
 */
export async function getUserSessionLogs(userId: string, limit = 10) {
  // En modo vista previa, devolvemos datos simulados
  if (isPreviewEnvironment()) {
    return {
      success: true,
      data: Array(limit)
        .fill(null)
        .map((_, i) => ({
          id: `preview-log-${i}`,
          user_id: userId,
          event_type: i % 2 === 0 ? "login" : "logout",
          event_reason: i % 2 === 0 ? "Inicio de sesión simulado" : "Cierre de sesión simulado",
          ip_address: "127.0.0.1",
          user_agent: "Mozilla/5.0 (Preview Browser)",
          created_at: new Date(Date.now() - i * 86400000).toISOString(), // Cada día hacia atrás
        })),
    }
  }

  try {
    // Crear cliente de Supabase para el servidor
    const supabaseUrl = process.env.SUPABASE_URL || clientEnv.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || clientEnv.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Faltan variables de entorno para Supabase")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Obtener los eventos de sesión
    const { data, error } = await supabase
      .from("session_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error al obtener eventos de sesión:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error en session-log-service:", error)
    return { success: false, error }
  }
}
