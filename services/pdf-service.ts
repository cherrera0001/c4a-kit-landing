import type { EvaluationResult } from "@/types/database"

// Función para preparar los datos para el PDF
export async function preparePdfData(evaluationId: string) {
  try {
    // Importar dinámicamente para evitar problemas de SSR
    const { calculateEvaluationResults, getCompanyEvaluationHistory, getSectorComparison } = await import(
      "./evaluation-results-service"
    )

    // Obtener los resultados de la evaluación
    const results = await calculateEvaluationResults(evaluationId)

    // Obtener el historial de evaluaciones para la empresa
    const evaluationHistory = await getCompanyEvaluationHistory(results.company_name)

    // Obtener comparación con el sector
    const sectorComparison = await getSectorComparison(evaluationId)

    // Obtener la evaluación anterior (si existe)
    const previousResults =
      evaluationHistory.length > 1
        ? await calculateEvaluationResults(evaluationHistory.filter((e) => e.id !== evaluationId)[0].id)
        : undefined

    // Preparar los datos para el PDF
    return {
      results,
      evaluationHistory,
      sectorComparison,
      previousResults,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error al preparar datos para PDF:", error)
    throw new Error("No se pudieron preparar los datos para el PDF")
  }
}

// Función para generar la URL de la imagen del gráfico de radar
export async function generateChartImageUrl(results: EvaluationResult) {
  try {
    // Aquí normalmente usaríamos una API de generación de gráficos como QuickChart.io
    const domainNames = results.domain_results.map((domain) => domain.domain_name)
    const scores = results.domain_results.map((domain) => domain.score)

    // Crear URL para QuickChart.io (servicio gratuito para generar gráficos)
    const chartData = {
      type: "radar",
      data: {
        labels: domainNames,
        datasets: [
          {
            label: "Nivel de Madurez",
            data: scores,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      options: {
        scale: {
          ticks: {
            beginAtZero: true,
            max: 5,
          },
        },
      },
    }

    // Codificar el objeto de configuración como JSON y luego como URL
    const chartConfig = encodeURIComponent(JSON.stringify(chartData))
    return `https://quickchart.io/chart?c=${chartConfig}`
  } catch (error) {
    console.error("Error al generar URL de imagen del gráfico:", error)
    return null
  }
}

// Función para generar la URL de la imagen del gráfico de barras
export async function generateBarChartImageUrl(results: EvaluationResult) {
  try {
    const domainNames = results.domain_results.map((domain) => domain.domain_name)
    const scores = results.domain_results.map((domain) => domain.score)

    // Crear URL para QuickChart.io
    const chartData = {
      type: "bar",
      data: {
        labels: domainNames,
        datasets: [
          {
            label: "Nivel de Madurez",
            data: scores,
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
          },
        },
      },
    }

    // Codificar el objeto de configuración como JSON y luego como URL
    const chartConfig = encodeURIComponent(JSON.stringify(chartData))
    return `https://quickchart.io/chart?c=${chartConfig}`
  } catch (error) {
    console.error("Error al generar URL de imagen del gráfico de barras:", error)
    return null
  }
}

// Nueva función para generar el PDF como blob
export async function generatePdfBlob(evaluationId: string) {
  try {
    // Preparar los datos
    const pdfData = await preparePdfData(evaluationId)

    // Generar URLs de gráficos
    const radarChartUrl = await generateChartImageUrl(pdfData.results)
    const barChartUrl = await generateBarChartImageUrl(pdfData.results)

    // Importar dinámicamente react-pdf
    const { pdf } = await import("@react-pdf/renderer")
    const { EvaluationPdfDocument } = await import("@/components/pdf/evaluation-pdf-document")

    // Crear el documento PDF
    const blob = await pdf(
      <EvaluationPdfDocument data={pdfData} radarChartUrl={radarChartUrl} barChartUrl={barChartUrl} />,
    ).toBlob()

    return blob
  } catch (error) {
    console.error("Error al generar PDF:", error)
    throw new Error("No se pudo generar el PDF")
  }
}
