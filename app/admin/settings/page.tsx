import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const metadata = {
  title: "Configuración | Sistema de Evaluación de Madurez",
  description: "Configuración del sistema de evaluación de madurez",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="domains">Dominios de Evaluación</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Configura los ajustes generales del sistema de evaluación de madurez.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-name">Nombre del Sistema</Label>
                <Input id="system-name" defaultValue="Sistema de Evaluación de Madurez de Ciberseguridad" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email de Administración</Label>
                <Input id="admin-email" type="email" defaultValue="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-language">Idioma Predeterminado</Label>
                <Select defaultValue="es">
                  <SelectTrigger id="default-language">
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">Inglés</SelectItem>
                    <SelectItem value="pt">Portugués</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Modo Mantenimiento</Label>
                  <p className="text-sm text-muted-foreground">
                    Activa el modo mantenimiento para realizar actualizaciones.
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>Configura los ajustes de seguridad del sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-policy">Política de Contraseñas</Label>
                <Select defaultValue="strong">
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Seleccionar política" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básica (mínimo 6 caracteres)</SelectItem>
                    <SelectItem value="medium">Media (mínimo 8 caracteres, 1 número)</SelectItem>
                    <SelectItem value="strong">Fuerte (mínimo 8 caracteres, mayúsculas, números y símbolos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Autenticación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">Requiere 2FA para todos los usuarios.</p>
                </div>
                <Switch id="two-factor" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ip-restriction">Restricción de IP</Label>
                  <p className="text-sm text-muted-foreground">Limita el acceso a rangos de IP específicos.</p>
                </div>
                <Switch id="ip-restriction" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo se envían las notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificaciones por correo electrónico.</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-user-notification">Nuevos Usuarios</Label>
                  <p className="text-sm text-muted-foreground">Notificar cuando se registre un nuevo usuario.</p>
                </div>
                <Switch id="new-user-notification" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="completed-evaluation-notification">Evaluaciones Completadas</Label>
                  <p className="text-sm text-muted-foreground">Notificar cuando se complete una evaluación.</p>
                </div>
                <Switch id="completed-evaluation-notification" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-template">Plantilla de Email</Label>
                <Textarea
                  id="email-template"
                  placeholder="Plantilla para notificaciones por email"
                  defaultValue="Estimado/a [nombre],\n\n[mensaje]\n\nSaludos,\nEquipo de Evaluación de Madurez"
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dominios de Evaluación</CardTitle>
              <CardDescription>Configura los dominios y criterios de evaluación de madurez.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Dominios Activos</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Gobierno de Seguridad</p>
                      <p className="text-sm text-muted-foreground">10 criterios de evaluación</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Gestión de Riesgos</p>
                      <p className="text-sm text-muted-foreground">8 criterios de evaluación</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Controles Técnicos</p>
                      <p className="text-sm text-muted-foreground">15 criterios de evaluación</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Respuesta a Incidentes</p>
                      <p className="text-sm text-muted-foreground">7 criterios de evaluación</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Cumplimiento</p>
                      <p className="text-sm text-muted-foreground">6 criterios de evaluación</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="custom-domains">Dominios Personalizados</Label>
                  <p className="text-sm text-muted-foreground">Permitir la creación de dominios personalizados.</p>
                </div>
                <Switch id="custom-domains" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weighted-scoring">Puntuación Ponderada</Label>
                  <p className="text-sm text-muted-foreground">Usar ponderación en la puntuación de dominios.</p>
                </div>
                <Switch id="weighted-scoring" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
