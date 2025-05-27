"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { registerUser } from "@/services/auth-service"
import { validateCorporateEmail } from "@/lib/email-validator"
import { isPreviewEnvironment } from "@/app/api/config"
import GoogleAuthButton from "./google-auth-button"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validar email en tiempo real cuando cambia
    if (name === "email" && value) {
      // En modo vista previa, no validamos el correo corporativo
      if (isPreviewEnvironment()) {
        setEmailError(null)
        return
      }

      const validation = validateCorporateEmail(value)
      setEmailError(validation.isValid ? null : validation.message)
    } else if (name === "email") {
      setEmailError(null)
    }

    // Validar fortaleza de contraseña en tiempo real
    if (name === "password") {
      const hasMinLength = value.length >= 8
      const hasUpperCase = /[A-Z]/.test(value)
      const hasLowerCase = /[a-z]/.test(value)
      const hasNumber = /[0-9]/.test(value)
      const hasSpecialChar = /[^A-Za-z0-9]/.test(value)

      // Calcular puntuación (0-5)
      const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length

      setPasswordStrength({
        score,
        hasMinLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar,
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validaciones básicas
      if (!formData.email || !formData.password || !formData.fullName) {
        throw new Error("Por favor, completa todos los campos requeridos")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (formData.password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      // Validar email corporativo (solo en producción)
      if (!isPreviewEnvironment()) {
        const emailValidation = validateCorporateEmail(formData.email)
        if (!emailValidation.isValid) {
          throw new Error(emailValidation.message)
        }
      }

      // Crear usuario
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        companyName: formData.companyName,
      })

      // Verificar si hay una nota sobre problemas con el correo
      if (result && "note" in result) {
        setSuccess(
          "Tu cuenta ha sido creada correctamente, pero hubo un problema al enviar el correo de confirmación. Por favor, contacta a soporte.",
        )
        // No redirigimos en este caso, mostramos el mensaje de éxito con la advertencia
      } else {
        // Redirigir a página de confirmación
        router.push("/auth/register/confirmation")
      }
    } catch (err: any) {
      console.error("Error al registrar usuario:", err)

      // Si el error está relacionado con el envío de correo pero el usuario se creó
      if (err.message && err.message.includes("correo de confirmación")) {
        setSuccess(
          "Tu cuenta ha sido creada correctamente, pero hubo un problema al enviar el correo de confirmación. Por favor, contacta a soporte.",
        )
      } else {
        setError(err.message || "Error al registrar usuario")
      }
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength
    if (score <= 2) return "text-red-500"
    if (score <= 3) return "text-yellow-500"
    return "text-green-500"
  }

  const getPasswordStrengthText = () => {
    const { score } = passwordStrength
    if (score <= 2) return "Débil"
    if (score <= 3) return "Media"
    return "Fuerte"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Regístrate para acceder al sistema de evaluación de madurez</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Botón de Google */}
        <div className="mb-6">
          <GoogleAuthButton mode="signup" />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O regístrate con email</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nombre y apellidos"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Empresa (opcional)</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Nombre de tu empresa"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico corporativo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@empresa.com"
              required
              className={emailError ? "border-red-500" : ""}
              disabled={loading}
            />
            {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
            {!isPreviewEnvironment() && (
              <p className="text-xs text-gray-500">
                Debe ser un correo electrónico corporativo. No se permiten correos personales como Gmail, Hotmail, etc.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-500" />
                )}
                <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
              </Button>
            </div>

            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Fortaleza:</span>
                  <span className={`text-sm font-medium ${getPasswordStrengthColor()}`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center">
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div className="flex items-center">
                    {passwordStrength.hasUpperCase ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Al menos una mayúscula</span>
                  </div>
                  <div className="flex items-center">
                    {passwordStrength.hasLowerCase ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Al menos una minúscula</span>
                  </div>
                  <div className="flex items-center">
                    {passwordStrength.hasNumber ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Al menos un número</span>
                  </div>
                  <div className="flex items-center">
                    {passwordStrength.hasSpecialChar ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Al menos un carácter especial</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-500" />
                )}
                <span className="sr-only">{showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
              </Button>
            </div>
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              loading ||
              !!emailError ||
              formData.password !== formData.confirmPassword ||
              passwordStrength.score < 3 ||
              !formData.fullName ||
              !formData.email ||
              !formData.password
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" asChild>
          <Link href="/auth/login">¿Ya tienes una cuenta? Inicia sesión</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
