"use client"

import { useEffect, useState } from "react"
import { clientEnv, isClientPreview } from "@/lib/env"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

export default function EnvDebugger() {
  const [envStatus, setEnvStatus] = useState<{
    isPreview: boolean
    availableVars: string[]
  }>({
    isPreview: true,
    availableVars: [],
  })

  useEffect(() => {
    // Verificar variables de entorno públicas disponibles en el cliente
    const availableVars: string[] = []

    // Verificar qué variables están disponibles en clientEnv
    Object.entries(clientEnv).forEach(([key, value]) => {
      if (value) {
        availableVars.push(key)
      }
    })

    setEnvStatus({
      isPreview: isClientPreview(),
      availableVars,
    })
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-md my-4">
      <h2 className="text-lg font-bold mb-2">Estado de Variables de Entorno (Cliente)</h2>

      {envStatus.isPreview ? (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            Estás en modo de vista previa o desarrollo. Algunas funcionalidades pueden estar simuladas.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">Estás en modo de producción.</AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="font-bold text-green-500">Variables disponibles en el cliente:</h3>
        <ul className="list-disc pl-5">
          {envStatus.availableVars.map((varName) => (
            <li key={varName} className="text-green-500">
              {varName}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Supabase URL: {clientEnv.SUPABASE_URL ? "***" + clientEnv.SUPABASE_URL.slice(-10) : "No disponible"}</p>
        <p>App URL: {clientEnv.APP_URL}</p>
      </div>
    </div>
  )
}
