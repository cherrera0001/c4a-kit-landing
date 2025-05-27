import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase"

export const metadata = {
  title: "Gestión de Usuarios | Sistema de Evaluación de Madurez",
  description: "Administración de usuarios del sistema",
}

// Tipo para los usuarios
type User = {
  id: string
  email: string
  full_name: string | null
  role: string
  status: string
  last_login: string | null
  created_at: string
}

export default async function UsersPage() {
  // Obtener el cliente de Supabase para el servidor
  const supabase = await getSupabaseServerClient()

  // Consultar los usuarios desde la base de datos
  const { data: users, error } = await supabase
    .from("user_profiles")
    .select(`
      id,
      full_name,
      avatar_url,
      created_at,
      auth.users!inner(email, last_sign_in_at),
      roles(name)
    `)
    .order("created_at", { ascending: false })

  // Transformar los datos para adaptarlos a nuestra interfaz
  const formattedUsers: User[] =
    users?.map((user) => ({
      id: user.id,
      email: user.auth?.users?.email || "Sin email",
      full_name: user.full_name || "Sin nombre",
      role: user.roles?.name || "user",
      status: user.auth?.users?.last_sign_in_at ? "active" : "inactive",
      last_login: user.auth?.users?.last_sign_in_at
        ? new Date(user.auth.users.last_sign_in_at).toLocaleString()
        : "Nunca",
      created_at: new Date(user.created_at).toLocaleString(),
    })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
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
                {formattedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                ) : (
                  formattedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
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
                      <TableCell>{user.last_login}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Editar">
                            <Edit className="h-4 w-4" />
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
