"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createEvaluation, getCompanies } from "@/services/database-service"
import { Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function NuevaEvaluacionPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [userId, setUserId] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Cargar empresas y usuario actual
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingCompanies(true)
        // Cargar empresas
        const result = await getCompanies()
        if (result.success) {
          setCompanies(result.data || [])
        } else {
          setError("No se pudieron cargar las empresas")
        }

        // Obtener ID del usuario actual
        const supabase = createClientComponentClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user?.id) {
          setUserId(session.user.id)
        } else {
          // Si no hay sesión, redirigir al login
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setError("No se pudieron cargar los datos necesarios")
      } finally {
        setLoadingCompanies(false)
      }
    }

    loadData()
  }, [router])

  // Manejar creación de evaluación
  async function handleSubmit(e) {
    e.preventDefault()

    if (!name || !companyId) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await createEvaluation({
        name,
        description,
        company_id: companyId,
        created_by: userId,
      })

      if (result.success) {
        // Redirigir a la página de edición de la evaluación
        router.push(`/evaluaciones/${result.data.id}/editar`)
      } else {
        throw new Error("No se pudo crear la evaluación")
      }
    } catch (error) {
      console.error("Error al crear evaluación:", error)
      setError("No se pudo crear la evaluación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Nueva Evaluación</h1>

      <Card>
        <CardHeader>
          <CardTitle>Crear Evaluación de Madurez</CardTitle>
          <CardDescription>Completa la información para iniciar una nueva evaluación</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Evaluación *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Evaluación de Madurez Q2 2023"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional de la evaluación"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Empresa *</label>
              {loadingCompanies ? (
                <div className="flex items-center space-x-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Cargando empresas...</span>
                </div>
              ) : (
                <Select value={companyId} onValueChange={setCompanyId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una empresa" />
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
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || loadingCompanies}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Evaluación"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
