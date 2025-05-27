"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Lock, Mail, Key } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TestStatus = "idle" | "loading" | "success" | "error" | "warning"

interface TestResult {
  status: TestStatus
  message: string
  details?: string
}

export default function SupabaseConnectionTester() {
  // Estado para cada prueba
  const [connectionTest, setConnectionTest] = useState<TestResult>({
    status: "idle",
    message: "No se ha ejecutado la prueba",
  })
  const [authTest, setAuthTest] = useState<TestResult>({
    status: "idle",
    message: "No se ha ejecutado la prueba",
  })
  const [rlsTest, setRlsTest] = useState<TestResult>({
    status: "idle",
    message: "No se ha ejecutado la prueba",
  })
  const [envVarsTest, setEnvVarsTest] = useState<TestResult>({
    status: "idle",
    message: "No se ha ejecutado la prueba",
  })
  const [isTestingAll, setIsTestingAll] = useState(false)

  // Obtenemos el cliente una sola vez
  const supabase = getSupabaseClient()

  // Prueba de conexión básica
  const testConnection = async () => {
    setConnectionTest({ status: "loading", message: "Probando conexión..." })

    try {
      // Intentamos hacer una operación simple para verificar la conexión
      const { data, error } = await supabase.from("roles").select("count(*)").single()

      if (error) {
        throw error
      }

      setConnectionTest({
        status: "success",
        message: "Conexión exitosa a Supabase",
        details: `Se pudo conectar correctamente a la API de Supabase y consultar la tabla 'roles'.`,
      })
    } catch (err: any) {
      console.error("Error al probar la conexión:", err)
      setConnectionTest({
        status: "error",
        message: `Error de conexión: ${err.message || "Desconocido"}`,
        details: err.code ? `Código de error: ${err.code}` : undefined,
      })
    }
  }

  // Prueba de autenticación
  const testAuth = async () => {
    setAuthTest({ status: "loading", message: "Probando autenticación..." })

    try {
      // Verificamos si podemos acceder a la sesión actual
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      // Verificamos si podemos obtener la configuración de autenticación
      const { data: authSettings, error: authError } = await supabase.auth.admin
        .listUsers({
          perPage: 1,
        })
        .catch(() => {
          // Si falla, es porque no tenemos permisos de admin, lo cual es esperado
          return { data: null, error: null }
        })

      if (session) {
        setAuthTest({
          status: "success",
          message: "Autenticación funcionando correctamente",
          details: `Usuario autenticado: ${session.user.email}`,
        })
      } else {
        setAuthTest({
          status: "warning",
          message: "Configuración de autenticación correcta, pero no hay sesión activa",
          details: "Puedes iniciar sesión para verificar el flujo completo de autenticación.",
        })
      }
    } catch (err: any) {
      console.error("Error al probar la autenticación:", err)
      setAuthTest({
        status: "error",
        message: `Error de autenticación: ${err.message || "Desconocido"}`,
        details: err.code ? `Código de error: ${err.code}` : undefined,
      })
    }
  }

  // Prueba de RLS (Row Level Security)
  const testRLS = async () => {
    setRlsTest({ status: "loading", message: "Probando políticas RLS..." })

    try {
      // Intentamos acceder a datos protegidos por RLS
      const { data: session } = await supabase.auth.getSession()

      // Primero probamos con una tabla que debería ser accesible para todos
      const { data: publicData, error: publicError } = await supabase.from("roles").select("*").limit(1)

      if (publicError) {
        throw { ...publicError, context: "acceso público" }
      }

      // Luego probamos con una tabla que debería estar protegida
      const { data: protectedData, error: protectedError } = await supabase.from("user_profiles").select("*").limit(5)

      if (session?.user) {
        if (protectedData && protectedData.length > 0) {
          setRlsTest({
            status: "success",
            message: "Políticas RLS funcionando correctamente",
            details: `Usuario autenticado puede acceder a datos protegidos. Se encontraron ${protectedData.length} perfiles.`,
          })
        } else if (protectedError) {
          setRlsTest({
            status: "error",
            message: "Error al acceder a datos protegidos a pesar de estar autenticado",
            details: `Error: ${protectedError.message}`,
          })
        } else {
          setRlsTest({
            status: "warning",
            message: "No se encontraron datos protegidos",
            details: "El usuario está autenticado pero no se encontraron registros en la tabla user_profiles.",
          })
        }
      } else {
        // Si no hay sesión, verificamos que no podamos acceder a datos protegidos
        if (protectedError) {
          setRlsTest({
            status: "success",
            message: "Políticas RLS funcionando correctamente",
            details: "Usuario no autenticado no puede acceder a datos protegidos, como es esperado.",
          })
        } else if (protectedData && protectedData.length > 0) {
          setRlsTest({
            status: "warning",
            message: "Posible problema con políticas RLS",
            details: "Usuario no autenticado puede acceder a datos que deberían estar protegidos.",
          })
        } else {
          setRlsTest({
            status: "warning",
            message: "No se encontraron datos protegidos",
            details:
              "No hay sesión activa y no se encontraron registros. No se puede determinar si las políticas RLS están funcionando.",
          })
        }
      }
    } catch (err: any) {
      console.error("Error al probar RLS:", err)
      setRlsTest({
        status: "error",
        message: `Error al probar políticas RLS: ${err.message || "Desconocido"}`,
        details: err.context ? `Contexto: ${err.context}` : undefined,
      })
    }
  }

  // Prueba de variables de entorno
  const testEnvVars = async () => {
    setEnvVarsTest({ status: "loading", message: "Verificando variables de entorno..." })

    try {
      const issues = []

      // Verificamos las variables públicas
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        issues.push("NEXT_PUBLIC_SUPABASE_URL no está definida")
      }

      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida")
      }

      // Verificamos si la URL es correcta intentando hacer una petición
      const { error: urlError } = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}/rest/v1/`)
        .then((res) => ({ error: res.status >= 400 ? { status: res.status } : null }))
        .catch((err) => ({ error: err }))

      if (urlError) {
        issues.push(
          `La URL de Supabase parece incorrecta: ${urlError.status || urlError.message || "Error desconocido"}`,
        )
      }

      if (issues.length > 0) {
        setEnvVarsTest({
          status: "error",
          message: "Problemas con las variables de entorno",
          details: issues.join("\n"),
        })
      } else {
        setEnvVarsTest({
          status: "success",
          message: "Variables de entorno configuradas correctamente",
          details: `URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\nClave anónima: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10)}...`,
        })
      }
    } catch (err: any) {
      console.error("Error al verificar variables de entorno:", err)
      setEnvVarsTest({
        status: "error",
        message: `Error al verificar variables de entorno: ${err.message || "Desconocido"}`,
        details: err.stack,
      })
    }
  }

  // Ejecutar todas las pruebas
  const runAllTests = async () => {
    setIsTestingAll(true)
    await testConnection()
    await testAuth()
    await testRLS()
    await testEnvVars()
    setIsTestingAll(false)
  }

  // Renderizar el estado de una prueba
  const renderTestStatus = (test: TestResult) => {
    switch (test.status) {
      case "idle":
        return <span className="text-gray-500">No ejecutado</span>
      case "loading":
        return (
          <span className="text-blue-500 flex items-center">
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> {test.message}
          </span>
        )
      case "success":
        return (
          <span className="text-green-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" /> {test.message}
          </span>
        )
      case "warning":
        return (
          <span className="text-amber-600 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" /> {test.message}
          </span>
        )
      case "error":
        return (
          <span className="text-red-600 flex items-center">
            <XCircle className="h-4 w-4 mr-1" /> {test.message}
          </span>
        )
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Diagnóstico de Conexión a Supabase
        </CardTitle>
        <CardDescription>
          Esta herramienta verifica la conexión a Supabase y diagnostica posibles problemas
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="connection">Conexión</TabsTrigger>
            <TabsTrigger value="auth">Autenticación</TabsTrigger>
            <TabsTrigger value="rls">Seguridad RLS</TabsTrigger>
            <TabsTrigger value="env">Variables de Entorno</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <Database className="h-4 w-4 mr-2 text-blue-600" />
                    <h3 className="font-medium">Conexión a Supabase</h3>
                  </div>
                  <div>{renderTestStatus(connectionTest)}</div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <Lock className="h-4 w-4 mr-2 text-blue-600" />
                    <h3 className="font-medium">Autenticación</h3>
                  </div>
                  <div>{renderTestStatus(authTest)}</div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <Key className="h-4 w-4 mr-2 text-blue-600" />
                    <h3 className="font-medium">Políticas de Seguridad (RLS)</h3>
                  </div>
                  <div>{renderTestStatus(rlsTest)}</div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    <h3 className="font-medium">Variables de Entorno</h3>
                  </div>
                  <div>{renderTestStatus(envVarsTest)}</div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button onClick={runAllTests} disabled={isTestingAll} className="w-full max-w-xs">
                  {isTestingAll ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Ejecutando pruebas...
                    </>
                  ) : (
                    <>Ejecutar todas las pruebas</>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connection">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Estado de la conexión</h3>
                <div>{renderTestStatus(connectionTest)}</div>

                {connectionTest.details && (
                  <Alert className="mt-4">
                    <AlertDescription>{connectionTest.details}</AlertDescription>
                  </Alert>
                )}

                {connectionTest.status === "error" && (
                  <div className="mt-4 text-sm">
                    <h4 className="font-medium">Posibles soluciones:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Verifica que la URL de Supabase sea correcta</li>
                      <li>Comprueba que la clave anónima sea válida</li>
                      <li>Asegúrate de que no haya problemas de red o firewall</li>
                      <li>Verifica que el proyecto de Supabase esté activo</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={testConnection} disabled={connectionTest.status === "loading"}>
                  {connectionTest.status === "loading" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Probando...
                    </>
                  ) : (
                    <>Probar conexión</>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Estado de la autenticación</h3>
                <div>{renderTestStatus(authTest)}</div>

                {authTest.details && (
                  <Alert className="mt-4">
                    <AlertDescription>{authTest.details}</AlertDescription>
                  </Alert>
                )}

                {authTest.status === "error" && (
                  <div className="mt-4 text-sm">
                    <h4 className="font-medium">Posibles soluciones:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Verifica la configuración de autenticación en Supabase</li>
                      <li>Comprueba que las URLs de redirección estén configuradas correctamente</li>
                      <li>Asegúrate de que la clave JWT secreta sea correcta</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={testAuth} disabled={authTest.status === "loading"}>
                  {authTest.status === "loading" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Probando...
                    </>
                  ) : (
                    <>Probar autenticación</>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rls">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Estado de las políticas RLS</h3>
                <div>{renderTestStatus(rlsTest)}</div>

                {rlsTest.details && (
                  <Alert className="mt-4">
                    <AlertDescription>{rlsTest.details}</AlertDescription>
                  </Alert>
                )}

                {rlsTest.status === "error" && (
                  <div className="mt-4 text-sm">
                    <h4 className="font-medium">Posibles soluciones:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Verifica que RLS esté habilitado en las tablas</li>
                      <li>Comprueba las políticas de acceso en cada tabla</li>
                      <li>Asegúrate de que las funciones de RLS estén correctamente definidas</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={testRLS} disabled={rlsTest.status === "loading"}>
                  {rlsTest.status === "loading" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Probando...
                    </>
                  ) : (
                    <>Probar políticas RLS</>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="env">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Estado de las variables de entorno</h3>
                <div>{renderTestStatus(envVarsTest)}</div>

                {envVarsTest.details && (
                  <Alert className="mt-4">
                    <AlertDescription className="whitespace-pre-line">{envVarsTest.details}</AlertDescription>
                  </Alert>
                )}

                {envVarsTest.status === "error" && (
                  <div className="mt-4 text-sm">
                    <h4 className="font-medium">Posibles soluciones:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Verifica que las variables estén definidas en tu archivo .env.local</li>
                      <li>Comprueba que las variables estén configuradas en tu plataforma de despliegue</li>
                      <li>Asegúrate de que los valores sean correctos</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={testEnvVars} disabled={envVarsTest.status === "loading"}>
                  {envVarsTest.status === "loading" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>Verificar variables</>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">Última actualización: {new Date().toLocaleString()}</div>
        <Button variant="outline" onClick={runAllTests} disabled={isTestingAll}>
          {isTestingAll ? "Ejecutando..." : "Actualizar todo"}
        </Button>
      </CardFooter>
    </Card>
  )
}
