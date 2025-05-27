import { getSupabaseServerClient } from "@/lib/supabase"
import { getSupabaseClient } from "@/lib/supabase"

// Servicio para probar las políticas RLS
export const RlsTestService = {
  // Función para establecer el ID del usuario actual (para pruebas)
  async setCurrentUserId(userId: string) {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.rpc("set_current_user_id", { user_id: userId })

    if (error) {
      console.error("Error al establecer el ID del usuario:", error)
      throw error
    }

    return data
  },

  // Función para verificar si el usuario actual es administrador
  async checkIsAdmin() {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.rpc("is_admin")

    if (error) {
      console.error("Error al verificar si es administrador:", error)
      return false
    }

    return data
  },

  // Función para probar el acceso a evaluaciones
  async testEvaluationsAccess() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("evaluations").select("*").limit(5)

    return {
      success: !error,
      data,
      error: error ? error.message : null,
    }
  },

  // Función para probar el acceso a empresas
  async testCompaniesAccess() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("companies").select("*").limit(5)

    return {
      success: !error,
      data,
      error: error ? error.message : null,
    }
  },

  // Función para probar las funciones del dashboard
  async testDashboardFunctions() {
    const supabase = await getSupabaseServerClient()

    // Obtener estadísticas del dashboard
    const { data: stats, error: statsError } = await supabase.rpc("get_dashboard_stats")

    // Obtener distribución de madurez
    const { data: distribution, error: distError } = await supabase.rpc("get_maturity_distribution")

    return {
      success: !statsError && !distError,
      stats,
      distribution,
      error: statsError ? statsError.message : distError ? distError.message : null,
    }
  },
}
