import { getSupabaseServerClient } from "@/lib/supabase"
import type { EvaluationResponse, Domain, Question, DomainResult, EvaluationResult } from "@/types/database"

/**
 * Calcula los resultados de una evaluación de madurez
 * @param evaluationId ID de la evaluación
 * @returns Resultados detallados de la evaluación
 */
export async function calculateEvaluationResults(evaluationId: string): Promise<EvaluationResult> {
  const supabase = await getSupabaseServerClient()

  // Obtener información básica de la evaluación
  const { data: evaluation, error: evalError } = await supabase
    .from("evaluations")
    .select(`
      id,
      name,
      company_id,
      status,
      progress,
      score,
      created_at,
      completed_at,
      companies (
        id,
        name
      )
    `)
    .eq("id", evaluationId)
    .single()

  if (evalError || !evaluation) {
    throw new Error(`Error al obtener la evaluación: ${evalError?.message || "No encontrada"}`)
  }

  // Obtener todas las respuestas para esta evaluación con sus preguntas y dominios
  const { data: responses, error: responsesError } = await supabase
    .from("evaluation_responses")
    .select(`
      id,
      question_id,
      response_value,
      comments,
      questions (
        id,
        text,
        domain_id,
        maturity_level_id,
        domains (
          id,
          name
        )
      )
    `)
    .eq("evaluation_id", evaluationId)

  if (responsesError) {
    throw new Error(`Error al obtener respuestas: ${responsesError.message}`)
  }

  // Obtener todos los dominios activos
  const { data: domains, error: domainsError } = await supabase
    .from("domains")
    .select("id, name, description, order_index")
    .eq("active", true)
    .order("order_index", { ascending: true })

  if (domainsError) {
    throw new Error(`Error al obtener dominios: ${domainsError.message}`)
  }

  // Obtener todas las preguntas activas
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, domain_id, text, maturity_level_id")
    .eq("active", true)

  if (questionsError) {
    throw new Error(`Error al obtener preguntas: ${questionsError.message}`)
  }

  // Calcular resultados por dominio
  const domainResults = calculateDomainResults(domains, questions, responses)

  // Calcular puntuación general
  const overallScore = calculateOverallScore(domainResults)

  // Calcular progreso general
  const progress = calculateProgress(questions, responses)

  // Construir el resultado final
  const result: EvaluationResult = {
    evaluation_id: evaluation.id,
    evaluation_name: evaluation.name,
    company_name: evaluation.companies?.name || "Desconocida",
    overall_score: overallScore,
    progress: progress,
    domain_results: domainResults,
    created_at: evaluation.created_at,
    completed_at: evaluation.completed_at,
  }

  // Actualizar la evaluación con los resultados calculados
  await updateEvaluationResults(evaluationId, overallScore, progress)

  return result
}

/**
 * Calcula los resultados por dominio
 */
function calculateDomainResults(
  domains: Domain[],
  questions: Question[],
  responses: EvaluationResponse[],
): DomainResult[] {
  // Agrupar preguntas por dominio
  const questionsByDomain: Record<string, Question[]> = {}
  questions.forEach((question) => {
    if (!questionsByDomain[question.domain_id]) {
      questionsByDomain[question.domain_id] = []
    }
    questionsByDomain[question.domain_id].push(question)
  })

  // Agrupar respuestas por pregunta
  const responsesByQuestion: Record<string, EvaluationResponse> = {}
  responses.forEach((response) => {
    responsesByQuestion[response.question_id] = response
  })

  // Calcular resultados para cada dominio
  return domains.map((domain) => {
    const domainQuestions = questionsByDomain[domain.id] || []
    const totalQuestions = domainQuestions.length

    if (totalQuestions === 0) {
      return {
        domain_id: domain.id,
        domain_name: domain.name,
        score: 0,
        total_questions: 0,
        answered_questions: 0,
        maturity_level: "No evaluado",
      }
    }

    let totalScore = 0
    let answeredQuestions = 0

    domainQuestions.forEach((question) => {
      const response = responsesByQuestion[question.id]
      if (response && response.response_value) {
        totalScore += response.response_value
        answeredQuestions++
      }
    })

    // Calcular puntuación promedio (escala 1-5)
    const score = answeredQuestions > 0 ? totalScore / answeredQuestions : 0

    // Determinar nivel de madurez basado en la puntuación
    const maturityLevel = getMaturityLevelName(score)

    return {
      domain_id: domain.id,
      domain_name: domain.name,
      score: Number.parseFloat(score.toFixed(2)),
      total_questions: totalQuestions,
      answered_questions: answeredQuestions,
      maturity_level: maturityLevel,
    }
  })
}

