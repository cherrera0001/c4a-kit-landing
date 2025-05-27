"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EvaluationResult } from "@/types/database"

interface HeatmapChartProps {
  results: EvaluationResult
}

export function HeatmapChart({ results }: HeatmapChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Importar Chart.js dinámicamente para evitar problemas de SSR
    const loadChart = async () => {
      const { Chart, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } = await import("chart.js")
      const { MatrixController, MatrixElement } = await import("chartjs-chart-matrix")

      // Registrar los componentes necesarios
      Chart.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, MatrixController, MatrixElement)

      // Destruir el gráfico anterior si existe
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      // Obtener el contexto del canvas
      const ctx = chartRef.current?.getContext("2d")
      if (!ctx) return

      // Preparar los datos para el mapa de calor
      const domains = results.domain_results.map((domain) => domain.domain_name)

      // Crear datos para el mapa de calor
      const data = []

      // Para cada dominio, crear un punto en el mapa de calor
      for (let i = 0; i < domains.length; i++) {
        const domain = results.domain_results[i]
        data.push({
          x: i,
          y: 0,
          v: domain.score,
          domain: domain.domain_name,
          level: domain.maturity_level,
        })
      }

      // Función para obtener color según la puntuación
      const getColor = (score: number) => {
        if (score < 1.5) return "rgba(239, 68, 68, 0.7)" // red-500
        if (score < 2.5) return "rgba(249, 115, 22, 0.7)" // orange-500
        if (score < 3.5) return "rgba(234, 179, 8, 0.7)" // yellow-500
        if (score < 4.5) return "rgba(59, 130, 246, 0.7)" // blue-500
        return "rgba(34, 197, 94, 0.7)" // green-500
      }

      // Crear el gráfico
      chartInstanceRef.current = new Chart(ctx, {
        type: "matrix",
        data: {
          datasets: [
            {
              label: "Nivel de Madurez por Dominio",
              data: data,
              backgroundColor: (context) => {
                const value = context.dataset.data[context.dataIndex].v
                return getColor(value)
              },
              borderColor: "white",
              borderWidth: 2,
              width: ({ chart }) => (chart.chartArea || {}).width / domains.length - 4,
              height: 60,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "category",
              labels: domains,
              offset: true,
              ticks: {
                display: true,
                maxRotation: 45,
                minRotation: 45,
              },
              grid: {
                display: false,
              },
            },
            y: {
              type: "category",
              labels: ["Nivel de Madurez"],
              offset: true,
              ticks: {
                display: true,
              },
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: () => "",
                label: (context) => {
                  const data = context.dataset.data[context.dataIndex]
                  return [`Dominio: ${data.domain}`, `Nivel: ${data.v.toFixed(2)}/5`, `Madurez: ${data.level}`]
                },
              },
            },
          },
        },
      })
    }

    loadChart().catch(console.error)

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
        <CardTitle>Mapa de Calor de Madurez</CardTitle>
        <CardDescription>Visualización de áreas críticas y fortalezas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[150px] flex items-center justify-center">
          <canvas ref={chartRef} />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-red-500 rounded-sm"></div>
            <span className="text-xs">Inicial</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-orange-500 rounded-sm"></div>
            <span className="text-xs">Repetible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-yellow-500 rounded-sm"></div>
            <span className="text-xs">Definido</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-blue-500 rounded-sm"></div>
            <span className="text-xs">Gestionado</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-green-500 rounded-sm"></div>
            <span className="text-xs">Optimizado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
