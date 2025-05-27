import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { EvaluationResult } from "@/types/database"

interface ResultsSummaryProps {
  results: EvaluationResult
  sectorComparison?: any
}

export function ResultsSummary({ results, sectorComparison }: ResultsSummaryProps) {
  // Función para obtener el color según el nivel de madurez
  const getMaturityColor = (score: number) => {
    if (score < 1.5) return "bg-red-500"
    if (score < 2.5) return "bg-orange-500"
    if (score < 3.5) return "bg-yellow-500"
    if (score < 4.5) return "bg-blue-500"
    return "bg-green-500"
  }

  // Función para obtener la variante del badge según el nivel de madurez
  const getMaturityBadgeVariant = (
    score: number,
  ): "default" | "destructive" | "outline" | "secondary" | "success" | "warning" => {
    if (score < 1.5) return "destructive"
    if (score < 2.5) return "warning"
    if (score < 3.5) return "secondary"
    if (score < 4.5) return "default"
    return "success"
  }

  // Función para obtener el porcentaje de la puntuación (0-100)
  const getScorePercentage = (score: number) => {
    return (score / 5) * 100
  }

  // Función para obtener el nombre del nivel de madurez
  const getMaturityLevelName = (score: number): string => {
    if (score < 1.5) return "Inicial"
    if (score < 2.5) return "Repetible"
    if (score < 3.5) return "Definido"
    if (score < 4.5) return "Gestionado"
    return "Optimizado"
  }

  // Función para obtener la variante del badge para la comparación con el sector
  const getComparisonBadgeVariant = (
    comparison: number,
  ): "default" | "destructive" | "outline" | "secondary" | "success" | "warning" => {
    if (comparison <= -20) return "destructive"
    if (comparison < 0) return "warning"
    if (comparison < 10) return "secondary"
    if (comparison < 20) return "default"
    return "success"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Resultados</CardTitle>
        <CardDescription>
          Evaluación: {results.evaluation_name} | Empresa: {results.company_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Nivel de Madurez General</h3>
            <Badge variant={getMaturityBadgeVariant(results.overall_score)}>
              {getMaturityLevelName(results.overall_score)}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Puntuación: {results.overall_score} / 5</span>
              <span>Progreso: {results.progress}%</span>
            </div>
            <Progress
              value={getScorePercentage(results.overall_score)}
              className={`h-2 ${getMaturityColor(results.overall_score)}`}
            />
          </div>
        </div>

        {sectorComparison && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Comparación con el Sector</h3>
              <Badge variant={getComparisonBadgeVariant(sectorComparison.comparison)}>
                {sectorComparison.comparison > 0 ? "+" : ""}
                {sectorComparison.comparison}%
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Sector: {sectorComparison.sector_name}</span>
                <span>Promedio del sector: {sectorComparison.sector_avg_score} / 5</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Basado en datos de {sectorComparison.total_companies} empresas del mismo sector
              </div>
            </div>
          </div>
        )}

        <div className="pt-2">
          <h3 className="text-lg font-medium mb-3">Resumen por Dominios</h3>
          <div className="space-y-4">
            {results.domain_results.map((domain) => (
              <div key={domain.domain_id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{domain.domain_name}</span>
                    <Badge variant={getMaturityBadgeVariant(domain.score)} className="ml-2">
                      {domain.maturity_level}
                    </Badge>
                  </div>
                  <span className="font-medium">{domain.score} / 5</span>
                </div>
                <Progress
                  value={getScorePercentage(domain.score)}
                  className={`h-1.5 ${getMaturityColor(domain.score)}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {domain.answered_questions} de {domain.total_questions} preguntas respondidas
                  </span>
                  <span>{Math.round((domain.answered_questions / domain.total_questions) * 100)}% completado</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 text-sm text-muted-foreground">
          <p>
            Evaluación {results.completed_at ? "completada" : "iniciada"} el{" "}
            {new Date(results.created_at).toLocaleDateString()}
            {results.completed_at && ` y finalizada el ${new Date(results.completed_at).toLocaleDateString()}`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
