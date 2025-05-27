"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EvaluationResult } from "@/types/database"

interface MaturityChartProps {
  results: EvaluationResult
  type?: "radar" | "bar" | "line"
}

export function MaturityChart({ results, type = "radar" }: MaturityChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Importar Chart.js dinámicamente para evitar problemas de SSR
    const loadChart = async () => {
      const {
        Chart,
        RadialLinearScale,
        LinearScale,
        BarElement,
        LineElement,
        PointElement,
        CategoryScale,
        Tooltip,
        Legend,
      } = await import("chart.js")

      // Registrar los componentes necesarios
      Chart.register(
        RadialLinearScale,
        LinearScale,
        BarElement,
        LineElement,
        PointElement,
        CategoryScale,
        Tooltip,
        Legend,
      )

      // Destruir el gráfico anterior si existe
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      // Obtener el contexto del canvas
      const ctx = chartRef.current?.getContext("2d")
      if (!ctx) return

      // Preparar los datos para el gráfico
      const labels = results.domain_results.map((domain) => domain.domain_name)
      const scores = results.domain_results.map((domain) => domain.score)

      // Configurar colores
      const backgroundColors = results.domain_results.map((domain) => getColorForScore(domain.score, 0.2))
      const borderColors = results.domain_results.map((domain) => getColorForScore(domain.score, 1))

      // Crear el gráfico según el tipo
      if (type === "radar") {
        chartInstanceRef.current = new Chart(ctx, {
          type: "radar",
          data: {
            labels,
            datasets: [
              {
                label: "Nivel de Madurez",
                data: scores,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(75, 192, 192, 1)",
              },
            ],
          },
          options: {
            scales: {
              r: {
                angleLines: {
                  display: true,
                },
                suggestedMin: 0,
                suggestedMax: 5,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => `Nivel: ${context.raw}/5`,
                },
              },
            },
          },
        })
      } else if (type === "bar") {
        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Nivel de Madurez",
                data: scores,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => `Nivel: ${context.raw}/5`,
                },
              },
            },
          },
        })
      } else if (type === "line") {
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Nivel de Madurez",
                data: scores,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                tension: 0.1,
                fill: true,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => `Nivel: ${context.raw}/5`,
                },
              },
            },
          },
        })
      }
    }

    loadChart()

    // Limpiar al desmontar
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [results, type])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Madurez</CardTitle>
        <CardDescription>Visualización del nivel de madurez por dominio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] flex items-center justify-center">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  )
}

// Función para obtener color según la puntuación
function getColorForScore(score: number, alpha: number): string {
  if (score < 1.5) return `rgba(239, 68, 68, ${alpha})` // red-500
  if (score < 2.5) return `rgba(249, 115, 22, ${alpha})` // orange-500
  if (score < 3.5) return `rgba(234, 179, 8, ${alpha})` // yellow-500
  if (score < 4.5) return `rgba(59, 130, 246, ${alpha})` // blue-500
  return `rgba(34, 197, 94, ${alpha})` // green-500
}
