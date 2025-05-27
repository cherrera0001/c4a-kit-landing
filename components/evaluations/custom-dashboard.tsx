"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RadarChart } from "./radar-chart"
import { BarChart } from "./bar-chart"
import { HeatmapChart } from "./heatmap-chart"
import { KeyMetrics } from "./key-metrics"
import { ResultsSummary } from "./results-summary"
import { Recommendations } from "./recommendations"
import { ComparisonChart } from "./comparison-chart"
import { HistoryChart } from "./history-chart"
import { PlusIcon, XIcon, MoveIcon, SaveIcon } from "lucide-react"
import type { EvaluationResult } from "@/types/database"

interface CustomDashboardProps {
  results: EvaluationResult
  evaluationHistory?: any[]
  sectorComparison?: any
  previousResults?: EvaluationResult
  comparisonData?: EvaluationResult[]
}

type WidgetType = "radar" | "bar" | "heatmap" | "metrics" | "summary" | "recommendations" | "comparison" | "history"

interface Widget {
  id: string
  type: WidgetType
  title: string
}

export function CustomDashboard({
  results,
  evaluationHistory,
  sectorComparison,
  previousResults,
  comparisonData,
}: CustomDashboardProps) {
  // Estado para los widgets del dashboard
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "widget-1", type: "metrics", title: "Métricas Clave" },
    { id: "widget-2", type: "radar", title: "Gráfico de Radar" },
    { id: "widget-3", type: "bar", title: "Gráfico de Barras" },
    { id: "widget-4", type: "summary", title: "Resumen" },
  ])

  // Estado para el tipo de widget a añadir
  const [widgetToAdd, setWidgetToAdd] = useState<WidgetType>("radar")

  // Estado para el layout (1, 2 o 3 columnas)
  const [layout, setLayout] = useState<"1" | "2" | "3">("2")

  // Función para añadir un widget
  const addWidget = () => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: widgetToAdd,
      title: getWidgetTitle(widgetToAdd),
    }
    setWidgets([...widgets, newWidget])
  }

  // Función para eliminar un widget
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id))
  }

  // Función para obtener el título del widget según su tipo
  const getWidgetTitle = (type: WidgetType): string => {
    switch (type) {
      case "radar":
        return "Gráfico de Radar"
      case "bar":
        return "Gráfico de Barras"
      case "heatmap":
        return "Mapa de Calor"
      case "metrics":
        return "Métricas Clave"
      case "summary":
        return "Resumen"
      case "recommendations":
        return "Recomendaciones"
      case "comparison":
        return "Comparación"
      case "history":
        return "Historial"
      default:
        return "Widget"
    }
  }

  // Función para renderizar el contenido del widget según su tipo
  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "radar":
        return <RadarChart results={results} />
      case "bar":
        return <BarChart results={results} />
      case "heatmap":
        return <HeatmapChart results={results} />
      case "metrics":
        return <KeyMetrics results={results} previousResults={previousResults} sectorComparison={sectorComparison} />
      case "summary":
        return <ResultsSummary results={results} sectorComparison={sectorComparison} />
      case "recommendations":
        return <Recommendations results={results} />
      case "comparison":
        return comparisonData ? (
          <ComparisonChart evaluations={comparisonData} />
        ) : (
          <div>No hay datos de comparación disponibles</div>
        )
      case "history":
        return evaluationHistory ? (
          <HistoryChart evaluationHistory={evaluationHistory} />
        ) : (
          <div>No hay datos históricos disponibles</div>
        )
      default:
        return <div>Widget no reconocido</div>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Dashboard Personalizado</CardTitle>
            <CardDescription>Personaliza tu dashboard con los widgets que prefieras</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Select value={layout} onValueChange={(value) => setLayout(value as "1" | "2" | "3")}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Columna</SelectItem>
                  <SelectItem value="2">2 Columnas</SelectItem>
                  <SelectItem value="3">3 Columnas</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <SaveIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={widgetToAdd} onValueChange={(value) => setWidgetToAdd(value as WidgetType)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de widget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radar">Gráfico de Radar</SelectItem>
                  <SelectItem value="bar">Gráfico de Barras</SelectItem>
                  <SelectItem value="heatmap">Mapa de Calor</SelectItem>
                  <SelectItem value="metrics">Métricas Clave</SelectItem>
                  <SelectItem value="summary">Resumen</SelectItem>
                  <SelectItem value="recommendations">Recomendaciones</SelectItem>
                  <SelectItem value="comparison">Comparación</SelectItem>
                  <SelectItem value="history">Historial</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addWidget}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Añadir
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`grid gap-4 ${
            layout === "1"
              ? "grid-cols-1"
              : layout === "2"
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="relative">
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 bg-background/80 backdrop-blur-sm">
                  <MoveIcon className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                  onClick={() => removeWidget(widget.id)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
              {renderWidgetContent(widget)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
