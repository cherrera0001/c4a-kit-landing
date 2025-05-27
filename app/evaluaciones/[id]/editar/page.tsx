import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getEvaluationById, getEvaluationResponses } from "@/services/database-service"
import EvaluationForm from "@/components/evaluations/evaluation-form"

export default async function EditarEvaluacionPage({ params }) {
  const evaluationId = params.id

  // Obtener datos de la evaluación
  const supabase = createServerComponentClient({ cookies })

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/auth/login")
  }

  // Obtener la evaluación
  const evaluationResult = await getEvaluationById(evaluationId)
  if (!evaluationResult.success || !evaluationResult.data) {
    notFound()
  }

  // Obtener las respuestas existentes
  const responsesResult = await getEvaluationResponses(evaluationId)
  const responses = responsesResult.success ? responsesResult.data || [] : []

  // Formatear las respuestas para el componente
  const formattedResponses = {}
  responses.forEach((response) => {
    formattedResponses[response.question_id] = {
      value: response.response_value,
      comments: response.comments || "",
    }
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Evaluación: {evaluationResult.data.name}</h1>

      <EvaluationForm evaluationId={evaluationId} initialResponses={formattedResponses} />
    </div>
  )
}
