import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, FileText, Users, Building, Settings } from "lucide-react"

export default function AdminDashboard({ profile }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Gestiona los usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">0</div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Ver todos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Evaluaciones</CardTitle>
            <CardDescription>Todas las evaluaciones realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">0</div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/evaluations">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver todas
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Empresas</CardTitle>
            <CardDescription>Empresas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">0</div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/companies">
                  <Building className="mr-2 h-4 w-4" />
                  Ver todas
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Configuración</CardTitle>
            <CardDescription>Ajustes del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configurar
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Generales</CardTitle>
          <CardDescription>Resumen de actividad en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border rounded-md">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No hay datos estadísticos disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
