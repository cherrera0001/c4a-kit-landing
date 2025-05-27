"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 Procesando callback de autenticación")
        const supabase = getSupabaseClient()

        // Procesar la URL para extraer el token de autenticación
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("❌ Error de autenticación:", error.message)
          router.push("/auth/login?error=auth_callback_error")
          return
        }

        if (!data.session) {
          console.error("❌ No se encontró sesión en el callback")
          router.push("/auth/login?error=no_session")
          return
        }

        console.log("✅ Autenticación exitosa, redirigiendo al dashboard")

        // Verificar si hay un error en los parámetros de búsqueda
        const errorCode = searchParams.get("error_code")
        if (errorCode) {
          console.error("❌ Error en callback:", errorCode)
          router.push(`/auth/login?error=${errorCode}`)
          return
        }

        // Redirigir al dashboard después de una autenticación exitosa
        router.push("/dashboard")
      } catch (err) {
        console.error("❌ Error inesperado en callback:", err)
        router.push("/auth/login?error=unexpected_error")
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Procesando autenticación...</h2>
        <p className="text-gray-500">Por favor espere mientras completamos el proceso.</p>
      </div>
    </div>
  )
}
