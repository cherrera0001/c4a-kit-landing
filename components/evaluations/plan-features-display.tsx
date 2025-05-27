"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface PlanFeaturesProps {
  evaluationId: string
}

interface PlanInfo {
  id: string
  nombre_kit: string
  descripcion: string
  nivel_max_preguntas: number
  permite_pdf_detallado: boolean
  permite_comparativa_industria: boolean
  permite_recomendaciones_personalizadas: boolean
  max_usuarios: number
  precio_mensual: number | null
}

export function PlanFeaturesDisplay({ evaluationId }: PlanFeaturesProps) {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlanInfo() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/subscriptions/plan-info?evaluationId=${evaluationId}`)

        if (!response.ok) {
          throw new Error("Error al obtener información del plan")
        }

        const data = await response.json()
        setPlanInfo(data)
      } catch (err) {
        console.error("Error:", err)
        setError("No se pudo cargar la información del plan")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlanInfo()
  }, [evaluationId])

  if (isLoading) {
    return <div className="p-4 text-center">Cargando información del plan...</div>
  }

  if (error || !planInfo) {
    return <div className="p-4 text-center text-red-500">{error || "No se encontró información del plan"}</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{planInfo.nombre_kit}</CardTitle>
            <CardDescription>{planInfo.descripcion}</CardDescription>
          </div>
          {planInfo.precio_mensual ? (
            <Badge variant="outline">${planInfo.precio_mensual}/mes</Badge>
          ) : (
            <Badge>Personalizado</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Nivel de diagnóstico</span>
            <Badge variant="secondary">Nivel {planInfo.nivel_max_preguntas}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Informes detallados en PDF</span>
            {planInfo.permite_pdf_detallado ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span>Comparativa con la industria</span>
            {planInfo.permite_comparativa_industria ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span>Recomendaciones personalizadas</span>
            {planInfo.permite_recomendaciones_personalizadas ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span>Usuarios máximos</span>
            <Badge variant="outline">{planInfo.max_usuarios}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