/**
 * Calcula la puntuación general basada en los resultados por dominio
 */
function calculateOverallScore(domainResults: DomainResult[]): number {
  if (domainResults.length === 0) return 0

  const totalScore = domainResults.reduce((sum, domain) => sum + domain.score, 0)
  const averageScore = totalScore / domainResults.length

  return Number.parseFloat(averageScore.toFixed(2))
}

/**
 * Calcula el porcentaje de progreso de la evaluación
 */
function calculateProgress(questions: Question[], responses: EvaluationResponse[]): number {
  if (questions.length === 0) return 0

  const answeredQuestions = new Set(responses.map((r) => r.question_id)).size
  const progress = (answeredQuestions / questions.length) * 100

  return Math.round(progress)
}

/**
 * Actualiza los resultados en la evaluación
 */
async function updateEvaluationResults(evaluationId: string, score: number, progress: number): Promise<void> {
  const supabase = await getSupabaseServerClient()

  const updates: any = {
    score,
    progress,
  }

  // Si el progreso es 100%, marcar como completada
  if (progress === 100) {
    updates.status = "completed"
    updates.completed_at = new Date().toISOString()
  } else if (progress > 0) {
    updates.status = "in_progress"
  }

  await supabase.from("evaluations").update(updates).eq("id", evaluationId)
}

/**
 * Obtiene el nombre del nivel de madurez basado en la puntuación
 */
function getMaturityLevelName(score: number): string {
  if (score < 1.5) return "Inicial"
  if (score < 2.5) return "Gestionado"
  if (score < 3.5) return "Definido"
  if (score < 4.5) return "Cuantificado"
  return "Optimizado"
}

/**
 * Obtiene las respuestas de una evaluación agrupadas por dominio
 */
export async function getEvaluationResponsesByDomain(evaluationId: string): Promise<Record<string, any>> {
  const supabase = await getSupabaseServerClient()

  // Obtener todas las respuestas con sus preguntas y dominios
  const { data: responses, error } = await supabase
    .from("evaluation_responses")
    .select(`
      id,
      response_value,
      comments,
      questions (
        id,
        text,
        description,
        help_text,
        domain_id,
        maturity_level_id,
        order_index,
        domains (
          id,
          name,
          description
        ),
        maturity_levels (
          id,
          name,
          description
        )
      )
    `)
    .eq("evaluation_id", evaluationId)
    .order("questions.order_index", { ascending: true })

  if (error) {
    throw new Error(`Error al obtener respuestas: ${error.message}`)
  }

  // Agrupar por dominio
  const responsesByDomain: Record<string, any> = {}

  responses?.forEach((response) => {
    const domain = response.questions?.domains
    if (!domain) return

    if (!responsesByDomain[domain.id]) {
      responsesByDomain[domain.id] = {
        domain_id: domain.id,
        domain_name: domain.name,
        domain_description: domain.description,
        responses: [],
      }
    }

    responsesByDomain[domain.id].responses.push({
      id: response.id,
      response_value: response.response_value,
      comments: response.comments,
      question: {
        id: response.questions.id,
        text: response.questions.text,
        description: response.questions.description,
        help_text: response.questions.help_text,
        maturity_level: response.questions.maturity_levels?.name || "Desconocido",
        order_index: response.questions.order_index,
      },
    })
  })

  return responsesByDomain
}
