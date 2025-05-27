"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FeatureAvailabilityCheck } from "./feature-availability-check"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface PersonalizedRecommendationsProps {
  evaluationId: string
  domainScores: {
    domain_id: string
    domain_name: string
    score: number
    maturity_level: string
  }[]
}

export function PersonalizedRecommendations({ evaluationId, domainScores }: PersonalizedRecommendationsProps) {
  // Ordenar dominios por puntuación (de menor a mayor)
  const sortedDomains = [...domainScores].sort((a, b) => a.score - b.score)

  // Obtener los 3 dominios con menor puntuación
  const priorityDomains = sortedDomains.slice(0, 3)

  return (
    <FeatureAvailabilityCheck
      evaluationId={evaluationId}
      feature="recomendaciones_personalizadas"
      fallbackMessage="Las recomendaciones personalizadas están disponibles en los planes Profesional y Enterprise."
    >
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
          <CardDescription>
            Basadas en los resultados de tu evaluación, estas son las áreas prioritarias y acciones recomendadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="text-lg font-medium mb-2">Áreas Prioritarias de Mejora</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Estas son las áreas que requieren atención inmediata basadas en tus resultados:
              </p>

              <div className="space-y-3">
                {priorityDomains.map((domain, index) => (
                  <div
                    key={domain.domain_id}
                    className="flex items-center justify-between p-3 bg-background rounded-md border"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <h4 className="font-medium">{domain.domain_name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nivel actual: {domain.maturity_level} ({domain.score.toFixed(1)}/5)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue={priorityDomains[0]?.domain_id}>
              <TabsList className="mb-4">
                {priorityDomains.map((domain) => (
                  <TabsTrigger key={domain.domain_id} value={domain.domain_id}>
                    {domain.domain_name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {priorityDomains.map((domain) => (
                <TabsContent key={domain.domain_id} value={domain.domain_id} className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-2">Acciones Recomendadas para {domain.domain_name}</h3>

                    {domain.domain_name === "Gobernanza de Seguridad" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">1. Desarrollar políticas de seguridad formales</h4>
                          <p className="text-sm mt-1">
                            Establecer un conjunto completo de políticas de seguridad de la información, aprobadas por
                            la dirección y comunicadas a toda la organización.
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">2. Designar responsables de seguridad</h4>
                          <p className="text-sm mt-1">
                            Asignar formalmente roles y responsabilidades de seguridad, incluyendo un CISO o responsable
                            de seguridad con mandato claro.
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">3. Implementar programa de concientización</h4>
                          <p className="text-sm mt-1">
                            Desarrollar y ejecutar un programa regular de formación y concientización en seguridad para
                            todos los empleados.
                          </p>
                        </div>
                      </div>
                    )}

                    {domain.domain_name === "Gestión de Riesgos" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">1. Establecer metodología de evaluación de riesgos</h4>
                          <p className="text-sm mt-1">
                            Implementar un proceso formal para identificar, evaluar y priorizar riesgos de seguridad de
                            manera sistemática.
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">2. Desarrollar planes de tratamiento de riesgos</h4>
                          <p className="text-sm mt-1">
                            Crear planes documentados para mitigar, transferir o aceptar riesgos identificados, con
                            responsables y plazos claros.
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">3. Implementar evaluación de riesgos de terceros</h4>
                          <p className="text-sm mt-1">
                            Establecer un proceso para evaluar y gestionar los riesgos introducidos por proveedores y
                            socios comerciales.
                          </p>
                        </div>
                      </div>
                    )}

                    {domain.domain_name === "Control de Acceso" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">1. Implementar gestión de identidades centralizada</h4>
                          <p className="text-sm mt-1">
                            Establecer un sistema centralizado para gestionar el ciclo de vida completo de las
                            identidades y cuentas de usuario.
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">2. Aplicar principio de privilegio mínimo</h4>
                          <p className="text-sm mt-1">
                            Revisar y ajustar permisos para asegurar que los usuarios solo tengan acceso a los recursos
                            necesarios para sus funciones.
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <h4 className="font-medium">3. Implementar autenticación multifactor</h4>
                          <p className="text-sm mt-1">
                            Desplegar MFA para todos los accesos privilegiados y remotos, y gradualmente para todos los
                            usuarios.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Contenido para otros dominios se generaría de manera similar */}
                    {!["Gobernanza de Seguridad", "Gestión de Riesgos", "Control de Acceso"].includes(
                      domain.domain_name,
                    ) && (
                      <p className="text-sm text-muted-foreground">
                        Se generarán recomendaciones personalizadas para este dominio basadas en tus respuestas
                        específicas.
                      </p>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </FeatureAvailabilityCheck>
  )
}
