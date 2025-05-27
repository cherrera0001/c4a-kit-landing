"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { EvaluationResult, DomainResult } from "@/types/database"

interface MaturityResultsProps {
  results: EvaluationResult
}

export function MaturityResults({ results }: MaturityResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados de Madurez</CardTitle>
        <CardDescription>
          Evaluación: {results.evaluation_name} | Empresa: {results.company_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="domains">Por Dominios</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Nivel de Madurez General</h3>
                <Badge variant={getMaturityBadgeVariant(results.overall_score)}>
                  {getMaturityLevelName(results.overall_score)}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Puntuación: {results.overall_score} / 5</span>
                  <span>Progreso: {results.progress}%</span>
                </div>
                <Progress
                  value={getScorePercentage(results.overall_score)}
                  className={`h-2 ${getMaturityColor(results.overall_score)}`}
                />
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Resumen por Dominios</h4>
                <div className="space-y-3">
                  {results.domain_results.map((domain) => (
                    <div key={domain.domain_id} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span>{domain.domain_name}</span>
                        <span className="font-medium">{domain.score} / 5</span>
                      </div>
                      <Progress
                        value={getScorePercentage(domain.score)}
                        className={`h-1.5 ${getMaturityColor(domain.score)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="domains" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {results.domain_results.map((domain) => (
                <DomainResultCard key={domain.domain_id} domain={domain} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Basado en los resultados de la evaluación, se recomiendan las siguientes acciones para mejorar el nivel
                de madurez:
              </p>

              {results.domain_results
                .filter((domain) => domain.score < 3.5)
                .map((domain) => (
                  <RecommendationsCard key={domain.domain_id} domain={domain} />
                ))}

              {results.domain_results.filter((domain) => domain.score < 3.5).length === 0 && (
                <p className="text-sm italic">
                  ¡Felicidades! Todos los dominios tienen un nivel de madurez adecuado. Continúe con las buenas
                  prácticas y considere mejoras incrementales.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Componente para mostrar el resultado de un dominio
function DomainResultCard({ domain }: { domain: DomainResult }) {
  const getMaturityColor = (score: number) => {
    if (score < 1.5) return "bg-red-500"
    if (score < 2.5) return "bg-orange-500"
    if (score < 3.5) return "bg-yellow-500"
    if (score < 4.5) return "bg-blue-500"
    return "bg-green-500"
  }

  const getScorePercentage = (score: number) => {
    return (score / 5) * 100
  }

  const getMaturityBadgeVariant = (
    score: number,
  ): "default" | "destructive" | "outline" | "secondary" | "success" | "warning" => {
    if (score < 1.5) return "destructive"
    if (score < 2.5) return "warning"
    if (score < 3.5) return "secondary"
    if (score < 4.5) return "default"
    return "success"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{domain.domain_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Nivel de Madurez:</span>
          <Badge variant={getMaturityBadgeVariant(domain.score)}>{domain.maturity_level}</Badge>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Puntuación: {domain.score} / 5</span>
            <span>
              {domain.answered_questions} / {domain.total_questions} preguntas
            </span>
          </div>
          <Progress value={getScorePercentage(domain.score)} className={`h-2 ${getMaturityColor(domain.score)}`} />
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para mostrar recomendaciones por dominio
function RecommendationsCard({ domain }: { domain: DomainResult }) {
  // Recomendaciones genéricas basadas en el nivel de madurez
  const getRecommendations = (domainName: string, score: number) => {
    if (score < 1.5) {
      return getInitialRecommendations(domainName)
    } else if (score < 2.5) {
      return getManagedRecommendations(domainName)
    } else if (score < 3.5) {
      return getDefinedRecommendations(domainName)
    } else if (score < 4.5) {
      return getQuantifiedRecommendations(domainName)
    } else {
      return getOptimizedRecommendations(domainName)
    }
  }

  const recommendations = getRecommendations(domain.domain_name, domain.score)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{domain.domain_name}</CardTitle>
          <Badge variant={domain.score < 1.5 ? "destructive" : domain.score < 2.5 ? "warning" : "secondary"}>
            {domain.maturity_level}
          </Badge>
        </div>
        <CardDescription>Puntuación: {domain.score} / 5</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 list-disc pl-5 text-sm">
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Función para obtener el nombre del nivel de madurez
function getMaturityLevelName(score: number): string {
  if (score < 1.5) return "Inicial"
  if (score < 2.5) return "Gestionado"
  if (score < 3.5) return "Definido"
  if (score < 4.5) return "Cuantificado"
  return "Optimizado"
}

// Funciones para generar recomendaciones según el nivel de madurez
function getInitialRecommendations(domain: string): string[] {
  switch (domain) {
    case "Gobierno de Seguridad":
      return [
        "Desarrollar una política básica de seguridad de la información",
        "Asignar responsabilidades de seguridad a personal clave",
        "Establecer un inventario de activos de información críticos",
      ]
    case "Gestión de Riesgos":
      return [
        "Implementar un proceso básico de identificación de riesgos",
        "Documentar los principales riesgos de seguridad",
        "Establecer controles b��sicos para los riesgos más críticos",
      ]
    case "Control de Acceso":
      return [
        "Implementar una política básica de control de acceso",
        "Establecer procesos de gestión de cuentas de usuario",
        "Implementar contraseñas seguras y autenticación básica",
      ]
    default:
      return [
        "Documentar procesos básicos relacionados con este dominio",
        "Asignar responsabilidades claras al personal",
        "Implementar controles fundamentales de seguridad",
      ]
  }
}

function getManagedRecommendations(domain: string): string[] {
  switch (domain) {
    case "Gobierno de Seguridad":
      return [
        "Formalizar el programa de seguridad de la información",
        "Establecer un comité de seguridad con reuniones periódicas",
        "Desarrollar métricas básicas para medir la efectividad",
      ]
    case "Gestión de Riesgos":
      return [
        "Implementar un proceso formal de evaluación de riesgos",
        "Establecer criterios de aceptación de riesgos",
        "Desarrollar planes de tratamiento para riesgos identificados",
      ]
    case "Control de Acceso":
      return [
        "Implementar el principio de privilegio mínimo",
        "Establecer procesos de revisión periódica de accesos",
        "Mejorar los mecanismos de autenticación",
      ]
    default:
      return [
        "Formalizar y documentar los procesos de este dominio",
        "Implementar controles de seguridad más robustos",
        "Establecer métricas básicas para medir la efectividad",
      ]
  }
}

function getDefinedRecommendations(domain: string): string[] {
  switch (domain) {
    case "Gobierno de Seguridad":
      return [
        "Alinear el programa de seguridad con estándares internacionales",
        "Implementar un proceso de gestión de excepciones",
        "Desarrollar un programa de concienciación en seguridad",
      ]
    case "Gestión de Riesgos":
      return [
        "Integrar la gestión de riesgos con los procesos de negocio",
        "Implementar indicadores clave de riesgo (KRIs)",
        "Establecer revisiones periódicas del programa de gestión de riesgos",
      ]
    case "Control de Acceso":
      return [
        "Implementar autenticación multifactor para accesos críticos",
        "Establecer segregación de funciones para roles críticos",
        "Automatizar los procesos de gestión de accesos",
      ]
    default:
      return [
        "Estandarizar los procesos de este dominio",
        "Integrar los controles con otros dominios de seguridad",
        "Implementar métricas más avanzadas para medir la efectividad",
      ]
  }
}

function getQuantifiedRecommendations(domain: string): string[] {
  return [
    "Implementar métricas avanzadas para medir la efectividad",
    "Establecer objetivos cuantitativos de mejora",
    "Realizar análisis predictivo basado en datos históricos",
  ]
}

function getOptimizedRecommendations(domain: string): string[] {
  return [
    "Implementar mejora continua basada en análisis de datos",
    "Adoptar tecnologías emergentes para optimizar procesos",
    "Compartir mejores prácticas con la industria",
  ]
}
