import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getEvaluations } from "@/services/database-service"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { PlusCircle, FileText, Clock, CheckCircle } from "lucide-react"

export default async function EvaluacionesPage() {
  // Verificar autenticación
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Obtener evaluaciones
  const { data: evaluations = [], success } = await getEvaluations()

  // Agrupar evaluaciones por estado
  const completedEvaluations = evaluations.filter((e) => e.status === "completed")
  const inProgressEvaluations = evaluations.filter((e) => e.status === "in_progress")
  const notStartedEvaluations = evaluations.filter((e) => e.status === "not_started")

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Evaluaciones de Madurez</h1>
        <Button asChild>
          <Link href="/evaluaciones/nueva">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Link>
        </Button>
      </div>

      {/* Evaluaciones en progreso */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-yellow-500" />
          En Progreso ({inProgressEvaluations.length})
        </h2>

        {inProgressEvaluations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressEvaluations.map((evaluation) => (
              <Card key={evaluation.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{evaluation.name}</CardTitle>
                  <CardDescription>{evaluation.company?.name || "Sin empresa"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso</span>
                      <span>{evaluation.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-500 h-2.5 rounded-full"
                        style={{ width: `${evaluation.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Actualizada{" "}
                    {formatDistanceToNow(new Date(evaluation.updated_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild className="flex-1">
                      <Link href={`/evaluaciones/${evaluation.id}/editar`}>Continuar</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/evaluaciones/${evaluation.id}/resultados`}>Resultados</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-gray-500">No hay evaluaciones en progreso.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Evaluaciones completadas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          Completadas ({completedEvaluations.length})
        </h2>

        {completedEvaluations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedEvaluations.map((evaluation) => (
              <Card key={evaluation.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{evaluation.name}</CardTitle>
                  <CardDescription>{evaluation.company?.name || "Sin empresa"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Completada{" "}
                    {formatDistanceToNow(new Date(evaluation.completed_at || evaluation.updated_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/evaluaciones/${evaluation.id}/editar`}>Editar</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href={`/evaluaciones/${evaluation.id}/resultados`}>Ver Resultados</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-gray-500">No hay evaluaciones completadas.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Evaluaciones no iniciadas */}
      {notStartedEvaluations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-gray-500" />
            No Iniciadas ({notStartedEvaluations.length})
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notStartedEvaluations.map((evaluation) => (
              <Card key={evaluation.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{evaluation.name}</CardTitle>
                  <CardDescription>{evaluation.company?.name || "Sin empresa"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gray-500 h-2.5 rounded-full w-0"></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Creada{" "}
                    {formatDistanceToNow(new Date(evaluation.created_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/evaluaciones/${evaluation.id}/editar`}>Iniciar Evaluación</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Si no hay evaluaciones */}
      {evaluations.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No hay evaluaciones</CardTitle>
            <CardDescription>Comienza creando tu primera evaluación de madurez</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Las evaluaciones de madurez te permiten medir el nivel de desarrollo en diferentes áreas y obtener
              recomendaciones personalizadas para mejorar.
            </p>
            <Button asChild>
              <Link href="/evaluaciones/nueva">
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Primera Evaluación
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
