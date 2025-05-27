import { getSupabaseServerClient } from "@/lib/supabase"

export interface DomainScore {
  domainId: number
  domainName: string
  score: number
  maxPossibleScore: number
  percentageComplete: number
  maturityLevel: number
}

export interface MaturityScore {
  overallScore: number
  overallMaturityLevel: number
  domainScores: DomainScore[]
  percentageComplete: number
}

export async function calculateMaturityScore(evaluationId: string): Promise<MaturityScore> {
  const supabase = await getSupabaseServerClient()

  // Obtener todas las respuestas para esta evaluación
  const { data: responses, error: responsesError } = await supabase
    .from("evaluation_responses")
    .select(`
      id,
      question_id,
      response_value,
      questions (
        id,
        domain_id,
        weight,
        maturity_level_id,
        domains (
          id,
          name,
          weight
        )
      )
    `)
    .eq("evaluation_id", evaluationId)

  if (responsesError) {
    throw new Error(`Error al obtener respuestas: ${responsesError.message}`)
  }

  // Obtener todas las preguntas para esta evaluación
  const { data: allQuestions, error: questionsError } = await supabase
    .from("questions")
    .select(`
      id,
      domain_id,
      weight,
      maturity_level_id,
      domains (
        id,
        name,
        weight
      )
    `)
    .eq("active", true)

  if (questionsError) {
    throw new Error(`Error al obtener preguntas: ${questionsError.message}`)
  }

  // Agrupar respuestas por dominio
  const domainResponses: Record<number, any[]> = {}
  const domainQuestions: Record<number, any[]> = {}
  const domainInfo: Record<number, { id: number; name: string; weight: number }> = {}

  // Agrupar todas las preguntas por dominio
  allQuestions.forEach((question) => {
    const domainId = question.domain_id
    if (!domainQuestions[domainId]) {
      domainQuestions[domainId] = []
      domainInfo[domainId] = {
        id: question.domains.id,
        name: question.domains.name,
        weight: question.domains.weight || 1,
      }
    }
    domainQuestions[domainId].push(question)
  })

  // Agrupar respuestas por dominio
  responses.forEach((response) => {
    const domainId = response.questions.domain_id
    if (!domainResponses[domainId]) {
      domainResponses[domainId] = []
    }
    domainResponses[domainId].push(response)
  })

  // Calcular puntuación por dominio
  const domainScores: DomainScore[] = []
  let totalWeightedScore = 0
  let totalWeightedMaxScore = 0

  Object.keys(domainInfo).forEach((domainIdStr) => {
    const domainId = Number.parseInt(domainIdStr)
    const domain = domainInfo[domainId]
    const questions = domainQuestions[domainId] || []
    const responses = domainResponses[domainId] || []

    let domainScore = 0
    let maxPossibleScore = 0
    let answeredQuestions = 0

    questions.forEach((question) => {
      const weight = question.weight || 1
      maxPossibleScore += 5 * weight // Asumiendo que 5 es la puntuación máxima

      // Buscar la respuesta para esta pregunta
      const response = responses.find((r) => r.question_id === question.id)
      if (response && response.response_value !== null) {
        domainScore += response.response_value * weight
        answeredQuestions++
      }
    })

    const percentageComplete = questions.length > 0 ? (answeredQuestions / questions.length) * 100 : 0
    const maturityLevel = maxPossibleScore > 0 ? Math.round((domainScore / maxPossibleScore) * 5) : 0

    domainScores.push({
      domainId,
      domainName: domain.name,
      score: domainScore,
      maxPossibleScore,
      percentageComplete,
      maturityLevel,
    })

    // Acumular para la puntuación general ponderada
    const domainWeight = domain.weight || 1
    totalWeightedScore += domainScore * domainWeight
    totalWeightedMaxScore += maxPossibleScore * domainWeight
  })

  // Calcular puntuación general
  const overallScore = totalWeightedMaxScore > 0 ? (totalWeightedScore / totalWeightedMaxScore) * 5 : 0
  const overallMaturityLevel = Math.round(overallScore)

  // Calcular porcentaje de completitud general
  const totalQuestions = Object.values(domainQuestions).reduce((acc, questions) => acc + questions.length, 0)
  const answeredQuestions = Object.values(domainResponses).reduce((acc, responses) => acc + responses.length, 0)
  const percentageComplete = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  return {
    overallScore,
    overallMaturityLevel,
    domainScores,
    percentageComplete,
  }
}
