"use client"

import type React from "react"
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"
import type { EvaluationResult } from "@/types/database"

// Registrar fuentes
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium.ttf", fontWeight: 500 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold.ttf", fontWeight: 700 },
  ],
})

// Crear estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 5,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
    color: "#111827",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 5,
  },
  chart: {
    width: "100%",
    height: 250,
    marginVertical: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: 700,
    padding: 8,
    fontSize: 12,
    color: "#111827",
  },
  tableCell: {
    padding: 8,
    fontSize: 12,
    color: "#374151",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  col20: {
    width: "20%",
  },
  col30: {
    width: "30%",
  },
  col40: {
    width: "40%",
  },
  col50: {
    width: "50%",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
    paddingTop: 10,
  },
  recommendations: {
    marginTop: 10,
  },
  recommendation: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 5,
    color: "#111827",
  },
  recommendationText: {
    fontSize: 12,
    color: "#374151",
  },
  maturityLevel: {
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
  },
  level1: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  level2: {
    backgroundColor: "#ffedd5",
    color: "#c2410c",
  },
  level3: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
  },
  level4: {
    backgroundColor: "#d1fae5",
    color: "#047857",
  },
  level5: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
})

// Función para obtener el estilo del nivel de madurez
const getMaturityLevelStyle = (score: number) => {
  if (score < 1.5) return styles.level1
  if (score < 2.5) return styles.level2
  if (score < 3.5) return styles.level3
  if (score < 4.5) return styles.level4
  return styles.level5
}

// Función para obtener el nombre del nivel de madurez
const getMaturityLevelName = (score: number): string => {
  if (score < 1.5) return "Inicial"
  if (score < 2.5) return "Repetible"
  if (score < 3.5) return "Definido"
  if (score < 4.5) return "Gestionado"
  return "Optimizado"
}

interface EvaluationPdfDocumentProps {
  data: {
    results: EvaluationResult
    evaluationHistory?: any[]
    sectorComparison?: any
    previousResults?: EvaluationResult
    generatedAt: string
  }
  radarChartUrl: string | null
  barChartUrl: string | null
}

export const EvaluationPdfDocument: React.FC<EvaluationPdfDocumentProps> = ({ data, radarChartUrl, barChartUrl }) => {
  const { results, generatedAt } = data
  const formattedDate = new Date(generatedAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Informe de Evaluación de Madurez</Text>
              <Text style={styles.subtitle}>Generado el {formattedDate}</Text>
            </View>
            <Image src="/placeholder-wllms.png" style={styles.logo} />
          </View>
        </View>

        {/* Información general */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información General</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Empresa</Text>
              <Text style={styles.value}>{results.company_name}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Fecha de Evaluación</Text>
              <Text style={styles.value}>{new Date(results.evaluation_date).toLocaleDateString("es-ES")}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Sector</Text>
              <Text style={styles.value}>{results.sector || "No especificado"}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Evaluador</Text>
              <Text style={styles.value}>{results.evaluator_name || "No especificado"}</Text>
            </View>
          </View>
        </View>

        {/* Resumen de resultados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Resultados</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Nivel de Madurez General</Text>
              <View style={[styles.maturityLevel, getMaturityLevelStyle(results.overall_score)]}>
                <Text>
                  {results.overall_score.toFixed(2)}/5 - {getMaturityLevelName(results.overall_score)}
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Progreso de la Evaluación</Text>
              <Text style={styles.value}>{results.progress}% completado</Text>
            </View>
          </View>
        </View>

        {/* Gráfico de Radar */}
        {radarChartUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gráfico de Radar</Text>
            <Image src={radarChartUrl || "/placeholder.svg"} style={styles.chart} />
          </View>
        )}

        {/* Gráfico de Barras */}
        {barChartUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gráfico de Barras</Text>
            <Image src={barChartUrl || "/placeholder.svg"} style={styles.chart} />
          </View>
        )}

        {/* Resultados por Dominio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resultados por Dominio</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, { backgroundColor: "#f3f4f6" }]}>
              <Text style={[styles.tableHeader, styles.col40]}>Dominio</Text>
              <Text style={[styles.tableHeader, styles.col30]}>Nivel</Text>
              <Text style={[styles.tableHeader, styles.col30]}>Puntuación</Text>
            </View>
            {results.domain_results.map((domain, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col40]}>{domain.domain_name}</Text>
                <Text style={[styles.tableCell, styles.col30]}>{domain.maturity_level}</Text>
                <Text style={[styles.tableCell, styles.col30]}>{domain.score.toFixed(2)}/5</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recomendaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones Principales</Text>
          <View style={styles.recommendations}>
            {results.domain_results
              .sort((a, b) => a.score - b.score)
              .slice(0, 3)
              .map((domain, index) => (
                <View key={index} style={styles.recommendation}>
                  <Text style={styles.recommendationTitle}>{domain.domain_name}</Text>
                  <Text style={styles.recommendationText}>
                    Nivel actual: {domain.score.toFixed(2)}/5 ({domain.maturity_level})
                  </Text>
                  <Text style={styles.recommendationText}>
                    Recomendación: Implementar controles y procesos para mejorar el nivel de madurez en este dominio.
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer} fixed>
          <Text>© {new Date().getFullYear()} C4A Cybersecurity For All - Informe de Evaluación de Madurez</Text>
          <Text style={{ marginTop: 5 }}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  )
}
