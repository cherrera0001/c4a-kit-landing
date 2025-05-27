import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getEvaluationById } from "@/services/database-service"
import { getEvaluationResults } from "@/services/evaluation-results-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ExportPdfButton } from "@/components/evaluations/export-pdf-button"

export default async function InformeEvaluacionPage({ params }) {
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
        <div className="flex items-center">
          <Button asChild variant="ghost" className="mr-2">
            <Link href={`/evaluaciones/${evaluationId}/resultados`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Resultados
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Informe: {evaluation.name}</h1>
        </div>

        <ExportPdfButton evaluationId={evaluationId} />
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">{/* Contenido del informe (igual que antes) */}</CardContent>
      </Card>
    </div>
  )
}
