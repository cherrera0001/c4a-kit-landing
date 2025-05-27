import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseServerClient } from "@/lib/supabase"
import { BarChart } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient()

  // Obtener estadísticas generales
  const { data: stats, error: statsError } = await supabase.rpc("get_dashboard_stats")

  // Obtener distribución de niveles de madurez
  const { data: maturityDistribution, error: maturityError } = await supabase.rpc("get_maturity_distribution")

  // Obtener evaluaciones recientes
  const { data: recentEvaluations, error: evalError } = await supabase
    .from("evaluations")
    .select(`
      id,
      name,
      status,
      progress,
      score,
      created_at,
      companies (
        name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  // Si hay errores, mostrar mensaje genérico
  const hasErrors = statsError || maturityError || evalError

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      {hasErrors ? (
        <div className="bg-destructive/10 p-4 rounded-md">
          <p className="text-destructive font-medium">
            Se produjo un error al cargar los datos del dashboard. Por favor, inténtelo de nuevo más tarde.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Evaluaciones</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_evaluations || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.completed_evaluations || 0} completadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Empresas Evaluadas</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_companies || 0}</div>
                <p className="text-xs text-muted-foreground">En {stats?.total_sectors || 0} sectores diferentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.avg_score?.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-muted-foreground">De 5 puntos posibles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.avg_progress?.toFixed(0) || 0}%</div>
                <p className="text-xs text-muted-foreground">De todas las evaluaciones</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recent">Evaluaciones Recientes</TabsTrigger>
              <TabsTrigger value="maturity">Distribución de Madurez</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evaluaciones Recientes</CardTitle>
                  <CardDescription>Las últimas evaluaciones realizadas en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {recentEvaluations?.map((evaluation) => (
                      <div key={evaluation.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{evaluation.name}</p>
                          <p className="text-sm text-muted-foreground">{evaluation.companies?.name}</p>
                        </div>
                        <div className="ml-auto font-medium">
                          {evaluation.score ? `${evaluation.score.toFixed(2)}/5` : "Sin puntuar"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="maturity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Niveles de Madurez</CardTitle>
                  <CardDescription>Distribución de evaluaciones por nivel de madurez</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {maturityDistribution?.map((level) => (
                      <div key={level.level} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{level.name}</p>
                          <p className="text-sm text-muted-foreground">Nivel {level.level}</p>
                        </div>
                        <div className="ml-auto font-medium">
                          {level.count} evaluaciones ({level.percentage.toFixed(1)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
