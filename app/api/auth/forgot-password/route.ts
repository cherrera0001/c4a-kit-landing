import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    // Intentar analizar el cuerpo de la solicitud
    let email
    try {
      const body = await request.json()
      email = body.email
    } catch (error) {
      return NextResponse.json({ error: "Formato de solicitud inválido" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "El correo electrónico es requerido" }, { status: 400 })
    }

    // En el entorno de vista previa, simulamos una respuesta exitosa
    if (process.env.NODE_ENV === "development" || request.headers.get("host")?.includes("vercel.app")) {
      return NextResponse.json({ success: true, preview: true })
    }

    try {
      const supabase = getSupabaseClient()

      // Obtener la URL base para el restablecimiento
      const origin = request.headers.get("origin") || "http://localhost:3000"
      const redirectTo = `${origin}/auth/reset-password`

      // Enviar correo de restablecimiento
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) {
        console.error("Error de Supabase:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } catch (error: any) {
      console.error("Error al procesar la solicitud:", error)
      return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error general:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
