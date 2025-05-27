"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, Loader2, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [testType, setTestType] = useState<string | null>(null)

  const testEmail = async (endpoint: string) => {
    setLoading(true)
    setResult(null)
    setError(null)
    setTestType(endpoint)

    try {
      const response = await fetch(`/api/test-email/${endpoint}`)
      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Error desconocido al enviar el email")
      }
    } catch (err: any) {
      setError(err.message || "Error al realizar la prueba")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Prueba de Configuración SMTP</h1>

      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Modo de Vista Previa</AlertTitle>
        <AlertDescription className="text-amber-700">
          Estás en el entorno de vista previa donde las conexiones SMTP reales no están disponibles. Esta herramienta
          simulará las respuestas para fines de demostración. Para pruebas reales, implementa este código en tu entorno
          de producción.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="test" className="mb-6">
        <TabsList>
          <TabsTrigger value="test">Pruebas SMTP</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="troubleshoot">Solución de Problemas</TabsTrigger>
        </TabsList>

        <TabsContent value="test">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Prueba Estándar (TLS)</CardTitle>
                <CardDescription>Prueba la configuración SMTP con TLS (puerto 587)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Utiliza el puerto 587 con TLS, que es la configuración recomendada para la mayoría de los proveedores
                  SMTP.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => testEmail("")} disabled={loading} className="w-full">
                  {loading && testType === "" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Probar TLS
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prueba SSL</CardTitle>
                <CardDescription>Prueba la configuración SMTP con SSL (puerto 465)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Utiliza el puerto 465 con SSL, que es una alternativa segura si TLS no funciona correctamente.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => testEmail("secure")} disabled={loading} className="w-full">
                  {loading && testType === "secure" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Probar SSL
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prueba con Debug</CardTitle>
                <CardDescription>Prueba con información detallada de depuración</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Proporciona información detallada sobre la conexión SMTP, útil para diagnosticar problemas
                  específicos.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => testEmail("debug")} disabled={loading} className="w-full">
                  {loading && testType === "debug" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Probar con Debug
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configuración SMTP Recomendada para Zoho</CardTitle>
              <CardDescription>Utiliza estos valores en la configuración de Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Configuración TLS (Recomendada)</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p>
                        <strong>Host:</strong> smtp.zoho.com
                      </p>
                      <p>
                        <strong>Puerto:</strong> 587
                      </p>
                      <p>
                        <strong>Seguridad:</strong> TLS
                      </p>
                      <p>
                        <strong>Usuario:</strong> notificaciones@c4a.cl
                      </p>
                      <p>
                        <strong>Contraseña:</strong> [Tu contraseña]
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Configuración SSL (Alternativa)</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p>
                        <strong>Host:</strong> smtp.zoho.com
                      </p>
                      <p>
                        <strong>Puerto:</strong> 465
                      </p>
                      <p>
                        <strong>Seguridad:</strong> SSL
                      </p>
                      <p>
                        <strong>Usuario:</strong> notificaciones@c4a.cl
                      </p>
                      <p>
                        <strong>Contraseña:</strong> [Tu contraseña]
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Configuración de Remitente</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>
                      <strong>Nombre del Remitente:</strong> C4A - Notificaciones
                    </p>
                    <p>
                      <strong>Email del Remitente:</strong> notificaciones@c4a.cl
                    </p>
                    <p>
                      <strong>Intervalo Mínimo:</strong> 10 segundos (recomendado, en lugar de 60)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshoot">
          <Card>
            <CardHeader>
              <CardTitle>Solución de Problemas Comunes</CardTitle>
              <CardDescription>Guía para resolver problemas con la configuración SMTP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Error de Autenticación</h3>
                  <p className="text-sm text-gray-600 mb-2">Si recibes errores de autenticación:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Verifica que el usuario y contraseña sean correctos</li>
                    <li>Crea una contraseña de aplicación específica en Zoho</li>
                    <li>Asegúrate de que el acceso SMTP esté habilitado en tu cuenta de Zoho</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">Error de Conexión</h3>
                  <p className="text-sm text-gray-600 mb-2">Si no puedes conectarte al servidor SMTP:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Verifica que el host y puerto sean correctos</li>
                    <li>Prueba con la configuración SSL (puerto 465) si TLS no funciona</li>
                    <li>Asegúrate de que no haya restricciones de firewall</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">Límites de Envío</h3>
                  <p className="text-sm text-gray-600 mb-2">Si recibes errores de límite de envío:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Reduce el intervalo mínimo entre emails (a 10 segundos)</li>
                    <li>Verifica los límites de envío de tu cuenta de Zoho</li>
                    <li>Considera actualizar a un plan con mayores límites</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">Verificación de Dominio</h3>
                  <p className="text-sm text-gray-600 mb-2">Para mejorar la entrega de emails:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Asegúrate de que tu dominio esté verificado en Zoho</li>
                    <li>Configura registros SPF, DKIM y DMARC para tu dominio</li>
                    <li>Verifica que el email del remitente coincida con el dominio verificado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {loading && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Enviando email de prueba...</AlertTitle>
          <AlertDescription className="text-blue-700">
            Por favor espera mientras se procesa tu solicitud.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error al enviar email</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">Ver detalles técnicos</summary>
              <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </details>
          </AlertDescription>
        </Alert>
      )}

      {result && !error && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Email enviado correctamente</AlertTitle>
          <AlertDescription className="text-green-700">
            <p>ID del mensaje: {result.messageId}</p>
            {result.note && <p className="mt-2 text-amber-600 text-sm">{result.note}</p>}
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">Ver respuesta completa</summary>
              <pre className="mt-2 p-2 bg-green-50 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Instrucciones para Implementación Real</CardTitle>
          <CardDescription>Sigue estos pasos para probar la configuración SMTP en tu entorno real</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Implementa este código en tu entorno de producción o desarrollo</li>
            <li>Asegúrate de que las credenciales SMTP estén correctamente configuradas</li>
            <li>
              Navega a la ruta <code>/debug/test-email</code> en tu aplicación
            </li>
            <li>Utiliza los botones de prueba para verificar la configuración SMTP</li>
            <li>Revisa los mensajes de error detallados si hay problemas</li>
          </ol>
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> En el entorno de vista previa, las conexiones SMTP reales no están disponibles
              debido a limitaciones del entorno. Para pruebas reales, debes implementar este código en tu entorno de
              producción o desarrollo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
