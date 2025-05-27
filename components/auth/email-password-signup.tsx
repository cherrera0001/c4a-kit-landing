"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle, Shield, Check, X } from "lucide-react"

// Tipos para la fortaleza de la contraseña
type PasswordStrength = "empty" | "weak" | "medium" | "strong" | "very-strong"

// Interfaz para los requisitos de contraseña
interface PasswordRequirement {
  id: string
  text: string
  validator: (password: string) => boolean
}

export default function EmailPasswordSignup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("empty")
  const [passwordFeedback, setPasswordFeedback] = useState("")
  const supabase = createClientComponentClient()

  // Definir los requisitos de contraseña
  const passwordRequirements: PasswordRequirement[] = [
    {
      id: "length",
      text: "Al menos 8 caracteres",
      validator: (password) => password.length >= 8,
    },
    {
      id: "uppercase",
      text: "Al menos una letra mayúscula (A-Z)",
      validator: (password) => /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      text: "Al menos una letra minúscula (a-z)",
      validator: (password) => /[a-z]/.test(password),
    },
    {
      id: "number",
      text: "Al menos un número (0-9)",
      validator: (password) => /[0-9]/.test(password),
    },
    {
      id: "special",
      text: "Al menos un carácter especial (!@#$%^&*)",
      validator: (password) => /[^A-Za-z0-9]/.test(password),
    },
    {
      id: "no-repeats",
      text: "Sin caracteres repetidos consecutivos (aaa, 111)",
      validator: (password) => !/(.)\1{2,}/.test(password),
    },
  ]

  // Evaluar la fortaleza de la contraseña cuando cambia
  useEffect(() => {
    if (!password) {
      setPasswordStrength("empty")
      setPasswordFeedback("")
      return
    }

    const strength = calculatePasswordStrength(password)
    setPasswordStrength(strength)
    setPasswordFeedback(getPasswordFeedback(strength, password))
  }, [password])

  // Función para calcular la fortaleza de la contraseña
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    // Si está vacía
    if (!password) return "empty"

    // Iniciar con puntaje base
    let score = 0

    // Criterios de evaluación
    const lengthScore = Math.min(password.length / 2, 4) // Máximo 4 puntos por longitud
    score += lengthScore

    // Variedad de caracteres
    if (/[A-Z]/.test(password)) score += 1 // Mayúsculas
    if (/[a-z]/.test(password)) score += 1 // Minúsculas
    if (/[0-9]/.test(password)) score += 1 // Números
    if (/[^A-Za-z0-9]/.test(password)) score += 2 // Caracteres especiales

    // Patrones a evitar (restar puntos)
    if (/^[0-9]+$/.test(password)) score -= 1 // Solo números
    if (/^[a-zA-Z]+$/.test(password)) score -= 1 // Solo letras
    if (/(.)\1{2,}/.test(password)) score -= 1 // Caracteres repetidos

    // Determinar nivel basado en puntaje
    if (score < 3) return "weak"
    if (score < 6) return "medium"
    if (score < 8) return "strong"
    return "very-strong"
  }

  // Obtener feedback basado en la fortaleza
  const getPasswordFeedback = (strength: PasswordStrength, password: string): string => {
    switch (strength) {
      case "weak":
        return "Contraseña débil. Intenta hacerla más larga y añadir caracteres especiales."
      case "medium":
        return "Contraseña moderada. Añade más variedad de caracteres."
      case "strong":
        return "Contraseña fuerte. ¡Buen trabajo!"
      case "very-strong":
        return "Contraseña muy fuerte. ¡Excelente!"
      default:
        return ""
    }
  }

  // Obtener color basado en la fortaleza
  const getStrengthColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      case "very-strong":
        return "bg-emerald-500"
      default:
        return "bg-gray-200"
    }
  }

  // Obtener porcentaje de la barra basado en la fortaleza
  const getStrengthPercentage = (strength: PasswordStrength): number => {
    switch (strength) {
      case "weak":
        return 25
      case "medium":
        return 50
      case "strong":
        return 75
      case "very-strong":
        return 100
      default:
        return 0
    }
  }

  // Función para validar el formulario
  const validateForm = () => {
    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, verifica que sean iguales.")
      return false
    }

    // Verificar longitud mínima de contraseña
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return false
    }

    // Verificar que la contraseña no sea demasiado débil
    if (passwordStrength === "weak") {
      setError("La contraseña es demasiado débil. Por favor, crea una contraseña más segura.")
      return false
    }

    // Verificar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor, ingresa un email válido.")
      return false
    }

    return true
  }

  // Corregir la función handleSignUp para evitar el conflicto de nombres
  const handleSignUp = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validar el formulario antes de continuar
    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      // Usar los estados directamente en lugar de desestructurar de formData
      // Esto evita el conflicto de nombres con las variables de estado
      const emailValue = email
      const passwordValue = password
      const fullNameValue = fullName

      // Registro con Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailValue,
        password: passwordValue,
        options: {
          data: {
            full_name: fullNameValue,
            // Importante: Establecemos explícitamente el rol como "user" en los metadatos
            // Esto servirá como referencia incluso si no se usa directamente para asignar permisos
            role: "user", // Siempre asignamos el rol básico de usuario
          },
        },
      })

      if (authError) throw authError

      // IMPORTANTE: No intentamos crear un perfil de usuario manualmente aquí
      // Sin embargo, podemos registrar en logs o analytics que se ha creado un usuario con rol básico
      console.log("Usuario registrado con rol básico:", authData.user?.id)

      // Mensaje de éxito actualizado
      setSuccess(
        "Cuenta creada correctamente. Por favor, verifica tu email para activar tu cuenta. " +
          "Una vez confirmada, podrás iniciar sesión con permisos básicos de usuario.",
      )

      // Limpiar el formulario después de un registro exitoso
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setFullName("")
      setPasswordStrength("empty")
      setPasswordFeedback("")
    } catch (error: any) {
      console.error("Error en registro:", error)
      setError(error.message || "Error al crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Crear una cuenta</h2>
        <p className="text-sm text-gray-500">Regístrate con tu email y contraseña</p>
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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          handleSignUp(formData)
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo (opcional)</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

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
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
          />

          {/* Indicador de fortaleza de contraseña */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                  style={{ width: `${getStrengthPercentage(passwordStrength)}%` }}
                ></div>
              </div>
              <div className="flex items-center text-xs">
                <Shield
                  className={`h-3 w-3 mr-1 ${
                    passwordStrength === "weak"
                      ? "text-red-500"
                      : passwordStrength === "medium"
                        ? "text-yellow-500"
                        : passwordStrength === "strong"
                          ? "text-green-500"
                          : passwordStrength === "very-strong"
                            ? "text-emerald-500"
                            : "text-gray-400"
                  }`}
                />
                <span
                  className={`${
                    passwordStrength === "weak"
                      ? "text-red-500"
                      : passwordStrength === "medium"
                        ? "text-yellow-500"
                        : passwordStrength === "strong"
                          ? "text-green-500"
                          : passwordStrength === "very-strong"
                            ? "text-emerald-500"
                            : "text-gray-400"
                  }`}
                >
                  {passwordFeedback}
                </span>
              </div>
            </div>
          )}

          {/* Lista de requisitos de contraseña */}
          {password && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Tu contraseña debe tener:</h4>
              <ul className="space-y-1">
                {passwordRequirements.map((requirement) => {
                  const isMet = requirement.validator(password)
                  return (
                    <li key={requirement.id} className="flex items-center text-xs">
                      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {isMet ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-gray-300" />
                        )}
                      </span>
                      <span className={isMet ? "text-gray-700" : "text-gray-500"}>{requirement.text}</span>
                    </li>
                  )
                })}
              </ul>
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
            placeholder="••••••••"
            required
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </Button>
      </form>
    </div>
  )
}
