import { getSupabaseClient } from "@/lib/supabase"
import type { Question } from "@/types/database"

/**
 * Servicio para validar y gestionar preguntas, evitando duplicados
 */

/**
 * Verifica si una pregunta ya existe en la base de datos
 * @param text Texto de la pregunta a verificar
 * @param domainId ID del dominio (opcional para búsqueda más específica)
 * @returns Objeto con información sobre si la pregunta existe y detalles
 */
export async function checkQuestionExists(text: string, domainId?: number) {
  try {
    const supabase = getSupabaseClient()

    // Normalizar el texto para comparación (eliminar espacios extra, convertir a minúsculas)
    const normalizedText = text.trim().toLowerCase()

    // Construir la consulta base
    let query = supabase.from("questions").select("*")

    // Usar ilike para búsqueda insensible a mayúsculas/minúsculas
    // El % al principio y final permite encontrar coincidencias parciales
    query = query.ilike("text", `%${normalizedText}%`)

    // Si se proporciona un dominio, filtrar por él
    if (domainId) {
      query = query.eq("domain_id", domainId)
    }

    const { data, error } = await query

    if (error) throw error

    // Si no hay datos, la pregunta no existe
    if (!data || data.length === 0) {
      return { exists: false, similarQuestions: [] }
    }

    // Calcular similitud para cada pregunta encontrada
    const similarQuestions = data.map((question) => {
      const similarity = calculateTextSimilarity(normalizedText, question.text.toLowerCase())
      return {
        ...question,
        similarity,
      }
    })

    // Ordenar por similitud (mayor a menor)
    similarQuestions.sort((a, b) => b.similarity - a.similarity)

    // Si hay alguna pregunta con alta similitud (>85%), considerarla como duplicada
    const isDuplicate = similarQuestions.some((q) => q.similarity > 0.85)

    return {
      exists: isDuplicate,
      similarQuestions,
    }
  } catch (error) {
    console.error("Error al verificar existencia de pregunta:", error)
    return { exists: false, error, similarQuestions: [] }
  }
}

/**
 * Calcula la similitud entre dos textos (algoritmo simple de similitud)
 * @param text1 Primer texto
 * @param text2 Segundo texto
 * @returns Valor entre 0 y 1, donde 1 es exactamente igual
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  // Si los textos son idénticos, similitud máxima
  if (text1 === text2) return 1

  // Algoritmo de distancia de Levenshtein simplificado
  const longer = text1.length > text2.length ? text1 : text2
  const shorter = text1.length > text2.length ? text2 : text1

  if (longer.length === 0) return 1.0

  // Calcular la distancia de edición
  const editDistance = levenshteinDistance(longer, shorter)

  // Convertir la distancia a similitud (1 - distancia normalizada)
  return (longer.length - editDistance) / longer.length
}

/**
 * Implementación del algoritmo de distancia de Levenshtein
 * Mide cuántas operaciones (inserción, eliminación, sustitución) se necesitan
 * para transformar una cadena en otra
 */
function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = []

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue
    }
  }

  return costs[s2.length]
}

/**
 * Crea una nueva pregunta verificando primero si ya existe
 * @param questionData Datos de la pregunta a crear
 * @returns Resultado de la operación
 */
export async function createQuestionWithValidation(questionData: Omit<Question, "id" | "created_at">) {
  try {
    // Verificar si la pregunta ya existe
    const { exists, similarQuestions } = await checkQuestionExists(questionData.text, questionData.domain_id)

    if (exists) {
      return {
        success: false,
        error: "La pregunta ya existe o es muy similar a una existente",
        similarQuestions,
      }
    }

    // Si no existe, crear la pregunta
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("questions").insert(questionData).select().single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error al crear pregunta:", error)
    return { success: false, error }
  }
}

/**
 * Actualiza una pregunta existente verificando si el nuevo texto ya existe
 * @param id ID de la pregunta a actualizar
 * @param questionData Datos actualizados de la pregunta
 * @returns Resultado de la operación
 */
export async function updateQuestionWithValidation(
  id: number,
  questionData: Partial<Omit<Question, "id" | "created_at">>,
) {
  try {
    // Si se está actualizando el texto, verificar si ya existe
    if (questionData.text) {
      const supabase = getSupabaseClient()

      // Obtener la pregunta actual para comparar
      const { data: currentQuestion, error: fetchError } = await supabase
        .from("questions")
        .select("*")
        .eq("id", id)
        .single()

      if (fetchError) throw fetchError

      // Si el texto ha cambiado, verificar si ya existe
      if (currentQuestion && currentQuestion.text !== questionData.text) {
        const { exists, similarQuestions } = await checkQuestionExists(
          questionData.text,
          questionData.domain_id || currentQuestion.domain_id,
        )

        if (exists) {
          return {
            success: false,
            error: "El nuevo texto ya existe o es muy similar a una pregunta existente",
            similarQuestions,
          }
        }
      }
    }

    // Si no hay problemas, actualizar la pregunta
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("questions")
      .update({
        ...questionData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error al actualizar pregunta:", error)
    return { success: false, error }
  }
}
