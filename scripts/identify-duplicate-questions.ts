/**
 * Script para identificar preguntas duplicadas en la base de datos
 * Este script puede ejecutarse manualmente para encontrar y marcar duplicados existentes
 */

import { getSupabaseClient } from "@/lib/supabase"

interface Question {
  id: number
  domain_id: number
  text: string
  description: string | null
  help_text: string | null
  maturity_level_id: number
  order_index: number
  active: boolean
  created_at: string
}

interface DuplicateGroup {
  originalQuestion: Question
  duplicates: Question[]
}

// Función para calcular la similitud entre dos textos
function calculateTextSimilarity(text1: string, text2: string): number {
  // Normalizar textos
  const normalizedText1 = text1.trim().toLowerCase()
  const normalizedText2 = text2.trim().toLowerCase()

  // Si los textos son idénticos, similitud máxima
  if (normalizedText1 === normalizedText2) return 1

  // Algoritmo de distancia de Levenshtein simplificado
  const longer = normalizedText1.length > normalizedText2.length ? normalizedText1 : normalizedText2
  const shorter = normalizedText1.length > normalizedText2.length ? normalizedText2 : normalizedText1

  if (longer.length === 0) return 1.0

  // Calcular la distancia de edición
  const editDistance = levenshteinDistance(longer, shorter)

  // Convertir la distancia a similitud (1 - distancia normalizada)
  return (longer.length - editDistance) / longer.length
}

// Implementación del algoritmo de distancia de Levenshtein
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

// Función principal para identificar duplicados
async function identifyDuplicates() {
  try {
    const supabase = getSupabaseClient()

    // Obtener todas las preguntas
    const { data: questions, error } = await supabase.from("questions").select("*").order("domain_id, created_at")

    if (error) throw error

    if (!questions || questions.length === 0) {
      console.log("No se encontraron preguntas")
      return
    }

    console.log(`Analizando ${questions.length} preguntas para encontrar duplicados...`)

    // Agrupar preguntas por dominio para comparar solo dentro del mismo dominio
    const questionsByDomain: Record<number, Question[]> = {}

    questions.forEach((question) => {
      if (!questionsByDomain[question.domain_id]) {
        questionsByDomain[question.domain_id] = []
      }
      questionsByDomain[question.domain_id].push(question)
    })

    // Encontrar duplicados en cada dominio
    const duplicateGroups: DuplicateGroup[] = []

    Object.values(questionsByDomain).forEach((domainQuestions) => {
      // Crear un conjunto para rastrear preguntas ya procesadas
      const processedQuestions = new Set<number>()

      domainQuestions.forEach((question) => {
        // Saltar si esta pregunta ya fue identificada como duplicada
        if (processedQuestions.has(question.id)) return

        const duplicates: Question[] = []

        // Comparar con otras preguntas del mismo dominio
        domainQuestions.forEach((otherQuestion) => {
          // No comparar consigo misma o con preguntas ya procesadas
          if (question.id === otherQuestion.id || processedQuestions.has(otherQuestion.id)) return

          // Calcular similitud
          const similarity = calculateTextSimilarity(question.text, otherQuestion.text)

          // Si la similitud es alta (>85%), considerar como duplicado
          if (similarity > 0.85) {
            duplicates.push(otherQuestion)
            processedQuestions.add(otherQuestion.id)
          }
        })

        // Si se encontraron duplicados, agregar al grupo
        if (duplicates.length > 0) {
          duplicateGroups.push({
            originalQuestion: question,
            duplicates,
          })
          processedQuestions.add(question.id)
        }
      })
    })

    // Mostrar resultados
    if (duplicateGroups.length === 0) {
      console.log("No se encontraron preguntas duplicadas")
      return
    }

    console.log(`Se encontraron ${duplicateGroups.length} grupos de preguntas duplicadas:`)

    duplicateGroups.forEach((group, index) => {
      console.log(`\nGrupo ${index + 1}:`)
      console.log(`Original (ID: ${group.originalQuestion.id}): ${group.originalQuestion.text}`)
      console.log("Duplicados:")

      group.duplicates.forEach((duplicate) => {
        console.log(`- (ID: ${duplicate.id}): ${duplicate.text}`)
      })
    })

    // Preguntar si se desea marcar los duplicados como inactivos
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    readline.question("\n¿Desea marcar las preguntas duplicadas como inactivas? (s/n): ", async (answer: string) => {
      if (answer.toLowerCase() === "s") {
        // Marcar duplicados como inactivos
        for (const group of duplicateGroups) {
          const duplicateIds = group.duplicates.map((d) => d.id)

          const { error } = await supabase.from("questions").update({ active: false }).in("id", duplicateIds)

          if (error) {
            console.error(`Error al marcar duplicados como inactivos:`, error)
          } else {
            console.log(`Marcados ${duplicateIds.length} duplicados como inactivos`)
          }
        }
      }

      readline.close()
    })
  } catch (error) {
    console.error("Error al identificar duplicados:", error)
  }
}

// Ejecutar la función principal
identifyDuplicates()
