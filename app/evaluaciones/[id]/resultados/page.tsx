import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getEvaluationById } from "@/services/database-service"
import { getEvaluationResults } from "@/services/evaluation-results-service"
import { Button } from "@/components/ui/button"
import { ExportPdfButton } from "@/components/evaluations/export-pdf-button"
import ResultsSummary from "@/components/evaluations/results-summary"
import RadarChart from "@/components/evaluations/radar-chart"
import BarChart from "@/components/evaluations/bar-chart"
import Recommendations from "@/components/evaluations/recommendations"

export default async function ResultadosEvaluacionPage({ params }) {
  const evaluationId = params.id

  // Verificar autenticación
  const supabase = createServerComponentClient({ cookies })
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

  // Obtener los resultados
  const resultsResult = await getEvaluationResults(evaluationId)
  if (!resultsResult.success || !resultsResult.data) {
    // Si no hay resultados, redirigir a la página de edición
    redirect(`/evaluaciones/${evaluationId}/editar?error=no_results`)
  }

  const evaluation = evaluationResult.data
  const results = resultsResult.data

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resultados: {evaluation.name}</h1>

        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href={`/evaluaciones/${evaluationId}/editar`}>Editar Evaluación</Link>
          </Button>

          <Button asChild>
            <Link href={`/evaluaciones/${evaluationId}/informe`}>Ver Informe</Link>
          </Button>

          <ExportPdfButton evaluationId={evaluationId} />
        </div>
      </div>

      {/* Resumen de resultados */}
      <ResultsSummary results={results} evaluation={evaluation} />

      {/* Resultados por dominio */}
      <h2 className="text-xl font-semibold mb-4">Resultados por Dominio</h2>
      <BarChart domainResults={results.domain_results} />

      {/* Radar Chart */}
      <h2 className="text-xl font-semibold mb-4">Gráfico Radar</h2>
      <RadarChart domainResults={results.domain_results} />

      {/* Recomendaciones */}
      <Recommendations domainResults={results.domain_results} overallScore={results.overall_score} />
    </div>
  )
}
