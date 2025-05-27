import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import type { EvaluationResult } from "@/types/database"

interface KeyMetricsProps {
  results: EvaluationResult
  previousResults?: EvaluationResult
  sectorComparison?: any
}

export function KeyMetrics({ results, previousResults, sectorComparison }: KeyMetricsProps) {
  // Calcular cambios respecto a evaluación anterior
  const calculateChange = (
    current: number,
    previous?: number,
  ): { value: number; direction: "up" | "down" | "neutral" } => {
    if (!previous) return { value: 0, direction: "neutral" }
    const change = current - previous
    return {
      value: Math.abs(change),
      direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
    }
  }

  const overallChange = calculateChange(results.overall_score, previousResults?.overall_score)

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

  // Encontrar el dominio con mayor y menor puntuación
  const strongestDomain = [...results.domain_results].sort((a, b) => b.score - a.score)[0]
  const weakestDomain = [...results.domain_results].sort((a, b) => a.score - b.score)[0]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Nivel de Madurez</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{results.overall_score.toFixed(2)}/5</div>
            <Badge variant={getMaturityBadgeVariant(results.overall_score)}>
              {getMaturityLevelName(results.overall_score)}
            </Badge>
          </div>
          <Progress
            value={getScorePercentage(results.overall_score)}
            className={`h-2 mt-2 ${getMaturityColor(results.overall_score)}`}
          />
          {overallChange.direction !== "neutral" && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              {overallChange.direction === "up" ? (
                <>
                  <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">{overallChange.value.toFixed(2)}</span>
                </>
              ) : (
                <>
                  <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{overallChange.value.toFixed(2)}</span>
                </>
              )}
              <span className="ml-1">desde la última evaluación</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Progreso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{results.progress}%</div>
          <Progress value={results.progress} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {results.progress === 100 ? "Evaluación completada" : `${results.progress}% de preguntas respondidas`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Área más Fuerte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate" title={strongestDomain.domain_name}>
            {strongestDomain.domain_name}
          </div>
          <div className="flex items-center mt-2">
            <Progress
              value={getScorePercentage(strongestDomain.score)}
              className={`h-2 flex-grow ${getMaturityColor(strongestDomain.score)}`}
            />
            <span className="ml-2 text-sm font-medium">{strongestDomain.score.toFixed(1)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Nivel: {strongestDomain.maturity_level}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Área más Débil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate" title={weakestDomain.domain_name}>
            {weakestDomain.domain_name}
          </div>
          <div className="flex items-center mt-2">
            <Progress
              value={getScorePercentage(weakestDomain.score)}
              className={`h-2 flex-grow ${getMaturityColor(weakestDomain.score)}`}
            />
            <span className="ml-2 text-sm font-medium">{weakestDomain.score.toFixed(1)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Nivel: {weakestDomain.maturity_level}</p>
        </CardContent>
      </Card>
    </div>
  )
}
