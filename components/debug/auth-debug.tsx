"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthDebug() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const checkSession = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 Verificando sesión actual")
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("❌ Error al obtener sesión:", error)
        setError(error.message)
        return
      }

      console.log("📊 Datos de sesión:", data)
      setSessionData(data)

      if (data.session) {
        console.log("👤 Usuario autenticado:", data.session.user.email)
      } else {
        console.log("⚠️ No hay sesión activa")
      }
    } catch (err: any) {
      console.error("❌ Error inesperado:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Depuración de Autenticación</CardTitle>
        <CardDescription>Información detallada sobre el estado de autenticación actual</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Cargando información de sesión...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            <p className="font-semibold">Error al obtener información de sesión:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Estado de Sesión:</h3>
              <p>{sessionData?.session ? "✅ Autenticado" : "❌ No autenticado"}</p>
            </div>

            {sessionData?.session && (
              <>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Información de Usuario:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <span className="font-medium">ID:</span> {sessionData.session.user.id}
                    </li>
                    <li>
                      <span className="font-medium">Email:</span> {sessionData.session.user.email}
                    </li>
                    <li>
                      <span className="font-medium">Proveedor:</span>{" "}
                      {sessionData.session.user.app_metadata.provider || "email"}
                    </li>
                    <li>
                      <span className="font-medium">Creado:</span>{" "}
                      {new Date(sessionData.session.user.created_at).toLocaleString()}
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Metadatos de Usuario:</h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(sessionData.session.user.user_metadata, null, 2)}
                  </pre>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Información de Sesión:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <span className="font-medium">Expira:</span>{" "}
                      {new Date(sessionData.session.expires_at * 1000).toLocaleString()}
                    </li>
                    <li>
                      <span className="font-medium">Estado:</span>
                      {new Date(sessionData.session.expires_at * 1000) > new Date() ? " ✅ Válida" : " ❌ Expirada"}
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <Button onClick={checkSession} variant="outline">
                Actualizar
              </Button>
              {sessionData?.session && (
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    checkSession()
                  }}
                >
                  Cerrar Sesión
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
