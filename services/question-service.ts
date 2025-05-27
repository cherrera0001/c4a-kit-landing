import { getSupabaseServerClient } from "@/lib/supabase"
import { getTipoDiagnosticoByEvaluationId } from "./subscription-service"

/**
 * Obtiene preguntas filtradas por dominio y nivel de diagnóstico según el plan de la evaluación
 */
export async function getQuestionsByDomainAndEvaluation(domainId: string, evaluationId: string) {
  try {
    // Primero obtenemos el tipo de diagnóstico de la evaluación
    const tipoResult = await getTipoDiagnosticoByEvaluationId(evaluationId)

    if (!tipoResult.success || !tipoResult.data) {
      throw new Error("No se pudo obtener el tipo de diagnóstico de la evaluación")
    }

    const nivelMaxPreguntas = tipoResult.data.nivel_max_preguntas

    const supabase = await getSupabaseServerClient()

    // Obtenemos las preguntas filtradas por dominio y nivel de diagnóstico
    const { data, error } = await supabase
      .from("preguntas")
      .select(`
        *,
        opciones_respuesta(*)
      `)
      .eq("dominio_id", domainId)
      .lte("nivel_diagnostico", nivelMaxPreguntas) // Solo preguntas hasta el nivel permitido
      .eq("activa", true)
      .order("orden", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener preguntas por dominio y evaluación:", error)
    return { success: false, error }
  }
}

/**
 * Obtiene todas las preguntas para una evaluación, filtradas por el nivel de diagnóstico
 */
export async function getAllQuestionsForEvaluation(evaluationId: string) {
  try {
    // Primero obtenemos el tipo de diagnóstico de la evaluación
    const tipoResult = await getTipoDiagnosticoByEvaluationId(evaluationId)

    if (!tipoResult.success || !tipoResult.data) {
      throw new Error("No se pudo obtener el tipo de diagnóstico de la evaluación")
    }

    const nivelMaxPreguntas = tipoResult.data.nivel_max_preguntas

    const supabase = await getSupabaseServerClient()

    // Obtenemos todas las preguntas filtradas por nivel de diagnóstico
    const { data, error } = await supabase
      .from("preguntas")
      .select(`
        *,
        dominios_evaluacion:dominio_id(id, nombre)
      `)
      .lte("nivel_diagnostico", nivelMaxPreguntas) // Solo preguntas hasta el nivel permitido
      .eq("activa", true)
      .order("orden", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener todas las preguntas para la evaluación:", error)
    return { success: false, error }
  }
}

/**
 * Cuenta el número total de preguntas disponibles para una evaluación
 */
export async function countQuestionsForEvaluation(evaluationId: string) {
  try {
    const tipoResult = await getTipoDiagnosticoByEvaluationId(evaluationId)

    if (!tipoResult.success || !tipoResult.data) {
      throw new Error("No se pudo obtener el tipo de diagnóstico de la evaluación")
    }

    const nivelMaxPreguntas = tipoResult.data.nivel_max_preguntas

    const supabase = await getSupabaseServerClient()

    const { count, error } = await supabase
      .from("preguntas")
      .select("*", { count: "exact", head: true })
      .lte("nivel_diagnostico", nivelMaxPreguntas)
      .eq("activa", true)

    if (error) throw error

    return { success: true, count }
  } catch (error) {
    console.error("Error al contar preguntas para la evaluación:", error)
    return { success: false, error }
  }
}
