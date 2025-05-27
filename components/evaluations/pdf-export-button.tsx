"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FeatureAvailabilityCheck } from "./feature-availability-check"

interface PdfExportButtonProps {
  evaluationId: string
}

export function PdfExportButton({ evaluationId }: PdfExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExportPdf = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/pdf/evaluation/${evaluationId}/download`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al generar el PDF")
      }

      // Obtener el blob del PDF
      const blob = await response.blob()

      // Crear URL para el blob
      const url = window.URL.createObjectURL(blob)

      // Crear un elemento <a> para descargar el archivo
      const a = document.createElement("a")
      a.href = url
      a.download = `evaluacion-${evaluationId}.pdf`
      document.body.appendChild(a)
      a.click()

      // Limpiar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "Error al exportar el PDF")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FeatureAvailabilityCheck
      evaluationId={evaluationId}
      feature="pdf_detallado"
      fallbackMessage="Los informes detallados en PDF están disponibles en los planes Profesional y Enterprise."
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleExportPdf} disabled={isLoading} className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        {isLoading ? "Generando PDF..." : "Exportar Informe PDF"}
      </Button>
    </FeatureAvailabilityCheck>
  )
}
