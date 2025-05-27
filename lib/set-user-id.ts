import { getSupabaseClient } from "@/lib/supabase"

/**
 * Establece el ID del usuario actual como variable de sesión en PostgreSQL
 * Esta función debe llamarse al iniciar una conexión con la base de datos
 */
export async function setCurrentUserId(userId: string | undefined) {
  try {
    if (!userId) return false

    const supabase = getSupabaseClient()

    // Establecer la variable de sesión con el ID del usuario
    const { error } = await supabase.rpc("set_current_user_id", {
      user_id: userId,
    })

    if (error) {
      console.error("Error al establecer el ID de usuario:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error al establecer el ID de usuario:", error)
    return false
  }
}
