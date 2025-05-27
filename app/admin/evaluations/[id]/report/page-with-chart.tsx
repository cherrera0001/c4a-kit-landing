import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MaturityResults } from "@/components/evaluations/maturity-results"
import { MaturityChart } from "@/components/evaluations/maturity-chart"
import { calculateEvaluationResults } from "@/services/maturity-service"
import { getSupabaseServerClient } from "@/lib/supabase"
import { FileText, Download, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface ReportPageProps {
  params: {
    id: string
  }
}

export default async function EvaluationReportPage({ params }: ReportPageProps) {
  const evaluationId = params.id

  try {
    // Calcular los resultados de la evaluación
    const results = await calculateEvaluationResults(evaluationId)

    // Obtener información adicional de la evaluación
    const supabase = await getSupabaseServerClient()
    const { data: evaluation } = await supabase
      .from("evaluations")
      .select(`
        id,
        name,
        companies (
          name,
          industry_id,
          industries (
            name
          )
        ),
        created_at,
        completed_at,
        users (
          full_name
        )
      `)
      .eq("id", evaluationId)
      .single()

    if (!evaluation) {
      return notFound()
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/admin/evaluations/${evaluationId}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-2xl font-bold">Informe de Evaluación</h2>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generar Informe Completo
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Información General</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-32 font-medium">Evaluación:</dt>
                    <dd>{evaluation.name}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 font-medium">Empresa:</dt>
                    <dd>{evaluation.companies?.name}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 font-medium">Industria:</dt>
                    <dd>{evaluation.companies?.industries?.name || "No especificada"}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Detalles de Evaluación</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-32 font-medium">Fecha inicio:</dt>
                    <dd>{new Date(evaluation.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 font-medium">Fecha fin:</dt>
                    <dd>
                      {evaluation.completed_at ? new Date(evaluation.completed_at).toLocaleDateString() : "En progreso"}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 font-medium">Evaluador:</dt>
                    <dd>{evaluation.users?.full_name || "No especificado"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <MaturityChart results={results} type="radar" />
          <MaturityChart results={results} type="bar" />
        </div>

        <MaturityResults results={results} />

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Resumen Ejecutivo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              La evaluación de madurez en ciberseguridad para {evaluation.companies?.name} ha revelado un nivel general
              de madurez "{getMaturityLevelName(results.overall_score)}" con una puntuación de {results.overall_score}{" "}
              sobre 5.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Principales hallazgos:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {results.domain_results
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((domain) => (
                    <li key={domain.domain_id}>
                      <span className="font-medium">{domain.domain_name}:</span> Nivel de madurez{" "}
                      {domain.maturity_level}({domain.score}/5)
                    </li>
                  ))}
              </ul>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Áreas de mejora prioritarias:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {results.domain_results
                  .sort((a, b) => a.score - b.score)
                  .slice(0, 3)
                  .map((domain) => (
                    <li key={domain.domain_id}>
                      <span className="font-medium">{domain.domain_name}:</span> Nivel de madurez{" "}
                      {domain.maturity_level}({domain.score}/5)
                    </li>
                  ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error al generar el informe:", error)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Error al Generar Informe</h2>
          <Button variant="outline" asChild>
            <Link href="/admin/evaluations">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Evaluaciones
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">
              Se produjo un error al generar el informe de evaluación. Por favor, inténtelo de nuevo más tarde.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Si el problema persiste, contacte con el administrador del sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}

// Función para obtener el nombre del nivel de madurez
function getMaturityLevelName(score: number): string {
  if (score < 1.5) return "Inicial"
  if (score < 2.5) return "Gestionado"
  if (score < 3.5) return "Definido"
  if (score < 4.5) return "Cuantificado"
  return "Optimizado"
}
