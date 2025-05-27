"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestRLS() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const supabase = getSupabaseClient()

  const testRLS = async () => {
    setStatus("loading")
    setMessage("")

    try {
      // 1. Verificar la sesión actual
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        setStatus("error")
        setMessage("No hay sesión activa. Inicia sesión primero.")
        return
      }

      // 2. Intentar obtener el perfil del usuario actual
      const { data: profileData, error: profileError } = await supabase.from("user_profiles").select("*").single()

      if (profileError) {
        throw new Error(`Error al obtener el perfil: ${profileError.message}`)
      }

      // 3. Intentar obtener todos los perfiles (debería fallar para usuarios normales)
      const { data: allProfiles, error: allProfilesError } = await supabase.from("user_profiles").select("*").limit(10)

      // 4. Intentar obtener evaluaciones del usuario
      const { data: evaluations, error: evaluationsError } = await supabase.from("evaluations").select("*").limit(5)

      // Construir mensaje de resultado
      let resultMessage = "Prueba de RLS completada:\n\n"
      resultMessage += `- Perfil propio: ${profileData ? "✅ Acceso permitido" : "❌ Acceso denegado"}\n`
      resultMessage += `- Todos los perfiles: ${!allProfilesError ? `✅ Acceso permitido (${allProfiles?.length} perfiles)` : "❌ Acceso denegado"}\n`
      resultMessage += `- Evaluaciones: ${!evaluationsError ? `✅ Acceso permitido (${evaluations?.length} evaluaciones)` : "❌ Acceso denegado"}\n`

      // Determinar si el usuario es administrador basado en los resultados
      const isAdmin = !allProfilesError && allProfiles && allProfiles.length > 1
      resultMessage += `\nRol detectado: ${isAdmin ? "Administrador" : "Usuario regular"}`

      setStatus("success")
      setMessage(resultMessage)
    } catch (err: any) {
      console.error("Error al probar RLS:", err)
      setStatus("error")
      setMessage(`Error: ${err.message || "Desconocido"}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prueba de Row Level Security</CardTitle>
        <CardDescription>Verifica que las políticas RLS estén funcionando correctamente</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={testRLS} disabled={status === "loading"}>
          {status === "loading" ? "Probando..." : "Probar políticas RLS"}
        </Button>

        {status === "success" && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 whitespace-pre-line">{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
