import type { Database } from "@/types/database"
import { clientEnv, serverEnv } from "./env"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Para uso en componentes del cliente
export const getSupabaseClient = () => {
  try {
    // Usar createClientComponentClient que es seguro para el cliente
    return createClientComponentClient<Database>({
      supabaseUrl: clientEnv.SUPABASE_URL,
      supabaseKey: clientEnv.SUPABASE_ANON_KEY,
    })
  } catch (error) {
    console.error("Error al crear cliente de Supabase:", error)
    // En caso de error, devolver un cliente con valores vacíos
    return createClientComponentClient<Database>()
  }
}

// Para uso en componentes del servidor o API routes
export const getSupabaseServerClient = async () => {
  const { createServerComponentClient } = await import("@supabase/auth-helpers-nextjs")
  const { cookies } = await import("next/headers")

  try {
    return createServerComponentClient<Database>({
      cookies,
    })
  } catch (error) {
    console.error("Error al crear cliente de Supabase en el servidor:", error)
    throw error
  }
}

// Para uso directo con el rol de servicio (solo en el servidor)
export const getSupabaseAdmin = async () => {
  if (typeof window !== "undefined") {
    console.error("getSupabaseAdmin solo debe usarse en el servidor")
    return null
  }

  try {
    // Importar dinámicamente para evitar errores en el cliente
    const { createClient } = await import("@supabase/supabase-js")

    return createClient<Database>(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY)
  } catch (error) {
    console.error("Error al crear cliente admin de Supabase:", error)
    return null
  }
}
