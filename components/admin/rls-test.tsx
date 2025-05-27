"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { RlsTestService } from "@/services/rls-test-service"

export function RlsTest() {
  const [userId, setUserId] = useState("")
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("evaluations")

  // Establecer el ID del usuario actual
  const handleSetUserId = async () => {
    if (!userId) return

    setLoading(true)
    try {
      await RlsTestService.setCurrentUserId(userId)
      const adminStatus = await RlsTestService.checkIsAdmin()
      setIsAdmin(adminStatus)
      setTestResults(null)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Probar acceso según la pestaña activa
  const handleTestAccess = async () => {
    setLoading(true)
    try {
      let result

      switch (activeTab) {
        case "evaluations":
          result = await RlsTestService.testEvaluationsAccess()
          break
        case "companies":
          result = await RlsTestService.testCompaniesAccess()
          break
        case "dashboard":
          result = await RlsTestService.testDashboardFunctions()
          break
        default:
          result = { success: false, error: "Pestaña no válida" }
      }

      setTestResults(result)
    } catch (error) {
      console.error("Error:", error)
      setTestResults({ success: false, error: "Error al realizar la prueba" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prueba de Row Level Security (RLS)</CardTitle>
        <CardDescription>Verifica que las políticas RLS estén funcionando correctamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuración de usuario */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-id">ID de Usuario</Label>
            <div className="flex gap-2">
              <Input
                id="user-id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Ingresa el ID del usuario para probar"
              />
              <Button onClick={handleSetUserId} disabled={loading || !userId}>
                Establecer
              </Button>
            </div>
          </div>

          {isAdmin !== null && (
            <Alert variant={isAdmin ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {isAdmin ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                <AlertTitle>Estado de Administrador</AlertTitle>
              </div>
              <AlertDescription>
                {isAdmin
                  ? "Este usuario tiene permisos de administrador"
                  : "Este usuario NO tiene permisos de administrador"}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Pestañas de prueba */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="evaluations">Evaluaciones</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluations" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Prueba el acceso a las evaluaciones según las políticas RLS.
            </p>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <p className="text-sm text-muted-foreground">Prueba el acceso a las empresas según las políticas RLS.</p>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <p className="text-sm text-muted-foreground">Prueba las funciones del dashboard implementadas.</p>
          </TabsContent>
        </Tabs>

        {/* Botón de prueba */}
        <Button onClick={handleTestAccess} disabled={loading || isAdmin === null} className="w-full">
          {loading ? "Probando..." : "Probar Acceso"}
        </Button>

        {/* Resultados de la prueba */}
        {testResults && (
          <div className="space-y-4">
            <Alert variant={testResults.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {testResults.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>Resultado de la Prueba</AlertTitle>
              </div>
              <AlertDescription>
                {testResults.success ? "La prueba fue exitosa" : `Error: ${testResults.error}`}
              </AlertDescription>
            </Alert>

            {testResults.success && testResults.data && (
              <div className="rounded border p-4">
                <h4 className="mb-2 font-medium">Datos obtenidos:</h4>
                <pre className="max-h-60 overflow-auto rounded bg-muted p-2 text-xs">
                  {JSON.stringify(testResults.data, null, 2)}
                </pre>
              </div>
            )}

            {testResults.success && testResults.stats && (
              <div className="rounded border p-4">
                <h4 className="mb-2 font-medium">Estadísticas del Dashboard:</h4>
                <pre className="max-h-60 overflow-auto rounded bg-muted p-2 text-xs">
                  {JSON.stringify(testResults.stats, null, 2)}
                </pre>
              </div>
            )}

            {testResults.success && testResults.distribution && (
              <div className="rounded border p-4">
                <h4 className="mb-2 font-medium">Distribución de Madurez:</h4>
                <pre className="max-h-60 overflow-auto rounded bg-muted p-2 text-xs">
                  {JSON.stringify(testResults.distribution, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Las políticas RLS controlan el acceso a los datos según el rol del usuario.
        </p>
      </CardFooter>
    </Card>
  )
}
