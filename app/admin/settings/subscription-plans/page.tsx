import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTiposDiagnostico } from "@/services/subscription-service"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Gestión de Planes de Suscripción | Sistema de Evaluación de Madurez",
  description: "Administración de planes y niveles de diagnóstico",
}

export default async function SubscriptionPlansPage() {
  const { data: planes, success } = await getTiposDiagnostico()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Planes de Suscripción</h2>
        <Button asChild>
          <Link href="/admin/settings/subscription-plans/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Plan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planes Configurados</CardTitle>
          <CardDescription>Gestione los planes de suscripción y sus características disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <p className="text-red-500">Error al cargar los planes de suscripción</p>
          ) : planes && planes.length > 0 ? (
            <div className="space-y-4">
              {planes.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{plan.nombre_kit}</h3>
                      {plan.es_gratuito && <Badge variant="secondary">Gratuito</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.descripcion}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Nivel {plan.nivel_max_preguntas}</Badge>
                      <Badge variant="outline">Máx. {plan.max_usuarios} usuarios</Badge>
                      {plan.permite_pdf_detallado && <Badge variant="outline">PDF Detallado</Badge>}
                      {plan.permite_comparativa_industria && <Badge variant="outline">Comparativa Industria</Badge>}
                      {plan.permite_recomendaciones_personalizadas && <Badge variant="outline">Recomendaciones</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/settings/subscription-plans/${plan.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No hay planes de suscripción configurados</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Importante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              <strong>Nivel de Diagnóstico:</strong> Determina qué preguntas se incluyen en las evaluaciones.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nivel 1: Preguntas fundamentales, incluidas en todos los planes.</li>
              <li>Nivel 2: Preguntas más detalladas, incluidas en planes Profesional y Enterprise.</li>
              <li>Nivel 3: Preguntas avanzadas, principalmente para el plan Enterprise.</li>
            </ul>
            <p>
              <strong>Características Premium:</strong> Controlan qué funcionalidades están disponibles para cada plan.
            </p>
            <p className="text-amber-600">
              Nota: Modificar un plan puede afectar a las evaluaciones existentes. Se recomienda crear nuevos planes en
              lugar de modificar los existentes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
