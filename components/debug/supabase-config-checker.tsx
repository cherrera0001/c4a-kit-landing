"use client"

import { useState, useEffect } from "react"
import { supabaseClientConfig, isSupabaseConfigValid } from "@/lib/supabase-config"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function SupabaseConfigChecker() {
  const [configStatus, setConfigStatus] = useState<"loading" | "valid" | "invalid">("loading")
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "success" | "error">("loading")
  const [authStatus, setAuthStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [configDetails, setConfigDetails] = useState<any>(null)

  useEffect(() => {
    // Verificar la configuración
    const checkConfig = () => {
      try {
        const isValid = isSupabaseConfigValid()
        setConfigStatus(isValid ? "valid" : "invalid")

        // Mostrar detalles de configuración (sanitizados)
        setConfigDetails({
          url: supabaseClientConfig.url ? `${supabaseClientConfig.url.substring(0, 30)}...` : "No configurada",
          anonKey: supabaseClientConfig.anonKey
            ? `${supabaseClientConfig.anonKey.substring(0, 10)}...`
            : "No configurada",
        })
      } catch (error: any) {
        setConfigStatus("invalid")
        setErrorDetails(`Error al verificar configuración: ${error.message}`)
      }
    }

    // Verificar la conexión
    const checkConnection = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("roles").select("*").limit(1)

        if (error) throw error

        setConnectionStatus("success")
      } catch (error: any) {
        setConnectionStatus("error")
        setErrorDetails((prev) => `${prev || ""}\nError de conexión: ${error.message}`)
      }
    }

    // Verificar la autenticación
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.auth.getSession()

        // No es un error si no hay sesión, solo verificamos que la API funcione
        if (error) throw error

        setAuthStatus("success")
      } catch (error: any) {
        setAuthStatus("error")
        setErrorDetails((prev) => `${prev || ""}\nError de autenticación: ${error.message}`)
      }
    }

    checkConfig()
    checkConnection()
    checkAuth()
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Configuración de Supabase
            {configStatus === "loading" && <Badge className="bg-yellow-500">Verificando...</Badge>}
            {configStatus === "valid" && <Badge className="bg-green-500">Válida</Badge>}
            {configStatus === "invalid" && <Badge className="bg-red-500">Inválida</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {configDetails && (
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-semibold mr-2">URL:</span>
                <span>{configDetails.url}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Clave Anónima:</span>
                <span>{configDetails.anonKey}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Conexión a la Base de Datos
            {connectionStatus === "loading" && <Badge className="bg-yellow-500">Verificando...</Badge>}
            {connectionStatus === "success" && <Badge className="bg-green-500">Conectado</Badge>}
            {connectionStatus === "error" && <Badge className="bg-red-500">Error</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectionStatus === "loading" && <p>Verificando conexión a la base de datos...</p>}
          {connectionStatus === "success" && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Conexión exitosa a la base de datos</span>
            </div>
          )}
          {connectionStatus === "error" && (
            <div className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              <span>Error al conectar a la base de datos</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Servicio de Autenticación
            {authStatus === "loading" && <Badge className="bg-yellow-500">Verificando...</Badge>}
            {authStatus === "success" && <Badge className="bg-green-500">Funcionando</Badge>}
            {authStatus === "error" && <Badge className="bg-red-500">Error</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {authStatus === "loading" && <p>Verificando servicio de autenticación...</p>}
          {authStatus === "success" && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Servicio de autenticación funcionando correctamente</span>
            </div>
          )}
          {authStatus === "error" && (
            <div className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              <span>Error en el servicio de autenticación</span>
            </div>
          )}
        </CardContent>
      </Card>

      {errorDetails && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Detalles de Errores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-red-700 text-sm p-2 bg-red-100 rounded">{errorDetails}</pre>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Solución de problemas:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Verifica que las variables de entorno estén correctamente configuradas en Vercel.</li>
          <li>Asegúrate de que las variables no contengan comillas adicionales.</li>
          <li>Verifica que la URL de Supabase sea válida y accesible.</li>
          <li>Comprueba que las claves de API sean correctas.</li>
          <li>Revisa los logs de Vercel para obtener más detalles sobre los errores.</li>
        </ul>
      </div>
    </div>
  )
}
