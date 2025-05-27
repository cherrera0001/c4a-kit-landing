"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function TestSupabase() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const supabase = createClientComponentClient()

      // Prueba simple: obtener la versión de Supabase
      const { data, error } = await supabase.from("_test_connection").select("*").limit(1)

      if (error) throw error

      setResult(JSON.stringify(data || { message: "Conexión exitosa pero sin datos" }, null, 2))
    } catch (err: any) {
      console.error("Error de conexión:", err)
      setError(err.message || "Error desconocido al conectar con Supabase")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Prueba de Conexión</CardTitle>
        <CardDescription>Verifica la conexión con Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700">
            Este componente es solo para desarrollo y pruebas.
          </AlertDescription>
        </Alert>

        <Button onClick={testConnection} disabled={loading} className="mb-4">
          {loading ? "Probando..." : "Probar Conexión"}
        </Button>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">Error:</p>
              <p className="whitespace-pre-wrap">{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Resultado:</p>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
