"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"

// Exportación por defecto (default export)
export default function SessionErrorHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    // Manejar errores específicos de sesión
    if (error === "session_expired" || error === "refresh_token_not_found") {
      const handleSessionExpired = async () => {
        try {
          const supabase = getSupabaseClient()

          // Intentar limpiar la sesión
          await supabase.auth.signOut()

          // Mostrar mensaje al usuario
          console.log("Sesión expirada. Redirigiendo a login...")

          // Redirigir a la página de inicio de sesión sin el parámetro de error
          router.push("/auth/login")
        } catch (e) {
          console.error("Error al manejar sesión expirada:", e)
        }
      }

      handleSessionExpired()
    }
  }, [error, router])

  // Este componente no renderiza nada visible
  return null
}
