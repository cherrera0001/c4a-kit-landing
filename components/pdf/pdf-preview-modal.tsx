"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Download, X } from "lucide-react"
import { PDFViewer } from "@react-pdf/renderer"
import { EvaluationPdfDocument } from "./evaluation-pdf-document"
import { generateChartImageUrl, generateBarChartImageUrl } from "@/services/pdf-service"

interface PdfPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  evaluationId: string
}

export function PdfPreviewModal({ isOpen, onClose, evaluationId }: PdfPreviewModalProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfData, setPdfData] = useState<any>(null)
  const [radarChartUrl, setRadarChartUrl] = useState<string | null>(null)
  const [barChartUrl, setBarChartUrl] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && evaluationId) {
      loadPdfData()
    }
  }, [isOpen, evaluationId])

  async function loadPdfData() {
    try {
      setLoading(true)
      setError(null)

      // Cargar datos para el PDF
      const response = await fetch(`/api/pdf/evaluation/${evaluationId}`)
      if (!response.ok) {
        throw new Error("No se pudieron cargar los datos para el PDF")
      }

      const data = await response.json()
      setPdfData(data)

      // Generar URLs de gráficos
      const radarUrl = await generateChartImageUrl(data.results)
      setRadarChartUrl(radarUrl)

      const barUrl = await generateBarChartImageUrl(data.results)
      setBarChartUrl(barUrl)
    } catch (err) {
      console.error("Error al cargar datos del PDF:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Función para descargar el PDF directamente
  async function handleDownloadPdf() {
    try {
      setLoading(true)

      // Hacer una solicitud al endpoint de descarga
      const response = await fetch(`/api/pdf/evaluation/${evaluationId}/download`)
      if (!response.ok) {
        throw new Error("No se pudo generar el PDF para descargar")
      }

      // Obtener el blob del PDF
      const blob = await response.blob()

      // Crear un objeto URL para el blob
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
    } catch (err) {
      console.error("Error al descargar PDF:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Vista previa del Informe PDF</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={loading || !!error}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Generando PDF...</span>
            </div>
          )}

          {error && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button variant="outline" onClick={loadPdfData}>
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && pdfData && (
            <PDFViewer style={{ width: "100%", height: "100%", border: "none" }}>
              <EvaluationPdfDocument data={pdfData} radarChartUrl={radarChartUrl} barChartUrl={barChartUrl} />
            </PDFViewer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
