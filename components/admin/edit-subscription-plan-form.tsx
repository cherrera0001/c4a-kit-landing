"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TipoDiagnostico {
  id: string
  nombre_kit: string
  descripcion: string | null
  es_gratuito: boolean
  nivel_max_preguntas: number
  permite_pdf_detallado: boolean
  permite_comparativa_industria: boolean
  permite_recomendaciones_personalizadas: boolean
  max_usuarios: number
  precio_mensual: number | null
}

interface EditSubscriptionPlanFormProps {
  plan: TipoDiagnostico
}

export function EditSubscriptionPlanForm({ plan }: EditSubscriptionPlanFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<TipoDiagnostico>(plan)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === "" ? null : Number(value)
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/subscriptions/tipos-diagnostico/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al actualizar el plan")
      }

      router.push("/admin/settings/subscription-plans")
      router.refresh()
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "Error al actualizar el plan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_kit">Nombre del Plan *</Label>
            <Input id="nombre_kit" name="nombre_kit" value={formData.nombre_kit} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nivel_max_preguntas">Nivel Máximo de Preguntas *</Label>
            <Input
              id="nivel_max_preguntas"
              name="nivel_max_preguntas"
              type="number"
              min="1"
              max="3"
              value={formData.nivel_max_preguntas}
              onChange={(e) => handleNumberChange("nivel_max_preguntas", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">1: Básico, 2: Intermedio, 3: Avanzado</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion || ""}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max_usuarios">Número Máximo de Usuarios *</Label>
            <Input
              id="max_usuarios"
              name="max_usuarios"
              type="number"
              min="1"
              value={formData.max_usuarios}
              onChange={(e) => handleNumberChange("max_usuarios", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio_mensual">Precio Mensual ($)</Label>
            <Input
              id="precio_mensual"
              name="precio_mensual"
              type="number"
              min="0"
              step="0.01"
              value={formData.precio_mensual || ""}
              onChange={(e) => handleNumberChange("precio_mensual", e.target.value)}
              placeholder="Dejar vacío para 'Personalizado'"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="es_gratuito">Plan Gratuito</Label>
              <p className="text-sm text-muted-foreground">Marcar si este plan es gratuito (sin costo)</p>
            </div>
            <Switch
              id="es_gratuito"
              checked={formData.es_gratuito}
              onCheckedChange={(checked) => handleSwitchChange("es_gratuito", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="permite_pdf_detallado">Informes PDF Detallados</Label>
              <p className="text-sm text-muted-foreground">Permite generar y descargar informes PDF detallados</p>
            </div>
            <Switch
              id="permite_pdf_detallado"
              checked={formData.permite_pdf_detallado}
              onCheckedChange={(checked) => handleSwitchChange("permite_pdf_detallado", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="permite_comparativa_industria">Comparativa con la Industria</Label>
              <p className="text-sm text-muted-foreground">Permite ver comparativas con promedios de la industria</p>
            </div>
            <Switch
              id="permite_comparativa_industria"
              checked={formData.permite_comparativa_industria}
              onCheckedChange={(checked) => handleSwitchChange("permite_comparativa_industria", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="permite_recomendaciones_personalizadas">Recomendaciones Personalizadas</Label>
              <p className="text-sm text-muted-foreground">
                Permite acceder a recomendaciones personalizadas basadas en resultados
              </p>
            </div>
            <Switch
              id="permite_recomendaciones_personalizadas"
              checked={formData.permite_recomendaciones_personalizadas}
              onCheckedChange={(checked) => handleSwitchChange("permite_recomendaciones_personalizadas", checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/settings/subscription-plans")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  )
}
