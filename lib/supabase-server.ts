import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { supabaseServerConfig } from "./supabase-config"

// Cliente para componentes del servidor
export const createSupabaseServerClient = () => {
  try {
    // Verificar que tenemos las credenciales necesarias
    if (!supabaseServerConfig.url || !supabaseServerConfig.anonKey) {
      console.error("Faltan credenciales de Supabase:", {
        url: !!supabaseServerConfig.url,
        anonKey: !!supabaseServerConfig.anonKey,
      })
      throw new Error("Configuración de Supabase incompleta")
    }

    return createServerComponentClient<Database>({
      cookies,
      options: {
        supabaseUrl: supabaseServerConfig.url,
        supabaseKey: supabaseServerConfig.anonKey,
      },
    })
  } catch (error) {
    console.error("Error al crear cliente de servidor de Supabase:", error)

    // En lugar de lanzar un error, devolvemos null para que el código que llama
    // pueda manejar la situación de forma más elegante
    return null
  }
}

// Cliente con clave de servicio (solo para el servidor)
export const createSupabaseAdminClient = () => {
  try {
    // Verificar que tengamos una clave de servicio
    if (!supabaseServerConfig.url || !supabaseServerConfig.serviceRoleKey) {
      console.error("Faltan credenciales de Supabase para admin:", {
        url: !!supabaseServerConfig.url,
        serviceRoleKey: !!supabaseServerConfig.serviceRoleKey,
      })
      throw new Error("Configuración de Supabase Admin incompleta")
    }

    return createClient<Database>(supabaseServerConfig.url, supabaseServerConfig.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Error al crear cliente admin de Supabase:", error)

    // En lugar de lanzar un error, devolvemos null para que el código que llama
    // pueda manejar la situación de forma más elegante
    return null
  }
}

// Función para verificar la conexión a Supabase
export const testSupabaseConnection = async () => {
  try {
    const supabase = createSupabaseServerClient()

    if (!supabase) {
      return {
        success: false,
        error: "No se pudo crear el cliente de Supabase",
      }
    }

    // Intentar una consulta simple
    const { data, error } = await supabase.from("roles").select("id, name").limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error desconocido al probar la conexión",
      details: error,
    }
  }
}
