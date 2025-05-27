import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadarChart } from "@/components/evaluations/radar-chart"
import { BarChart } from "@/components/evaluations/bar-chart"
import { HistoryChart } from "@/components/evaluations/history-chart"
import { ResultsSummary } from "@/components/evaluations/results-summary"
import { Recommendations } from "@/components/evaluations/recommendations"
import {
  calculateEvaluationResults,
  getCompanyEvaluationHistory,
  getSectorComparison,
} from "@/services/evaluation-results-service"
import { ChevronLeft, Download, FileText, Share2 } from "lucide-react"
import Link from "next/link"

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default async function EvaluationResultsPage({ params }: ResultsPageProps) {
  const evaluationId = params.id

  try {
    // Calcular los resultados de la evaluación
    const results = await calculateEvaluationResults(evaluationId)

    // Obtener el historial de evaluaciones para la empresa
    const evaluationHistory = await getCompanyEvaluationHistory(results.company_name)

    // Obtener comparación con el sector
    const sectorComparison = await getSectorComparison(evaluationId)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/admin/evaluations/${evaluationId}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-2xl font-bold">Resultados de Evaluación</h2>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
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

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <ResultsSummary results={results} sectorComparison={sectorComparison} />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <RadarChart results={results} />
              <BarChart results={results} />
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Recommendations results={results} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HistoryChart evaluationHistory={evaluationHistory} />
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error al generar los resultados:", error)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Error al Generar Resultados</h2>
          <Button variant="outline" asChild>
            <Link href="/admin/evaluations">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Evaluaciones
            </Link>
          </Button>
        </div>

        <div className="bg-destructive/10 p-4 rounded-md">
          <p className="text-destructive font-medium">
            Se produjo un error al generar los resultados de la evaluación. Por favor, inténtelo de nuevo más tarde.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Si el problema persiste, contacte con el administrador del sistema.
          </p>
        </div>
      </div>
    )
  }
}
