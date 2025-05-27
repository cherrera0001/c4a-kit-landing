"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { isPreviewEnvironment } from "@/app/api/config"

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validaciones básicas
      if (!email) {
        throw new Error("Por favor, ingresa tu dirección de email")
      }

      // Simulación en modo vista previa
      if (isPreviewEnvironment()) {
        console.log("Modo vista previa: Simulando solicitud de restablecimiento para", email)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setSuccess("Te hemos enviado un email con instrucciones para restablecer tu contraseña.")
        return
      }

      // Solicitud real de restablecimiento con Supabase
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) throw resetError

      setSuccess("Te hemos enviado un email con instrucciones para restablecer tu contraseña.")
    } catch (err: any) {
      console.error("Error al solicitar restablecimiento:", err)
      setError(err.message || "Error al solicitar el restablecimiento de contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Recuperar contraseña</h2>
        <p className="text-sm text-gray-500">Te enviaremos un email para restablecer tu contraseña</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando instrucciones...
            </>
          ) : (
            "Enviar instrucciones"
          )}
        </Button>
      </form>
    </div>
  )
}
