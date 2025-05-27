"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FeatureAvailabilityCheck } from "./feature-availability-check"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface IndustryComparisonProps {
  evaluationId: string
  evaluationScore: number
  domainScores: {
    domain_name: string
    score: number
  }[]
}

export function IndustryComparison({ evaluationId, evaluationScore, domainScores }: IndustryComparisonProps) {
  // En un caso real, estos datos vendrían de una API
  const industryAverages = {
    overall: 3.2,
    domains: {
      "Gobernanza de Seguridad": 3.4,
      "Gestión de Riesgos": 3.1,
      "Control de Acceso": 3.5,
      "Seguridad de Datos": 3.0,
      "Seguridad de Aplicaciones": 2.8,
      "Seguridad de Infraestructura": 3.3,
      "Gestión de Incidentes": 3.0,
      "Continuidad del Negocio": 2.9,
    },
  }

  // Preparar datos para el gráfico
  const chartData = domainScores.map((domain) => ({
    name: domain.domain_name,
    "Tu Organización": domain.score,
    "Promedio de la Industria":
      industryAverages.domains[domain.domain_name as keyof typeof industryAverages.domains] || 0,
  }))

  return (
    <FeatureAvailabilityCheck
      evaluationId={evaluationId}
      feature="comparativa_industria"
      fallbackMessage="La comparativa con la industria está disponible en los planes Profesional y Enterprise."
    >
      <Card>
        <CardHeader>
          <CardTitle>Comparativa con la Industria</CardTitle>
          <CardDescription>
            Compara tus resultados con el promedio de organizaciones similares en tu industria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border rounded-md">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium">Puntuación General</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Tu Organización</p>
                    <p className="text-2xl font-bold">{evaluationScore.toFixed(1)}</p>
                  </div>
                  <div className="text-2xl">vs</div>
                  <div>
                    <p className="text-sm text-muted-foreground">Promedio Industria</p>
                    <p className="text-2xl font-bold">{industryAverages.overall.toFixed(1)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-2 rounded-md text-sm">
                {evaluationScore > industryAverages.overall ? (
                  <p className="text-green-600">Tu organización está por encima del promedio de la industria.</p>
                ) : evaluationScore < industryAverages.overall ? (
                  <p className="text-amber-600">Tu organización está por debajo del promedio de la industria.</p>
                ) : (
                  <p>Tu organización está en línea con el promedio de la industria.</p>
                )}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Tu Organización" fill="#8884d8" />
                  <Bar dataKey="Promedio de la Industria" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </FeatureAvailabilityCheck>
  )
}
