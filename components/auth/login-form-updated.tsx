"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Info } from "lucide-react"
import Link from "next/link"
import { loginUser } from "@/services/auth-service"
import { isPreviewEnvironment } from "@/app/api/config"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  // Detectar si estamos en modo de vista previa
  useEffect(() => {
    setIsPreview(isPreviewEnvironment())
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validaciones básicas
      if (!email || !password) {
        throw new Error("Por favor, completa todos los campos")
      }

      // Usar el servicio de autenticación (maneja automáticamente vista previa vs producción)
      const authResult = await loginUser({ email, password })

      // Guardar el usuario en localStorage si estamos en modo de vista previa
      if (isPreview && authResult) {
        localStorage.setItem("preview_auth_user", JSON.stringify(authResult))
      }

      // Redirigir según el rol
      if (authResult?.session?.role === "admin" || (authResult?.user?.email === "admin@example.com" && isPreview)) {
        router.push("/admin/dashboard")
      } else {
        router.push(redirectTo)
      }

      // Refrescar la página para actualizar el estado de autenticación
      router.refresh()
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err)
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder al sistema de evaluación de madurez</CardDescription>
      </CardHeader>
      <CardContent>
        {isPreview && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              <p>Estás en modo de vista previa. Puedes usar estas credenciales:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Admin: admin@example.com / password</li>
                <li>Usuario: usuario@example.com / password</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
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
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              "Iniciar Sesión"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="link" asChild>
          <Link href="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/auth/register">Registrarse</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
