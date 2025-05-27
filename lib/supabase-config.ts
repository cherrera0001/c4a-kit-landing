// Configuración centralizada para Supabase
// Este archivo se encarga de sanitizar y validar todas las URLs y claves

// Función mejorada para limpiar cualquier valor de variable de entorno
const cleanEnvValue = (value: string | undefined): string => {
  if (!value) return ""

  // Eliminar espacios al inicio y final
  let cleaned = value.trim()

  // Eliminar comillas dobles al inicio y final
  cleaned = cleaned.replace(/^"(.*)"$/, "$1")

  // Eliminar comillas simples al inicio y final
  cleaned = cleaned.replace(/^'(.*)'$/, "$1")

  // Eliminar todas las comillas dobles restantes
  cleaned = cleaned.replace(/"/g, "")

  // Eliminar todas las comillas simples restantes
  cleaned = cleaned.replace(/'/g, "")

  // Eliminar cualquier /auth/v1 que pueda estar al final (causa común de error)
  cleaned = cleaned.replace(/\/auth\/v1$/, "")

  // Eliminar barra final si existe
  cleaned = cleaned.replace(/\/$/, "")

  return cleaned
}

// Función para validar una URL
const isValidUrl = (url: string): boolean => {
  try {
    // Verificar que la URL tenga el formato correcto
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      console.error("URL inválida: debe comenzar con http:// o https://")
      return false
    }

    // Intentar crear un objeto URL para validar
    new URL(url)
    return true
  } catch (e) {
    console.error(`Error al validar URL: ${url}`, e)
    return false
  }
}

// URL de Supabase hardcodeada como último recurso
const FALLBACK_URL = "https://iaropbslnjhkvwmivuth.supabase.co"

// Configuración de Supabase para el cliente
export const supabaseClientConfig = {
  // URL de Supabase limpia y validada
  url: (() => {
    try {
      // Obtener la URL de las variables de entorno
      const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""

      // Limpiar la URL
      const cleanedUrl = cleanEnvValue(rawUrl)

      // Si la URL está vacía después de limpiarla, usar el fallback
      if (!cleanedUrl) {
        console.warn("URL de Supabase vacía, usando fallback:", FALLBACK_URL)
        return FALLBACK_URL
      }

      // Validar la URL
      if (isValidUrl(cleanedUrl)) {
        return cleanedUrl
      } else {
        console.warn("URL de Supabase inválida, usando fallback:", FALLBACK_URL)
        return FALLBACK_URL
      }
    } catch (e) {
      console.error("Error al procesar URL de Supabase:", e)
      return FALLBACK_URL
    }
  })(),

  // Clave anónima limpia
  anonKey: (() => {
    try {
      const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      const cleanedKey = cleanEnvValue(rawKey)

      if (!cleanedKey) {
        console.warn("Clave anónima de Supabase vacía")
      }

      return cleanedKey
    } catch (e) {
      console.error("Error al procesar clave anónima de Supabase:", e)
      return ""
    }
  })(),

  // Opciones adicionales
  options: {
    global: {
      headers: {
        "X-Client-Info": "c4a-app",
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
}

// Configuración de Supabase para el servidor
export const supabaseServerConfig = {
  // URL de Supabase para el servidor
  url: (() => {
    try {
      // Intentar primero con SUPABASE_URL, luego con NEXT_PUBLIC_SUPABASE_URL
      const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""

      // Limpiar la URL
      const cleanedUrl = cleanEnvValue(rawUrl)

      // Si la URL está vacía después de limpiarla, usar el fallback
      if (!cleanedUrl) {
        console.warn("URL de Supabase para servidor vacía, usando fallback:", FALLBACK_URL)
        return FALLBACK_URL
      }

      // Validar la URL
      if (isValidUrl(cleanedUrl)) {
        return cleanedUrl
      } else {
        console.warn("URL de Supabase para servidor inválida, usando fallback:", FALLBACK_URL)
        return FALLBACK_URL
      }
    } catch (e) {
      console.error("Error al procesar URL de Supabase para servidor:", e)
      return FALLBACK_URL
    }
  })(),

  // Clave de servicio limpia
  serviceRoleKey: (() => {
    try {
      const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      return cleanEnvValue(rawKey)
    } catch (e) {
      console.error("Error al procesar clave de servicio de Supabase:", e)
      return ""
    }
  })(),

  // Clave anónima limpia (fallback a la del cliente)
  anonKey: (() => {
    try {
      const rawKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      return cleanEnvValue(rawKey)
    } catch (e) {
      console.error("Error al procesar clave anónima de Supabase para servidor:", e)
      return ""
    }
  })(),
}

// Función para verificar si la configuración es válida
export const isSupabaseConfigValid = (): boolean => {
  try {
    // Verificar URL del cliente
    if (!supabaseClientConfig.url || !isValidUrl(supabaseClientConfig.url)) {
      console.error("URL de Supabase para cliente inválida:", supabaseClientConfig.url)
      return false
    }

    // Verificar que la clave anónima exista
    if (!supabaseClientConfig.anonKey) {
      console.error("Clave anónima de Supabase no configurada")
      return false
    }

    // Verificar URL del servidor
    if (!supabaseServerConfig.url || !isValidUrl(supabaseServerConfig.url)) {
      console.error("URL de Supabase para servidor inválida:", supabaseServerConfig.url)
      return false
    }

    return true
  } catch (e) {
    console.error("Error al verificar configuración de Supabase:", e)
    return false
  }
}

// Función para obtener información de diagnóstico
export const getSupabaseConfigDiagnostics = () => {
  return {
    clientUrl: supabaseClientConfig.url,
    clientUrlValid: isValidUrl(supabaseClientConfig.url),
    clientKeyPresent: !!supabaseClientConfig.anonKey,
    serverUrl: supabaseServerConfig.url,
    serverUrlValid: isValidUrl(supabaseServerConfig.url),
    serverKeyPresent: !!supabaseServerConfig.anonKey,
    serviceRoleKeyPresent: !!supabaseServerConfig.serviceRoleKey,
    usingFallback: supabaseClientConfig.url === FALLBACK_URL || supabaseServerConfig.url === FALLBACK_URL,
  }
}
