"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EvaluationResult } from "@/types/database"

interface RadarChartProps {
  results: EvaluationResult
}

export function RadarChart({ results }: RadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Importar Chart.js dinámicamente para evitar problemas de SSR
    const loadChart = async () => {
      const { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } = await import("chart.js")

      // Registrar los componentes necesarios
      Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

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

      // Crear el gráfico
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
              display: true,
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => `Nivel: ${context.raw}/5`,
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
        <CardTitle>Gráfico de Madurez por Dominio</CardTitle>
        <CardDescription>Visualización del nivel de madurez en cada área evaluada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px] flex items-center justify-center">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  )
}
