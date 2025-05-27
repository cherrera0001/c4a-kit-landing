"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Download } from "lucide-react"
import { PdfPreviewModal } from "@/components/pdf/pdf-preview-modal"

interface ExportPdfButtonProps extends ButtonProps {
  evaluationId: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function ExportPdfButton({ evaluationId, variant = "outline", className, ...props }: ExportPdfButtonProps) {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)

  return (
    <>
      <Button variant={variant} className={className} onClick={() => setIsPdfModalOpen(true)} {...props}>
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>

      <PdfPreviewModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} evaluationId={evaluationId} />
    </>
  )
}
