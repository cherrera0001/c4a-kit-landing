import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, FileText, PlusCircle, User } from "lucide-react"

export default function UserDashboard({ profile }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bienvenido, {profile.full_name || profile.email}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mis Evaluaciones</CardTitle>
            <CardDescription>Gestiona tus evaluaciones de madurez</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">0</div>
              <Button asChild variant="outline" size="sm">
                <Link href="/evaluaciones">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver todas
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Nueva Evaluación</CardTitle>
            <CardDescription>Inicia una nueva evaluación de madurez</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/evaluaciones/nueva">
                <PlusCircle className="mr-2 h-4 w-4" />
                Comenzar evaluación
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mi Perfil</CardTitle>
            <CardDescription>Gestiona tu información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/perfil">
                <User className="mr-2 h-4 w-4" />
                Ver perfil
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Actividad</CardTitle>
          <CardDescription>Tu actividad reciente en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border rounded-md">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No hay datos de actividad disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
