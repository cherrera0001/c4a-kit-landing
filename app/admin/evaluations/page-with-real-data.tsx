import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Eye, FileText } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase"

export const metadata = {
  title: "Evaluaciones | Sistema de Evaluación de Madurez",
  description: "Gestión de evaluaciones de madurez",
}

// Tipo para las evaluaciones
type Evaluation = {
  id: string
  name: string
  company: string
  status: "not_started" | "in_progress" | "completed"
  progress: number
  score: number | null
  created_at: string
  completed_at: string | null
}

export default async function EvaluationsPage() {
  // Obtener el cliente de Supabase para el servidor
  const supabase = await getSupabaseServerClient()

  // Consultar las evaluaciones desde la base de datos
  const { data: evaluations, error } = await supabase
    .from("evaluations")
    .select(`
      id,
      name,
      company_id,
      status,
      progress,
      score,
      created_at,
      completed_at,
      companies(name)
    `)
    .order("created_at", { ascending: false })

  // Transformar los datos para adaptarlos a nuestra interfaz
  const formattedEvaluations: Evaluation[] =
    evaluations?.map((evaluation) => ({
      id: evaluation.id,
      name: evaluation.name,
      company: evaluation.companies?.name || "Sin empresa",
      status: evaluation.status,
      progress: evaluation.progress || 0,
      score: evaluation.score,
      created_at: new Date(eval.created_at).toLocaleDateString(),
      completed_at: eval.completed_at ? new Date(eval.completed_at).toLocaleDateString() : null,
    })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Evaluaciones</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nueva Evaluación
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evaluaciones de Madurez</CardTitle>
          <CardDescription>
            Administra las evaluaciones de madurez de ciberseguridad realizadas en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar evaluaciones..." className="pl-8" />
            </div>
            <Button variant="outline">Filtrar</Button>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/15 p-4 text-destructive mb-4">
              Error al cargar evaluaciones: {error.message}
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Puntuación</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedEvaluations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron evaluaciones.
                    </TableCell>
                  </TableRow>
                ) : (
                  formattedEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.name}</TableCell>
                      <TableCell>{evaluation.company}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={evaluation.progress} className="h-2 w-[100px]" />
                          <span className="text-xs text-muted-foreground">{evaluation.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {evaluation.score !== null ? (
                          <span className="font-medium">{evaluation.score}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{evaluation.created_at}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Ver Detalles">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {evaluation.status === "completed" && (
                            <Button variant="ghost" size="icon" title="Ver Informe">
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
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
