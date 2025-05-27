import { getSupabaseServerClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

export type TipoDiagnostico = Database["public"]["Tables"]["tipos_diagnostico_config"]["Row"]
export type Pregunta = Database["public"]["Tables"]["preguntas"]["Row"]

/**
 * Servicio para gestionar los tipos de diagnóstico y sus características
 */
export async function getTiposDiagnostico() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("tipos_diagnostico_config")
      .select("*")
      .order("nivel_max_preguntas", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener tipos de diagnóstico:", error)
    return { success: false, error }
  }
}

/**
 * Obtiene un tipo de diagnóstico específico por su ID
 */
export async function getTipoDiagnosticoById(id: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase.from("tipos_diagnostico_config").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener tipo de diagnóstico:", error)
    return { success: false, error }
  }
}

/**
 * Obtiene el tipo de diagnóstico asociado a una evaluación
 */
export async function getTipoDiagnosticoByEvaluationId(evaluationId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { data: evaluation, error: evalError } = await supabase
      .from("evaluations")
      .select("tipo_diagnostico_id")
      .eq("id", evaluationId)
      .single()

    if (evalError) throw evalError

    if (!evaluation?.tipo_diagnostico_id) {
      // Si no tiene tipo asignado, asumimos el básico (nivel 1)
      const { data: basicType, error: basicError } = await supabase
        .from("tipos_diagnostico_config")
        .select("*")
        .eq("nivel_max_preguntas", 1)
        .single()

      if (basicError) throw basicError

      return { success: true, data: basicType }
    }

    const { data, error } = await supabase
      .from("tipos_diagnostico_config")
      .select("*")
      .eq("id", evaluation.tipo_diagnostico_id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener tipo de diagnóstico de la evaluación:", error)
    return { success: false, error }
  }
}

/**
 * Verifica si una característica específica está disponible para una evaluación
 */
export async function checkFeatureAvailability(
  evaluationId: string,
  feature: "pdf_detallado" | "comparativa_industria" | "recomendaciones_personalizadas",
) {
  try {
    const result = await getTipoDiagnosticoByEvaluationId(evaluationId)

    if (!result.success || !result.data) {
      return { success: false, available: false }
    }

    const tipoDiagnostico = result.data

    let isAvailable = false

    switch (feature) {
      case "pdf_detallado":
        isAvailable = tipoDiagnostico.permite_pdf_detallado
        break
      case "comparativa_industria":
        isAvailable = tipoDiagnostico.permite_comparativa_industria
        break
      case "recomendaciones_personalizadas":
        isAvailable = tipoDiagnostico.permite_recomendaciones_personalizadas
        break
    }

    return { success: true, available: isAvailable }
  } catch (error) {
    console.error(`Error al verificar disponibilidad de característica ${feature}:`, error)
    return { success: false, available: false, error }
  }
}

/**
 * Asigna un tipo de diagnóstico a una evaluación existente
 */
export async function assignTipoDiagnosticoToEvaluation(evaluationId: string, tipoDiagnosticoId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("evaluations")
      .update({ tipo_diagnostico_id: tipoDiagnosticoId })
      .eq("id", evaluationId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error al asignar tipo de diagnóstico:", error)
    return { success: false, error }
  }
}
