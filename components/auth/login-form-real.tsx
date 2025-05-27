"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import GoogleAuthButton from "./google-auth-button"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get("redirect") || "/dashboard"
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      // Obtener la sesión actual
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Verificar el rol del usuario
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()

        // Redirigir según el rol o a la página especificada
        if (profile?.role === "admin") {
          router.push("/admin")
        } else if (redirectTo && !redirectTo.includes("/auth/login")) {
          router.push(redirectTo)
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: any) {
      setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.")
      console.error("Error de inicio de sesión:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
        <p className="text-gray-500">Ingresa tus credenciales para acceder</p>
      </div>

      {/* Botón de Google */}
      <GoogleAuthButton mode="signin" />

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">O inicia sesión con email</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-sm text-red-800">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>

      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:text-blue-800">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
