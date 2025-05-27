"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { isPreviewEnvironment } from "@/app/api/config"

export default function EmailPasswordSignin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validaciones básicas
      if (!email || !password) {
        throw new Error("Por favor, completa todos los campos")
      }

      // Simulación en modo vista previa
      if (isPreviewEnvironment()) {
        console.log("Modo vista previa: Simulando inicio de sesión para", email)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simular inicio de sesión exitoso para ciertas cuentas de prueba
        if (email === "admin@example.com" && password === "password") {
          window.location.href = "/admin/dashboard"
          return
        } else if (email.includes("@") && password.length >= 6) {
          window.location.href = "/dashboard"
          return
        } else {
          throw new Error("Credenciales incorrectas")
        }
      }

      // Inicio de sesión real con Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Redirigir según el rol del usuario
      if (data?.user) {
        // Obtener información del perfil para determinar el rol
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("role_id")
          .eq("id", data.user.id)
          .single()

        // Redirigir según el rol
        if (profileData?.role_id === 1) {
          // Asumiendo que 1 es el ID del rol de administrador
          window.location.href = "/admin/dashboard"
        } else {
          window.location.href = "/dashboard"
        }
      }
    } catch (err: any) {
      console.error("Error de inicio de sesión:", err)

      // Manejar errores específicos de Supabase
      if (err.message?.includes("Invalid login credentials")) {
        setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Tu cuenta no ha sido verificada. Por favor, revisa tu email para activarla.")
      } else {
        setError(err.message || "Error al iniciar sesión")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Iniciar sesión</h2>
        <p className="text-sm text-gray-500">Accede con tu email y contraseña</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>
    </div>
  )
}
