"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadarChart } from "@/components/evaluations/radar-chart"
import { BarChart } from "@/components/evaluations/bar-chart"
import { HeatmapChart } from "@/components/evaluations/heatmap-chart"
import { KeyMetrics } from "@/components/evaluations/key-metrics"
import { ResultsSummary } from "@/components/evaluations/results-summary"
import { Recommendations } from "@/components/evaluations/recommendations"
import { ComparisonChart } from "@/components/evaluations/comparison-chart"
import { HistoryChart } from "@/components/evaluations/history-chart"
import { CustomDashboard } from "@/components/evaluations/custom-dashboard"
import { PdfPreviewModal } from "@/components/pdf/pdf-preview-modal"
import { ChevronLeft, Download, FileText, Share2 } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

interface DashboardPageProps {
  params: {
    id: string
  }
}

export default function EvaluationDashboardPage({ params }: DashboardPageProps) {
  const evaluationId = params.id
  const [results, setResults] = useState<any>(null)
  const [evaluationHistory, setEvaluationHistory] = useState<any[]>([])
  const [sectorComparison, setSectorComparison] = useState<any>(null)
  const [previousResults, setPreviousResults] = useState<any>(null)
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Importar servicios dinámicamente
        const { calculateEvaluationResults, getCompanyEvaluationHistory, getSectorComparison } = await import(
          "@/services/evaluation-results-service"
        )

        // Calcular los resultados de la evaluación
        const evaluationResults = await calculateEvaluationResults(evaluationId)
        setResults(evaluationResults)

        // Obtener el historial de evaluaciones para la empresa
        const history = await getCompanyEvaluationHistory(evaluationResults.company_name)
        setEvaluationHistory(history)

        // Obtener comparación con el sector
        const comparison = await getSectorComparison(evaluationId)
        setSectorComparison(comparison)

        // Obtener la evaluación anterior (si existe)
        if (history.length > 1) {
          const prevEvaluation = history.filter((e) => e.id !== evaluationId)[0]
          const prevResults = await calculateEvaluationResults(prevEvaluation.id)
          setPreviousResults(prevResults)
        }

        // Obtener datos para comparación (últimas 5 evaluaciones completadas)
        const comparisonResults = await Promise.all(
          history
            .filter((e) => e.status === "completed")
            .slice(0, 5)
            .map((e) => calculateEvaluationResults(e.id)),
        )
        setComparisonData(comparisonResults)
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [evaluationId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">Cargando dashboard...</span>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Error al Generar Dashboard</h2>
          <Button variant="outline" asChild>
            <Link href="/admin/evaluations">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Evaluaciones
            </Link>
          </Button>
        </div>

        <div className="bg-destructive/10 p-4 rounded-md">
          <p className="text-destructive font-medium">
            Se produjo un error al generar el dashboard de la evaluación. Por favor, inténtelo de nuevo más tarde.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {error || "Si el problema persiste, contacte con el administrador del sistema."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/evaluations/${evaluationId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">Dashboard de Evaluación</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
          <Button variant="outline" onClick={() => setIsPdfModalOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generar Informe Completo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="comparison">Comparación</TabsTrigger>
          <TabsTrigger value="custom">Personalizado</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <KeyMetrics results={results} previousResults={previousResults} sectorComparison={sectorComparison} />

          <div className="grid gap-6 md:grid-cols-2">
            <RadarChart results={results} />
            <BarChart results={results} />
          </div>

          <HeatmapChart results={results} />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <ResultsSummary results={results} sectorComparison={sectorComparison} />
          <Recommendations results={results} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ComparisonChart evaluations={comparisonData} />
            <HistoryChart evaluationHistory={evaluationHistory} />
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <CustomDashboard
            results={results}
            evaluationHistory={evaluationHistory}
            sectorComparison={sectorComparison}
            previousResults={previousResults}
            comparisonData={comparisonData}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de vista previa del PDF */}
      <PdfPreviewModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} evaluationId={evaluationId} />
    </div>
  )
}
