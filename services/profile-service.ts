import { getSupabaseClient } from "@/lib/supabase"
// Corrected import to use roleIdToUUID
import { roleIdToUUID } from "@/lib/constants" // Corrected import [cite: uploaded:landingpage-c4a/services/profile-service.ts, uploaded:landingpage-c4a/lib/constants.ts]
import { validateCorporateEmail } from "@/lib/email-validator"

/**
 * Servicio para gestionar perfiles de usuario
 */
export async function createUserProfile(userId: string, roleIdNumber = 2) {
  const supabase = getSupabaseClient()
  // Convertir el número de rol a UUID using the correct function
  const roleId = roleIdToUUID(roleIdNumber) // Corrected function call

  try {
    console.log(`[PROFILE_SERVICE] Intentando crear perfil para usuario: ${userId} con rol: ${roleId}`)

    // Verificar si el perfil ya existe
    const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("id", userId).maybeSingle()

    if (existingProfile) {
      console.log(`[PROFILE_SERVICE] El perfil ya existe para el usuario: ${userId}`)
      return { success: true, message: "El perfil ya existe" }
    }

    // Intento 1: Insertar con todos los campos
    const { error: error1 } = await supabase.from("user_profiles").insert({
      id: userId,
      role_id: roleId, // Ahora usando UUID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (!error1) {
      console.log("[PROFILE_SERVICE] Perfil creado exitosamente (método 1)")
      return { success: true }
    }

    console.warn("[PROFILE_SERVICE] Error en método 1:", error1.message)

    // Intento 2: Insertar solo los campos mínimos
    const { error: error2 } = await supabase.from("user_profiles").insert({
      id: userId,
      role_id: roleId, // Ahora usando UUID
    })

    if (!error2) {
      console.log("[PROFILE_SERVICE] Perfil creado exitosamente (método 2)")
      return { success: true }
    }

    console.error("[PROFILE_SERVICE] Error en método 2:", error2.message)

    // Verificar si el perfil se creó a pesar de los errores
    const { data: checkProfile } = await supabase.from("user_profiles").select("id").eq("id", userId).maybeSingle()

    if (checkProfile) {
      console.log("[PROFILE_SERVICE] Verificación: Perfil existe a pesar de errores reportados")
      return { success: true, message: "Perfil encontrado en verificación final" }
    }

    return {
      success: false,
      error: "No se pudo crear el perfil después de múltiples intentos",
    }
  } catch (error) {
    console.error("[PROFILE_SERVICE] Error al crear perfil:", error)
    return {
      success: false,
      error: "Error inesperado al crear perfil",
    }
  }
}

/**
 * Obtiene el perfil de un usuario por su ID
 */
export async function getUserProfile(userId: string) {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.from("user_profiles").select("*, roles(name)").eq("id", userId).maybeSingle() // Ensure roles are selected

    if (error) throw error

    // Check if profile was found
    if (!data) {
        return { success: true, profile: null, error: "Perfil no encontrado" };
    }

    return { success: true, profile: data }
  } catch (error) {
    console.error("[PROFILE_SERVICE] Error al obtener perfil:", error)
    return { success: false, error: "Error al obtener perfil de usuario" }
  }
}

/**
 * Actualiza el perfil de un usuario
 */
export async function updateUserProfile(userId: string, profileData: any) {
  const supabase = getSupabaseClient()

  try {
    const { error } = await supabase
      .from("user_profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("[PROFILE_SERVICE] Error al actualizar perfil:", error)
    return { success: false, error: "Error al actualizar perfil de usuario" }
  }
}
