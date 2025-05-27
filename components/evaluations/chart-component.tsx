"use client"

import { useEffect, useRef, useState } from "react"

interface ChartComponentProps {
  evaluations: any[]
  selectedDomain: string
}

export default function ChartComponent({ evaluations, selectedDomain }: ChartComponentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar que estamos en el navegador
    if (typeof window === "undefined") return

    const loadChart = async () => {
      try {
        // Importar Chart.js dinámicamente
        const ChartModule = await import("chart.js")
        const { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } = ChartModule

        // Registrar los componentes necesarios
        Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

        // Destruir el gráfico anterior si existe
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        // Obtener el contexto del canvas
        const ctx = chartRef.current?.getContext("2d")
        if (!ctx) {
          setError("No se pudo obtener el contexto del canvas")
          return
        }

        // Preparar los datos para el gráfico
        const labels = evaluations.map(
          (evaluation) => evaluation.evaluation_name || `Evaluación ${evaluation.evaluation_id?.substring(0, 8) || ""}`,
        )

        // Datasets basados en el dominio seleccionado
        const datasets = []

        if (selectedDomain === "all") {
          // Mostrar puntuación general para todas las evaluaciones
          datasets.push({
            label: "Puntuación General",
            data: evaluations.map((evaluation) => evaluation.overall_score),
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          })
        } else {
          // Mostrar puntuación para el dominio seleccionado
          datasets.push({
            label: selectedDomain,
            data: evaluations.map((evaluation) => {
              const domainResult = evaluation.domain_results?.find((d: any) => d.domain_name === selectedDomain)
              return domainResult ? domainResult.score : 0
            }),
            backgroundColor: "rgba(153, 102, 255, 0.7)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          })
        }

        // Crear el gráfico
        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets,
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                title: {
                  display: true,
                  text: "Nivel de Madurez (1-5)",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Evaluaciones",
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (context: any) => `Nivel: ${context.raw}/5`,
                  afterLabel: (context: any) => {
                    const index = context.dataIndex
                    const evaluation = evaluations[index]
                    return `Empresa: ${evaluation.company_name || "No especificada"}`
                  },
                },
              },
            },
          },
        })
      } catch (err) {
        console.error("Error al cargar el gráfico:", err)
        setError(`Error al cargar el gráfico: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    loadChart()

    // Limpiar al desmontar
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [evaluations, selectedDomain])

  if (error) {
    return <div className="flex items-center justify-center h-[350px] text-red-500">{error}</div>
  }

  return (
    <div className="w-full h-[350px] flex items-center justify-center">
      <canvas ref={chartRef} />
    </div>
  )
}
