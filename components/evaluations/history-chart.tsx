"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HistoryChartProps {
  evaluationHistory: any[]
}

export function HistoryChart({ evaluationHistory }: HistoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Importar Chart.js dinámicamente para evitar problemas de SSR
    const loadChart = async () => {
      const { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } = await import("chart.js")

      // Registrar los componentes necesarios
      Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

      // Destruir el gráfico anterior si existe
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      // Obtener el contexto del canvas
      const ctx = chartRef.current?.getContext("2d")
      if (!ctx) return

      // Ordenar evaluaciones por fecha
      const sortedHistory = [...evaluationHistory].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )

      // Preparar los datos para el gráfico
      const labels = sortedHistory.map((evaluation) => {
        const date = new Date(evaluation.created_at)
        return date.toLocaleDateString()
      })

      const scores = sortedHistory.map((evaluation) => evaluation.score || 0)

      // Crear el gráfico
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Puntuación de Madurez",
              data: scores,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointBorderColor: "#fff",
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
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
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => `Puntuación: ${context.raw}/5`,
                afterLabel: (context) => {
                  const index = context.dataIndex
                  const evaluation = sortedHistory[index]
                  return `Progreso: ${evaluation.progress}%`
                },
              },
            },
          },
        },
      })
    }

    if (evaluationHistory && evaluationHistory.length > 0) {
      loadChart()
    }

    // Limpiar al desmontar
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [evaluationHistory])

  if (!evaluationHistory || evaluationHistory.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución Histórica</CardTitle>
          <CardDescription>Historial de evaluaciones de madurez</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            No hay suficientes evaluaciones para mostrar la evolución histórica.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución Histórica</CardTitle>
        <CardDescription>Progreso de madurez a lo largo del tiempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px] flex items-center justify-center">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  )
}
