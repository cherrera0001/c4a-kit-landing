"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, Mail, AlertCircle } from "lucide-react"
import { validateEmail } from "@/lib/email-validator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isPreviewEnvironment } from "@/app/api/config"

export default function MagicLinkAuth() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailedError, setDetailedError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleMagicLinkAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Por favor, introduce un email válido")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setDetailedError(null)
      setSuccess(false)

      // Si estamos en modo vista previa, simulamos el envío del enlace
      if (isPreviewEnvironment()) {
        console.log("Modo vista previa: Simulando envío de enlace mágico a", email)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setSuccess(true)
        return
      }

      const supabase = createClientComponentClient()

      // Obtener la URL base para redirecciones
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const redirectTo = `${origin}/auth/callback`

      console.log("Enviando enlace mágico a:", email)
      console.log("URL de redirección:", redirectTo)

      const { error: supabaseError, data } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true, // Crear usuario si no existe
        },
      })

      if (supabaseError) {
        console.error("Error de Supabase al enviar enlace mágico:", supabaseError)

        // Mensajes de error más amigables basados en el código de error
        if (supabaseError.message.includes("rate limit")) {
          setError("Has excedido el límite de intentos. Por favor, espera unos minutos antes de intentarlo de nuevo.")
        } else if (supabaseError.message.includes("network")) {
          setError("Error de conexión. Por favor, verifica tu conexión a internet.")
        } else {
          setError("Error al enviar enlace mágico. Por favor, intenta de nuevo más tarde.")
        }

        // Guardar el error detallado para depuración
        setDetailedError(supabaseError.message)
      } else {
        console.log("Enlace mágico enviado correctamente")
        setSuccess(true)
      }
    } catch (err: any) {
      console.error("Error al enviar enlace mágico:", err)
      setError("Error al enviar enlace mágico. Por favor, intenta de nuevo más tarde.")
      setDetailedError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          {detailedError && (
            <details className="mt-2 text-xs">
              <summary>Detalles técnicos</summary>
              <p className="mt-1">{detailedError}</p>
            </details>
          )}
        </Alert>
      )}

      {success ? (
        <Alert variant="success" className="mb-4 bg-green-50 border border-green-200 text-green-800">
          <div>
            <AlertTitle className="text-green-800 font-medium">¡Enlace enviado!</AlertTitle>
            <AlertDescription className="text-green-700">
              Hemos enviado un enlace mágico a {email}. Por favor, revisa tu bandeja de entrada y haz clic en el enlace
              para iniciar sesión.
            </AlertDescription>
          </div>
        </Alert>
      ) : (
        <form onSubmit={handleMagicLinkAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full"
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Enviar enlace mágico
          </Button>
        </form>
      )}
    </div>
  )
}
