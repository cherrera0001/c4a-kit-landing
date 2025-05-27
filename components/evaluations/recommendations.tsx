import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EvaluationResult, DomainResult } from "@/types/database"

interface RecommendationsProps {
  results: EvaluationResult
}

export function Recommendations({ results }: RecommendationsProps) {
  // Ordenar dominios por puntuación (de menor a mayor)
  const sortedDomains = [...results.domain_results].sort((a, b) => a.score - b.score)

  // Tomar los 3 dominios con menor puntuación
  const priorityDomains = sortedDomains.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recomendaciones de Mejora</CardTitle>
        <CardDescription>Áreas prioritarias y acciones recomendadas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Áreas Prioritarias</h3>
          <div className="space-y-4">
            {priorityDomains.map((domain) => (
              <RecommendationCard key={domain.domain_id} domain={domain} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Recomendación General</h3>
          <p className="text-sm text-muted-foreground">{getGeneralRecommendation(results.overall_score)}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Próximos Pasos</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Desarrollar un plan de acción para las áreas prioritarias identificadas</li>
            <li>Establecer métricas y objetivos claros para cada área de mejora</li>
            <li>Asignar responsables y plazos para las acciones recomendadas</li>
            <li>Programar una evaluación de seguimiento en 6-12 meses</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para mostrar recomendaciones por dominio
function RecommendationCard({ domain }: { domain: DomainResult }) {
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

  // Obtener recomendaciones específicas para el dominio
  const recommendations = getDomainRecommendations(domain.domain_name, domain.score)

  return (
    <Card className="border border-muted">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{domain.domain_name}</CardTitle>
          <Badge variant={getMaturityBadgeVariant(domain.score)}>{domain.maturity_level}</Badge>
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

// Función para obtener recomendaciones generales basadas en la puntuación general
function getGeneralRecommendation(score: number): string {
  if (score < 1.5) {
    return "La organización se encuentra en una etapa inicial de madurez en ciberseguridad. Es recomendable establecer políticas y procedimientos básicos, así como implementar controles fundamentales para proteger los activos más críticos. Considere obtener apoyo externo para desarrollar un programa de seguridad básico."
  } else if (score < 2.5) {
    return "La organización ha establecido algunos procesos de seguridad, pero estos son principalmente reactivos. Es recomendable formalizar las prácticas existentes, implementar controles más robustos y comenzar a desarrollar un enfoque proactivo hacia la seguridad. Considere realizar evaluaciones de riesgo periódicas."
  } else if (score < 3.5) {
    return "La organización cuenta con procesos de seguridad definidos, pero puede haber inconsistencias en su implementación. Es recomendable estandarizar las prácticas de seguridad en toda la organización, mejorar la medición de la efectividad de los controles y desarrollar un programa de concienciación más robusto."
  } else if (score < 4.5) {
    return "La organización tiene un programa de seguridad maduro con procesos bien definidos y medidos. Es recomendable enfocarse en la optimización continua, la automatización de procesos y el desarrollo de métricas avanzadas para medir la efectividad del programa de seguridad."
  } else {
    return "La organización tiene un programa de seguridad altamente maduro. Es recomendable mantener el enfoque en la mejora continua, explorar tecnologías emergentes y compartir mejores prácticas con la industria. Considere implementar técnicas avanzadas de análisis predictivo para anticipar amenazas futuras."
  }
}

// Función para obtener recomendaciones específicas por dominio
function getDomainRecommendations(domain: string, score: number): string[] {
  // Recomendaciones para nivel Inicial (score < 1.5)
  if (score < 1.5) {
    switch (domain) {
      case "Gobierno de Ciberseguridad":
        return [
          "Desarrollar una política básica de seguridad de la información",
          "Asignar responsabilidades de seguridad a personal clave",
          "Establecer un inventario de activos de información críticos",
        ]
      case "Gestión de Riesgos":
        return [
          "Implementar un proceso básico de identificación de riesgos",
          "Documentar los principales riesgos de seguridad",
          "Establecer controles básicos para los riesgos más críticos",
        ]
      case "Seguridad de Aplicaciones":
        return [
          "Implementar prácticas básicas de desarrollo seguro",
          "Realizar pruebas de seguridad en aplicaciones críticas",
          "Establecer requisitos mínimos de seguridad para nuevas aplicaciones",
        ]
      case "Seguridad de Infraestructura":
        return [
          "Implementar controles básicos de seguridad en la red",
          "Establecer un proceso de gestión de parches",
          "Implementar controles de acceso básicos",
        ]
      case "Gestión de Incidentes":
        return [
          "Desarrollar un plan básico de respuesta a incidentes",
          "Establecer un proceso para reportar incidentes de seguridad",
          "Definir roles y responsabilidades para la respuesta a incidentes",
        ]
      default:
        return [
          "Documentar procesos básicos relacionados con este dominio",
          "Asignar responsabilidades claras al personal",
          "Implementar controles fundamentales de seguridad",
        ]
    }
  }

  // Recomendaciones para nivel Repetible (score < 2.5)
  else if (score < 2.5) {
    switch (domain) {
      case "Gobierno de Ciberseguridad":
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
      case "Seguridad de Aplicaciones":
        return [
          "Integrar seguridad en el ciclo de vida de desarrollo",
          "Implementar revisiones de código para aplicaciones críticas",
          "Establecer estándares de codificación segura",
        ]
      case "Seguridad de Infraestructura":
        return [
          "Implementar segmentación de red",
          "Mejorar la gestión de configuraciones",
          "Establecer un proceso de gestión de vulnerabilidades",
        ]
      case "Gestión de Incidentes":
        return [
          "Formalizar el proceso de respuesta a incidentes",
          "Implementar herramientas básicas de detección",
          "Realizar simulacros básicos de respuesta a incidentes",
        ]
      default:
        return [
          "Formalizar y documentar los procesos de este dominio",
          "Implementar controles de seguridad más robustos",
          "Establecer métricas básicas para medir la efectividad",
        ]
    }
  }

  // Recomendaciones para nivel Definido (score < 3.5)
  else if (score < 3.5) {
    switch (domain) {
      case "Gobierno de Ciberseguridad":
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
      case "Seguridad de Aplicaciones":
        return [
          "Implementar pruebas de seguridad automatizadas",
          "Establecer un programa de gestión de dependencias",
          "Desarrollar requisitos de seguridad específicos por tipo de aplicación",
        ]
      case "Seguridad de Infraestructura":
        return [
          "Implementar monitoreo de seguridad continuo",
          "Establecer líneas base de configuración segura",
          "Mejorar los controles de acceso privilegiado",
        ]
      case "Gestión de Incidentes":
        return [
          "Implementar capacidades de detección avanzadas",
          "Establecer procesos de análisis post-incidente",
          "Desarrollar playbooks para tipos comunes de incidentes",
        ]
      default:
        return [
          "Estandarizar los procesos de este dominio",
          "Integrar los controles con otros dominios de seguridad",
          "Implementar métricas más avanzadas para medir la efectividad",
        ]
    }
  }

  // Recomendaciones para nivel Gestionado (score < 4.5)
  else if (score < 4.5) {
    switch (domain) {
      case "Gobierno de Ciberseguridad":
        return [
          "Implementar un programa de métricas avanzadas",
          "Establecer objetivos cuantitativos de mejora",
          "Desarrollar un programa de gestión de proveedores",
        ]
      case "Gestión de Riesgos":
        return [
          "Implementar análisis cuantitativo de riesgos",
          "Desarrollar modelos predictivos de riesgo",
          "Integrar la gestión de riesgos con la estrategia empresarial",
        ]
      case "Seguridad de Aplicaciones":
        return [
          "Implementar DevSecOps",
          "Establecer un programa de recompensas por vulnerabilidades",
          "Desarrollar capacidades avanzadas de análisis de código",
        ]
      case "Seguridad de Infraestructura":
        return [
          "Implementar Zero Trust Architecture",
          "Establecer capacidades avanzadas de detección y respuesta",
          "Desarrollar automatización de respuesta a amenazas",
        ]
      case "Gestión de Incidentes":
        return [
          "Implementar threat hunting proactivo",
          "Establecer un centro de operaciones de seguridad (SOC)",
          "Desarrollar capacidades de inteligencia de amenazas",
        ]
      default:
        return [
          "Implementar métricas avanzadas para medir la efectividad",
          "Establecer objetivos cuantitativos de mejora",
          "Realizar análisis predictivo basado en datos históricos",
        ]
    }
  }

  // Recomendaciones para nivel Optimizado (score >= 4.5)
  else {
    return [
      "Implementar mejora continua basada en análisis de datos",
      "Adoptar tecnologías emergentes para optimizar procesos",
      "Compartir mejores prácticas con la industria",
      "Desarrollar capacidades de anticipación a amenazas futuras",
    ]
  }
}
