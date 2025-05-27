"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Correcto para App Router
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea }
from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createEvaluation, getCompanies } from "@/services/database-service" // Asegúrate que estas funciones manejen errores y devuelvan datos consistentes
import { Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs" // Correcto para componentes de cliente

export default function NuevaEvaluacionPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [companyId, setCompanyId] = useState("") // Este será el UUID de la empresa seleccionada
  const [companies, setCompanies] = useState([]) // Debería ser un array de objetos { id: string, name: string }
  const [loading, setLoading] = useState(false)
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [userId, setUserId] = useState("") // Este será el UUID del usuario autenticado (auth.users.id)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClientComponentClient() // Inicializa el cliente una vez

  // Cargar empresas y usuario actual
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingCompanies(true)
        setError("") // Limpiar errores previos

        // Obtener ID del usuario actual PRIMERO
        // Es importante tener el userId para cualquier lógica dependiente o si getCompanies() lo necesitara.
        const {
          data: { session },
          error: sessionError, // Capturar error de sesión
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error al obtener la sesión:", sessionError)
          setError("Error al verificar la sesión de usuario. Intente recargar.")
          setLoadingCompanies(false) // Detener carga si hay error de sesión
          // Podrías considerar redirigir al login si el error es grave (ej. token inválido)
          // router.push("/auth/login");
          return
        }

        if (session?.user?.id) {
          setUserId(session.user.id)
        } else {
          // Si no hay sesión, redirigir al login
          setError("No hay sesión activa. Redirigiendo al login...")
          router.push("/auth/login")
          return // Salir temprano si no hay sesión
        }

        // Cargar empresas DESPUÉS de confirmar la sesión
        const resultCompanies = await getCompanies()
        if (resultCompanies.success && resultCompanies.data) {
          // Asegúrate que company.id sea el UUID que necesitas para companyId
          setCompanies(resultCompanies.data.map(company => ({ id: company.id, name: company.nombre }))) // Ajusta company.name si el campo es diferente
        } else {
          console.error("Error al cargar empresas:", resultCompanies.error)
          setError(resultCompanies.error || "No se pudieron cargar las empresas")
        }

      } catch (err) { // Cambiado 'error' a 'err' para evitar conflicto con la variable de estado 'error'
        console.error("Error al cargar datos iniciales:", err)
        setError(err.message || "No se pudieron cargar los datos necesarios")
      } finally {
        setLoadingCompanies(false)
      }
    }

    loadData()
  }, [router, supabase]) // Añadir supabase como dependencia si se usa dentro del useEffect

  // Manejar creación de evaluación
  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !companyId) { // Añadido .trim() para el nombre
      setError("Por favor completa el nombre de la evaluación y selecciona una empresa.")
      return
    }

    if (!userId) {
      setError("No se pudo identificar al usuario. Por favor, recarga la página o inicia sesión de nuevo.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const evaluationData = {
        name: name.trim(),
        description: description.trim(), // También trim para descripción
        company_id: companyId,          // Debe ser un UUID válido de la tabla 'empresas'
        created_by: userId,             // Debe ser un UUID válido de 'auth.users.id' (o 'user_profiles.id' si la FK apunta allí)
        // Asegúrate que tu tabla 'evaluations' tenga estas columnas y los tipos correctos.
        // Y que cualquier otra columna NOT NULL sin DEFAULT en 'evaluations' tenga un valor.
        // Por ejemplo, si 'status' es NOT NULL, deberías añadirlo:
        // status: 'borrador', // o el estado inicial que corresponda
      }
      console.log("Enviando datos para crear evaluación:", evaluationData) // Log para depuración

      const result = await createEvaluation(evaluationData)

      if (result.success && result.data?.id) { // Verificar result.data.id también
        // Redirigir a la página de edición de la evaluación
        router.push(`/evaluaciones/${result.data.id}/editar`) // Asumiendo que quieres editarla después de crear
      } else {
        // Si result.error tiene un mensaje más específico de la BD, úsalo.
        const dbError = result.error?.message || "No se pudo crear la evaluación (error desconocido)."
        console.error("Error devuelto por createEvaluation:", result.error)
        setError(dbError)
        // throw new Error(dbError); // No necesitas throw si ya manejas con setError
      }
    } catch (err) { // Cambiado 'error' a 'err' para evitar conflicto con la variable de estado 'error'
      console.error("Error en handleSubmit al crear evaluación:", err)
      // El error de la BD (como el de FK) debería ser capturado aquí si createEvaluation lo propaga
      // o si createEvaluation devuelve un objeto error con un mensaje.
      setError(err.message || "Ocurrió un error inesperado al crear la evaluación.")
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
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6"> {/* Aumentado space-y */}
            <div>
              <label htmlFor="evaluationName" className="block text-sm font-medium mb-1">Nombre de la Evaluación *</label>
              <Input
                id="evaluationName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Evaluación de Madurez Q2 2025"
                required // El required del HTML es bueno, pero la validación en JS es más robusta
              />
            </div>

            <div>
              <label htmlFor="evaluationDescription" className="block text-sm font-medium mb-1">Descripción</label>
              <Textarea
                id="evaluationDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional de la evaluación"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="companySelect" className="block text-sm font-medium mb-1">Empresa *</label>
              {loadingCompanies ? (
                <div className="flex items-center space-x-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cargando empresas...</span>
                </div>
              ) : companies.length === 0 && !error ? ( // Mostrar si no hay empresas y no hay error de carga
                <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                  No hay empresas disponibles para seleccionar. <Button variant="link" size="sm" onClick={() => router.push('/empresas/nueva')}>Crear Empresa</Button>
                </div>
              ) : (
                <Select value={companyId} onValueChange={setCompanyId} required>
                  <SelectTrigger id="companySelect">
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

            <div className="flex justify-end space-x-3 pt-4"> {/* Aumentado space-x y pt */}
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || loadingCompanies || (!companyId && companies.length > 0) }> {/* Deshabilitar si no hay empresa seleccionada y hay empresas */}
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