"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  // Calcular la fortaleza de la contraseña
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0

    // Longitud mínima
    if (password.length >= 8) strength += 25

    // Contiene números
    if (/\d/.test(password)) strength += 25

    // Contiene letras minúsculas y mayúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25

    // Contiene caracteres especiales
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25

    setPasswordStrength(strength)
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validar contraseñas
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      // Simulamos un retraso para dar feedback al usuario
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)

      // Redirigir después de un breve retraso
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err: any) {
      console.error("Error al restablecer contraseña:", err)
      setError(err.message || "Error al restablecer la contraseña")
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener el color de la barra de progreso
  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-center">¡Contraseña Actualizada!</CardTitle>
          <CardDescription className="text-center">Tu contraseña ha sido restablecida correctamente</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Serás redirigido a la página de inicio de sesión en unos segundos...
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">Ir a inicio de sesión</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Restablecer Contraseña</CardTitle>
        <CardDescription>Crea una nueva contraseña para tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            <p>Estás en modo de vista previa.</p>
            <p>En este modo, puedes probar la interfaz sin necesidad de un token real.</p>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              required
              disabled={loading}
            />
            {password && (
              <div className="space-y-1">
                <Progress value={passwordStrength} className={`h-1 ${getStrengthColor()}`} />
                <p className="text-xs text-muted-foreground">
                  {passwordStrength < 50 && "Débil"}
                  {passwordStrength >= 50 && passwordStrength < 75 && "Moderada"}
                  {passwordStrength >= 75 && "Fuerte"}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Restablecer contraseña"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={() => router.push("/auth/login")} disabled={loading}>
          Volver a inicio de sesión
        </Button>
      </CardFooter>
    </Card>
  )
}
