import { getSupabaseServerClient } from "@/lib/supabase"
import { countQuestionsForEvaluation } from "./question-service"

/**
 * Crea una nueva evaluación con el tipo de diagnóstico especificado
 */
export async function createEvaluation(data: {
  name: string
  description?: string
  company_id: string
  created_by: string
  tipo_diagnostico_id: string
}) {
  try {
    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      throw new Error("No se pudo conectar con la base de datos")
    }

    // Validar datos de entrada
    if (!data.name || !data.company_id || !data.created_by || !data.tipo_diagnostico_id) {
      throw new Error("Faltan campos requeridos para crear la evaluación")
    }

    // Verificar que la empresa existe
    const { data: companyExists, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("id", data.company_id)
      .single()

    if (companyError || !companyExists) {
      console.error("Error al verificar empresa:", companyError)
      throw new Error("La empresa seleccionada no existe")
    }

    // Verificar que el tipo de diagnóstico existe
    const { data: tipoExists, error: tipoError } = await supabase
      .from("tipos_diagnostico")
      .select("id")
      .eq("id", data.tipo_diagnostico_id)
      .single()

    if (tipoError || !tipoExists) {
      console.error("Error al verificar tipo de diagnóstico:", tipoError)
      throw new Error("El tipo de diagnóstico seleccionado no existe")
    }

    // Crear la evaluación
    const { data: newEvaluation, error } = await supabase
      .from("evaluations")
      .insert({
        name: data.name,
        description: data.description || null,
        company_id: data.company_id,
        created_by: data.created_by,
        tipo_diagnostico_id: data.tipo_diagnostico_id,
        status: "not_started",
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error al crear evaluación:", error)
      throw new Error("No se pudo crear la evaluación: " + error.message)
    }

    // Registrar la creación en el log de actividad
    try {
      await supabase.from("activity_logs").insert({
        user_id: data.created_by,
        action: "create_evaluation",
        resource_type: "evaluations",
        resource_id: newEvaluation.id,
        details: JSON.stringify({
          name: data.name,
          company_id: data.company_id,
          tipo_diagnostico_id: data.tipo_diagnostico_id,
        }),
      })
    } catch (logError) {
      console.error("Error al registrar actividad:", logError)
      // No interrumpimos el flujo por un error de registro
    }

    return { success: true, data: newEvaluation }
  } catch (error: any) {
    console.error("Error al crear evaluación:", error)
    return {
      success: false,
      error: error.message || "Error desconocido al crear la evaluación",
    }
  }
}

/**
 * Actualiza el progreso de una evaluación basado en las respuestas y el total de preguntas disponibles
 */
export async function updateEvaluationProgress(evaluationId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      throw new Error("No se pudo conectar con la base de datos")
    }

    if (!evaluationId) {
      throw new Error("ID de evaluación no proporcionado")
    }

    // Verificar que la evaluación existe
    const { data: evaluationExists, error: evalError } = await supabase
      .from("evaluations")
      .select("id")
      .eq("id", evaluationId)
      .single()

    if (evalError || !evaluationExists) {
      console.error("Error al verificar evaluación:", evalError)
      throw new Error("La evaluación no existe")
    }

    // Obtener el total de preguntas disponibles para esta evaluación según su nivel
    const { count: totalQuestions, success } = await countQuestionsForEvaluation(evaluationId)

    if (!success || !totalQuestions) {
      throw new Error("No se pudo obtener el total de preguntas para la evaluación")
    }

    // Obtener el total de respuestas para esta evaluación
    const { data: responses, error: responsesError } = await supabase
      .from("evaluation_responses")
      .select("id")
      .eq("evaluation_id", evaluationId)

    if (responsesError) {
      console.error("Error al obtener respuestas:", responsesError)
      throw responsesError
    }

    const answeredQuestions = responses?.length || 0

    // Calcular el progreso
    const progress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0

    // Determinar el estado basado en el progreso
    let status = "not_started"
    if (progress === 100) {
      status = "completed"
    } else if (progress > 0) {
      status = "in_progress"
    }

    // Actualizar el progreso en la evaluación
    const { error: updateError } = await supabase
      .from("evaluations")
      .update({
        progress,
        status,
        completed_at: progress === 100 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", evaluationId)

    if (updateError) {
      console.error("Error al actualizar progreso:", updateError)
      throw updateError
    }

    return {
      success: true,
      progress,
      status,
      totalQuestions,
      answeredQuestions,
    }
  } catch (error: any) {
    console.error("Error al actualizar progreso:", error)
    return {
      success: false,
      error: error.message || "Error desconocido al actualizar el progreso",
    }
  }
}

/**
 * Obtiene una evaluación por su ID
 */
export async function getEvaluationById(evaluationId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      throw new Error("No se pudo conectar con la base de datos")
    }

    if (!evaluationId) {
      throw new Error("ID de evaluación no proporcionado")
    }

    const { data, error } = await supabase
      .from("evaluations")
      .select(`
        *,
        companies(*),
        tipos_diagnostico(*),
        user_profiles(*)
      `)
      .eq("id", evaluationId)
      .single()

    if (error) {
      console.error("Error al obtener evaluación:", error)
      throw error
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error al obtener evaluación:", error)
    return {
      success: false,
      error: error.message || "Error desconocido al obtener la evaluación",
    }
  }
}

/**
 * Elimina una evaluación por su ID
 */
export async function deleteEvaluation(evaluationId: string, userId: string) {
  try {
    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      throw new Error("No se pudo conectar con la base de datos")
    }

    if (!evaluationId) {
      throw new Error("ID de evaluación no proporcionado")
    }

    // Primero registramos la eliminación en el log de actividad
    try {
      // Obtener datos de la evaluación antes de eliminarla
      const { data: evaluation } = await supabase.from("evaluations").select("*").eq("id", evaluationId).single()

      if (evaluation) {
        await supabase.from("activity_logs").insert({
          user_id: userId,
          action: "delete_evaluation",
          resource_type: "evaluations",
          resource_id: evaluationId,
          details: JSON.stringify(evaluation),
        })
      }
    } catch (logError) {
      console.error("Error al registrar eliminación:", logError)
      // No interrumpimos el flujo por un error de registro
    }

    // Eliminar primero las respuestas asociadas
    const { error: responsesError } = await supabase
      .from("evaluation_responses")
      .delete()
      .eq("evaluation_id", evaluationId)

    if (responsesError) {
      console.error("Error al eliminar respuestas:", responsesError)
      throw responsesError
    }

    // Ahora eliminar la evaluación
    const { error } = await supabase.from("evaluations").delete().eq("id", evaluationId)

    if (error) {
      console.error("Error al eliminar evaluación:", error)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error al eliminar evaluación:", error)
    return {
      success: false,
      error: error.message || "Error desconocido al eliminar la evaluación",
    }
  }
}
