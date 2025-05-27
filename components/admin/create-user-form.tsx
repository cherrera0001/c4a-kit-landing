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
import { getSupabaseClient } from "@/lib/supabase"

export function CreateUserForm() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // 1. Crear el usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario")
      }

      // 2. Obtener el ID del rol
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", role === "admin" ? "admin" : "user")
        .single()

      if (roleError) throw roleError

      // 3. Crear el perfil del usuario en la tabla user_profiles
      // Nota: Supabase ya crea automáticamente un registro en user_profiles cuando se registra un usuario
      // Solo necesitamos actualizar los campos adicionales
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          full_name: fullName,
          role_id: roleData.id,
        })
        .eq("id", authData.user.id)

      if (profileError) throw profileError

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
            <Select value={role} onValueChange={setRole}>
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
