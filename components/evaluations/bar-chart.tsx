"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EvaluationResult } from "@/types/database"

interface BarChartProps {
  results: EvaluationResult
}

export function BarChart({ results }: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Importar Chart.js dinámicamente para evitar problemas de SSR
    const loadChart = async () => {
      const { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } = await import("chart.js")

      // Registrar los componentes necesarios
      Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

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
      const colors = results.domain_results.map((domain) => getColorForScore(domain.score))

      // Crear el gráfico
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Nivel de Madurez",
              data: scores,
              backgroundColor: colors,
              borderColor: colors.map((color) => color.replace("0.7", "1")),
              borderWidth: 1,
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
                label: (context) => `Nivel: ${context.raw}/5`,
                afterLabel: (context) => {
                  const index = context.dataIndex
                  const domain = results.domain_results[index]
                  return `Nivel de madurez: ${domain.maturity_level}`
                },
              },
            },
          },
        },
      })
    }

    loadChart()

    // Limpiar al desmontar
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [results])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles de Madurez por Dominio</CardTitle>
        <CardDescription>Comparación de niveles de madurez entre dominios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px] flex items-center justify-center">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  )
}

// Función para obtener color según la puntuación
function getColorForScore(score: number): string {
  if (score < 1.5) return "rgba(239, 68, 68, 0.7)" // red-500
  if (score < 2.5) return "rgba(249, 115, 22, 0.7)" // orange-500
  if (score < 3.5) return "rgba(234, 179, 8, 0.7)" // yellow-500
  if (score < 4.5) return "rgba(59, 130, 246, 0.7)" // blue-500
  return "rgba(34, 197, 94, 0.7)" // green-500
}
