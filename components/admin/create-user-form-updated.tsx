"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { createUser } from "@/services/user-service"

export function CreateUserForm() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "user">("user")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validaciones básicas
      if (!email || !email.includes("@")) {
        throw new Error("Por favor, ingresa un correo electrónico válido")
      }

      if (!fullName.trim()) {
        throw new Error("Por favor, ingresa un nombre completo")
      }

      if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      // Crear usuario usando el servicio
      await createUser({
        email,
        password,
        fullName,
        roleName: role,
      })

      // Éxito
      setSuccess(true)

      // Limpiar el formulario
      setEmail("")
      setFullName("")
      setPassword("")
      setRole("user")

      // Refrescar la lista de usuarios
      router.refresh()

      // Opcional: redirigir después de un tiempo
      setTimeout(() => {
        router.push("/admin/users")
      }, 2000)
    } catch (err: any) {
      console.error("Error al crear usuario:", err)
      setError(err.message || "Error al crear el usuario")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Usuario Creado Exitosamente</CardTitle>
          <CardDescription>
            El usuario ha sido creado y puede acceder al sistema con las credenciales proporcionadas.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/admin/users")}>Volver a la lista de usuarios</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Usuario</CardTitle>
        <CardDescription>Añade un nuevo usuario al sistema de evaluación de madurez.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez"
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
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={role} onValueChange={(value) => setRole(value as "admin" | "user")}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/admin/users")} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            "Crear Usuario"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
