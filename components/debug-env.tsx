"use client"

import { useEffect, useState } from "react"
import { clientEnv, isClientPreview } from "@/lib/env"

export default function DebugEnv() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Solo podemos acceder a variables públicas en el cliente
    const publicEnvVars: Record<string, string> = {
      SUPABASE_URL: clientEnv.SUPABASE_URL || "no disponible",
      SUPABASE_ANON_KEY: clientEnv.SUPABASE_ANON_KEY ? "***" : "no disponible",
      APP_URL: clientEnv.APP_URL || "no disponible",
      IS_PREVIEW: isClientPreview() ? "true" : "false",
    }

    setEnvVars(publicEnvVars)
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-md my-4">
      <h2 className="text-lg font-bold mb-2">Variables de entorno públicas (cliente):</h2>
      {Object.keys(envVars).length === 0 ? (
        <p className="text-red-500">No se encontraron variables de entorno públicas</p>
      ) : (
        <pre className="bg-gray-800 text-white p-4 rounded overflow-auto">{JSON.stringify(envVars, null, 2)}</pre>
      )}

      <div className="mt-4">
        <h3 className="font-bold">Valores directos:</h3>
        <p>SUPABASE_URL: {clientEnv.SUPABASE_URL || "no disponible"}</p>
        <p>SUPABASE_ANON_KEY: {clientEnv.SUPABASE_ANON_KEY ? "***" : "no disponible"}</p>
      </div>
    </div>
  )
}
