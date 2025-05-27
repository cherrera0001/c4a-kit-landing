"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export default function GoogleAuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const checkConfiguration = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClientComponentClient()

      // Obtener información de la sesión actual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      // Obtener información del usuario actual
      const { data: userData, error: userError } = await supabase.auth.getUser()

      // Recopilar información de depuración
      const info = {
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hostname: typeof window !== "undefined" ? window.location.hostname : "unknown",
          protocol: typeof window !== "undefined" ? window.location.protocol : "unknown",
          userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
          href: typeof window !== "undefined" ? window.location.href : "unknown",
          origin: typeof window !== "undefined" ? window.location.origin : "unknown",
        },
        auth: {
          session: sessionData,
          sessionError: sessionError
            ? {
                message: sessionError.message,
                status: sessionError.status,
              }
            : null,
          user: userData,
          userError: userError
            ? {
                message: userError.message,
                status: userError.status,
              }
            : null,
        },
        csp: {
          frameAncestors: document.defaultView?.frameElement ? "Dentro de un iframe" : "No dentro de un iframe",
        },
        supabaseConfig: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKeyAvailable: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      }

      setDebugInfo(info)
    } catch (err: any) {
      console.error("Error al verificar configuración:", err)
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const testGoogleAuth = async () => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const supabase = createClientComponentClient()

      // Obtener la URL base para redirecciones
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const callbackUrl = `${origin}/auth/callback`

      console.log("🔧 Iniciando prueba de autenticación con Google:", {
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        console.error("❌ Error de autenticación con Google:", error)
        setAuthError(error.message)
      } else {
        console.log("✅ Redirección a Google iniciada correctamente", data)
        // La redirección ocurrirá automáticamente
      }
    } catch (err: any) {
      console.error("❌ Error inesperado al autenticar con Google:", err)
      setAuthError(err.message || "Error al autenticar con Google")
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Depuración de Autenticación con Google</CardTitle>
        <CardDescription>
          Verifica la configuración de autenticación con Google y muestra información de depuración
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={checkConfiguration} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
                </>
              ) : (
                "Verificar Configuración"
              )}
            </Button>

            <Button onClick={testGoogleAuth} disabled={authLoading} variant="outline" className="w-full">
              {authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando...
                </>
              ) : (
                "Probar Autenticación con Google"
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-semibold">Error al verificar configuración:</p>
              <p>{error}</p>
            </div>
          )}

          {authError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-semibold">Error al probar autenticación:</p>
              <p>{authError}</p>
            </div>
          )}

          {debugInfo && (
            <div className="mt-4 border rounded-md p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Información de Depuración</h3>

              <div className="mb-4">
                <h4 className="font-medium">Entorno</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.environment, null, 2)}
                </pre>
              </div>

              <div className="mb-4">
                <h4 className="font-medium">Autenticación</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.auth, null, 2)}
                </pre>
              </div>

              <div className="mb-4">
                <h4 className="font-medium">CSP</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.csp, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="font-medium">Configuración de Supabase</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.supabaseConfig, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
