import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseServerClient } from "@/lib/supabase"
import { getEvaluationResponsesByDomain } from "@/services/maturity-service"
import { ChevronLeft, FileText, Edit, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface EvaluationPageProps {
  params: {
    id: string
  }
}

export default async function EvaluationDetailPage({ params }: EvaluationPageProps) {
  const evaluationId = params.id

  try {
    // Obtener información de la evaluación
    const supabase = await getSupabaseServerClient()
    const { data: evaluation, error } = await supabase
      .from("evaluations")
      .select(`
        id,
        name,
        company_id,
        created_by,
        status,
        progress,
        score,
        notes,
        created_at,
        started_at,
        completed_at,
        companies (
          id,
          name,
          industry_id,
          contact_name,
          contact_email,
          industries (
            name
          )
        ),
        users (
          id,
          full_name,
          email
        )
      `)
      .eq("id", evaluationId)
      .single()

    if (error || !evaluation) {
      console.error("Error al obtener la evaluación:", error)
      return notFound()
    }

    // Obtener respuestas agrupadas por dominio
    const responsesByDomain = await getEvaluationResponsesByDomain(evaluationId)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/evaluations">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-2xl font-bold">Detalles de Evaluación</h2>
          </div>

          <div className="flex gap-2">
            {evaluation.status === "completed" ? (
              <Button asChild>
                <Link href={`/admin/evaluations/${evaluationId}/report`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Informe
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/admin/evaluations/${evaluationId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Evaluación
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{evaluation.name}</CardTitle>
                  <CardDescription>
                    Empresa: {evaluation.companies?.name} | Industria:{" "}
                    {evaluation.companies?.industries?.name || "No especificada"}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    evaluation.status === "completed"
                      ? "success"
                      : evaluation.status === "in_progress"
                        ? "default"
                        : "outline"
                  }
                >
                  {evaluation.status === "completed"
                    ? "Completada"
                    : evaluation.status === "in_progress"
                      ? "En Progreso"
                      : "No Iniciada"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Progreso</span>
                    <span className="text-sm">{evaluation.progress}%</span>
                  </div>
                  <Progress value={evaluation.progress} className="h-2" />
                </div>

                {evaluation.score !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Puntuación:</span>
                    <span>{evaluation.score} / 5</span>
                    <Badge variant="secondary">{getMaturityLevelName(evaluation.score)}</Badge>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 pt-2">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Información de Evaluación</h3>
                    <dl className="space-y-1 text-sm">
                      <div className="flex">
                        <dt className="w-32 text-muted-foreground">Fecha creación:</dt>
                        <dd>{new Date(evaluation.created_at).toLocaleDateString()}</dd>
                      </div>
                      {evaluation.started_at && (
                        <div className="flex">
                          <dt className="w-32 text-muted-foreground">Fecha inicio:</dt>
                          <dd>{new Date(evaluation.started_at).toLocaleDateString()}</dd>
                        </div>
                      )}
                      {evaluation.completed_at && (
                        <div className="flex">
                          <dt className="w-32 text-muted-foreground">Fecha fin:</dt>
                          <dd>{new Date(evaluation.completed_at).toLocaleDateString()}</dd>
                        </div>
                      )}
                      <div className="flex">
                        <dt className="w-32 text-muted-foreground">Creado por:</dt>
                        <dd>{evaluation.users?.full_name || "No especificado"}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Información de Contacto</h3>
                    <dl className="space-y-1 text-sm">
                      <div className="flex">
                        <dt className="w-32 text-muted-foreground">Contacto:</dt>
                        <dd>{evaluation.companies?.contact_name || "No especificado"}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-32 text-muted-foreground">Email:</dt>
                        <dd>{evaluation.companies?.contact_email || "No especificado"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {evaluation.notes && (
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-1">Notas</h3>
                    <p className="text-sm text-muted-foreground">{evaluation.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de Dominios</CardTitle>
              <CardDescription>Progreso por dominio de evaluación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(responsesByDomain).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay respuestas registradas para esta evaluación.</p>
                ) : (
                  Object.values(responsesByDomain).map((domain: any) => {
                    const totalQuestions = domain.responses.length
                    const answeredQuestions = domain.responses.filter((r: any) => r.response_value !== null).length
                    const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

                    return (
                      <div key={domain.domain_id} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{domain.domain_name}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {answeredQuestions} de {totalQuestions} preguntas
                          </span>
                          {progress === 100 && <CheckCircle className="h-3 w-3 text-green-500" />}
                          {progress > 0 && progress < 100 && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Respuestas por Dominio</CardTitle>
            <CardDescription>Detalle de las respuestas registradas en la evaluación</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(responsesByDomain).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay respuestas registradas para esta evaluación.</p>
                <Button className="mt-4" asChild>
                  <Link href={`/admin/evaluations/${evaluationId}/edit`}>Comenzar Evaluación</Link>
                </Button>
              </div>
            ) : (
              <Tabs defaultValue={Object.keys(responsesByDomain)[0]}>
                <TabsList className="mb-4 flex flex-wrap">
                  {Object.values(responsesByDomain).map((domain: any) => (
                    <TabsTrigger key={domain.domain_id} value={domain.domain_id}>
                      {domain.domain_name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.values(responsesByDomain).map((domain: any) => (
                  <TabsContent key={domain.domain_id} value={domain.domain_id} className="space-y-4">
                    {domain.responses.map((response: any) => (
                      <Card key={response.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{response.question.text}</CardTitle>
                          {response.question.description && (
                            <CardDescription>{response.question.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Nivel de Madurez:</span>
                              <Badge variant="outline">{response.question.maturity_level}</Badge>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Respuesta:</span>
                              {response.response_value !== null ? (
                                <Badge
                                  variant={
                                    response.response_value >= 4
                                      ? "success"
                                      : response.response_value >= 3
                                        ? "default"
                                        : response.response_value >= 2
                                          ? "secondary"
                                          : "destructive"
                                  }
                                >
                                  {response.response_value} / 5
                                </Badge>
                              ) : (
                                <Badge variant="outline">Sin respuesta</Badge>
                              )}
                            </div>

                            {response.comments && (
                              <div>
                                <span className="text-sm font-medium">Comentarios:</span>
                                <p className="text-sm text-muted-foreground mt-1">{response.comments}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error al cargar la evaluación:", error)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Error al Cargar Evaluación</h2>
          <Button variant="outline" asChild>
            <Link href="/admin/evaluations">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Evaluaciones
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">
              Se produjo un error al cargar los detalles de la evaluación. Por favor, inténtelo de nuevo más tarde.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Si el problema persiste, contacte con el administrador del sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}

// Función para obtener el nombre del nivel de madurez
function getMaturityLevelName(score: number): string {
  if (score < 1.5) return "Inicial"
  if (score < 2.5) return "Gestionado"
  if (score < 3.5) return "Definido"
  if (score < 4.5) return "Cuantificado"
  return "Optimizado"
}
