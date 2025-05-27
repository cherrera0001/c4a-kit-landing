"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface Company {
  id: string
  name: string
}

interface TipoDiagnostico {
  id: string
  nombre_kit: string
  descripcion: string
  nivel_max_preguntas: number
  precio_mensual: number | null
}

export function CreateEvaluationForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [tipoDiagnosticoId, setTipoDiagnosticoId] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [tiposDiagnostico, setTiposDiagnostico] = useState<TipoDiagnostico[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formTouched, setFormTouched] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingData(true)
        setError(null)

        // Cargar empresas
        const companiesResponse = await fetch("/api/companies")
        if (!companiesResponse.ok) {
          const errorData = await companiesResponse.json()
          throw new Error(errorData.error || "Error al cargar empresas")
        }
        const companiesData = await companiesResponse.json()

        // Cargar tipos de diagnóstico
        const tiposResponse = await fetch("/api/subscriptions/tipos-diagnostico")
        if (!tiposResponse.ok) {
          const errorData = await tiposResponse.json()
          throw new Error(errorData.error || "Error al cargar tipos de diagnóstico")
        }
        const tiposData = await tiposResponse.json()

        // Actualizar estado
        setCompanies(companiesData)
        setTiposDiagnostico(tiposData)

        // Establecer valores por defecto si hay datos
        if (companiesData.length > 0) {
          setCompanyId(companiesData[0].id)
        }

        if (tiposData.length > 0) {
          setTipoDiagnosticoId(tiposData[0].id)
        }
      } catch (err: any) {
        console.error("Error al cargar datos:", err)
        setError(err.message || "No se pudieron cargar los datos necesarios")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  // Marcar el formulario como tocado cuando se cambia cualquier campo
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "name") {
      setName(value)
    } else if (name === "description") {
      setDescription(value)
    }

    setFormTouched(true)
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "company") {
      setCompanyId(value)
    } else if (name === "tipoDiagnostico") {
      setTipoDiagnosticoId(value)
    }

    setFormTouched(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !companyId || !tipoDiagnosticoId) {
      setError("Por favor complete todos los campos requeridos")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          company_id: companyId,
          created_by: userId,
          tipo_diagnostico_id: tipoDiagnosticoId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear la evaluación")
      }

      const data = await response.json()

      // Mostrar mensaje de éxito brevemente antes de redirigir
      setTimeout(() => {
        router.push(`/evaluaciones/${data.id}`)
      }, 500)
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "Error al crear la evaluación")
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar si el formulario es válido
  const isFormValid = name.trim() !== "" && companyId !== "" && tipoDiagnosticoId !== ""

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nueva Evaluación de Madurez</CardTitle>
        <CardDescription>Cree una nueva evaluación para medir el nivel de madurez en ciberseguridad</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoadingData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Evaluación *</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
                placeholder="Ej: Evaluación Inicial de Seguridad"
                required
                disabled={isLoading}
              />
              {formTouched && !name.trim() && <p className="text-sm text-red-500 mt-1">El nombre es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={handleInputChange}
                placeholder="Descripción o notas adicionales sobre esta evaluación"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa *</Label>
              {companies.length === 0 ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <Info className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-700">
                    No hay empresas disponibles. Por favor, cree una empresa primero.
                  </AlertDescription>
                </Alert>
              ) : (
                <Select
                  value={companyId}
                  onValueChange={(value) => handleSelectChange("company", value)}
                  required
                  disabled={isLoading}
                >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {formTouched && !companyId && <p className="text-sm text-red-500 mt-1">Debe seleccionar una empresa</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoDiagnostico">Tipo de Diagnóstico *</Label>
              {tiposDiagnostico.length === 0 ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <Info className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-700">
                    No hay tipos de diagnóstico disponibles.
                  </AlertDescription>
                </Alert>
              ) : (
                <Select
                  value={tipoDiagnosticoId}
                  onValueChange={(value) => handleSelectChange("tipoDiagnostico", value)}
                  required
                  disabled={isLoading}
                >
                  <SelectTrigger id="tipoDiagnostico">
                    <SelectValue placeholder="Seleccionar tipo de diagnóstico" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDiagnostico.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre_kit} {tipo.precio_mensual ? `- $${tipo.precio_mensual}/mes` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {tipoDiagnosticoId && tiposDiagnostico.find((t) => t.id === tipoDiagnosticoId)?.descripcion && (
                <p className="text-sm text-muted-foreground mt-1">
                  {tiposDiagnostico.find((t) => t.id === tipoDiagnosticoId)?.descripcion}
                </p>
              )}
              {formTouched && !tipoDiagnosticoId && (
                <p className="text-sm text-red-500 mt-1">Debe seleccionar un tipo de diagnóstico</p>
              )}
            </div>

            <CardFooter className="px-0 pt-4">
              <Button
                type="submit"
                disabled={isLoading || !isFormValid || companies.length === 0 || tiposDiagnostico.length === 0}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Evaluación"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
