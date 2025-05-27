import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase"
import Link from "next/link"

export const metadata = {
  title: "Gestión de Usuarios | Sistema de Evaluación de Madurez",
  description: "Administración de usuarios del sistema",
}

export default async function UsersPage() {
  // Obtener el cliente de Supabase para el servidor
  const supabase = await getSupabaseServerClient()

  // Consultar los usuarios desde la base de datos
  const { data: userProfiles, error } = await supabase
    .from("user_profiles")
    .select(`
      id,
      full_name,
      avatar_url,
      created_at,
      updated_at,
      roles (
        id,
        name
      ),
      users (
        email,
        last_sign_in_at
      )
    `)
    .order("created_at", { ascending: false })

  // Transformar los datos para adaptarlos a nuestra interfaz
  const users =
    userProfiles?.map((profile) => ({
      id: profile.id,
      name: profile.full_name || "Sin nombre",
      email: profile.users?.email || "Sin email",
      role: profile.roles?.name || "user",
      status: profile.users?.last_sign_in_at ? "active" : "inactive",
      lastLogin: profile.users?.last_sign_in_at ? new Date(profile.users.last_sign_in_at).toLocaleString() : "Nunca",
    })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            Administra los usuarios que tienen acceso al sistema de evaluación de madurez.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar usuarios..." className="pl-8" />
            </div>
            <Button variant="outline">Filtrar</Button>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/15 p-4 text-destructive mb-4">
              Error al cargar usuarios: {error.message}
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role === "admin" ? "Administrador" : "Usuario"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "success" : "destructive"}>
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild title="Editar">
                            <Link href={`/admin/users/${user.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
