/**
 * Configuración de la API
 */

// Determina si estamos en un entorno de vista previa (desarrollo local)
export function isPreviewEnvironment(): boolean {
  // Verificar si estamos en el cliente
  if (typeof window !== "undefined") {
    // En el cliente, verificamos si estamos en localhost o en un entorno de vista previa
    const hostname = window.location.hostname
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("vercel.app") ||
      process.env.NEXT_PUBLIC_PREVIEW_MODE === "true"
    )
  }

  // En el servidor, verificamos la variable de entorno
  return (
    process.env.PREVIEW_MODE === "true" ||
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview"
  )
}

// Otras configuraciones de la API
export const API_VERSION = "v1"
export const DEFAULT_PAGE_SIZE = 10
