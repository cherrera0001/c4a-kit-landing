"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FeatureAvailabilityProps {
  evaluationId: string
  feature: "pdf_detallado" | "comparativa_industria" | "recomendaciones_personalizadas"
  children: React.ReactNode
  fallbackMessage?: string
  upgradePlanUrl?: string
}

export function FeatureAvailabilityCheck({
  evaluationId,
  feature,
  children,
  fallbackMessage = "Esta característica no está disponible en tu plan actual.",
  upgradePlanUrl = "/precios",
}: FeatureAvailabilityProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAvailability() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/subscriptions/check-feature?evaluationId=${evaluationId}&feature=${feature}`)

        if (!response.ok) {
          throw new Error("Error al verificar disponibilidad de característica")
        }

        const data = await response.json()
        setIsAvailable(data.available)
      } catch (err) {
        console.error("Error:", err)
        setError("No se pudo verificar la disponibilidad de esta característica")
      } finally {
        setIsLoading(false)
      }
    }

    checkAvailability()
  }, [evaluationId, feature])

  if (isLoading) {
    return <div className="p-4 text-center">Verificando disponibilidad...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isAvailable) {
    return <>{children}</>
  }

  return (
    <div className="p-4 border rounded-md bg-muted/50">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Característica no disponible</AlertTitle>
        <AlertDescription>{fallbackMessage}</AlertDescription>
      </Alert>
      <div className="mt-4 text-center">
        <Button asChild>
          <a href={upgradePlanUrl}>Mejorar Plan</a>
        </Button>
      </div>
    </div>
  )
}
