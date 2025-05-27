// app/api/auth/login/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { COOKIE_OPTIONS } from "@/lib/constants"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const cookieStore = cookies()

  // Usar opciones mejoradas de cookies
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
    options: {
      cookies: {
        ...COOKIE_OPTIONS,
      },
    },
  })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error de autenticación:", error.message)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`, {
        status: 302,
      })
    }

    // Verificar que la sesión se haya creado correctamente
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      console.error("Error al obtener sesión después de login:", sessionError?.message || "No se creó sesión")
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Error al crear sesión. Inténtalo de nuevo.")}`,
        {
          status: 302,
        },
      )
    }

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`, {
      status: 302,
    })
  } catch (e: any) {
    console.error("Error inesperado en login:", e.message)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Error inesperado. Inténtalo de nuevo.")}`,
      {
        status: 302,
      },
    )
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const provider = requestUrl.searchParams.get("provider")
  const cookieStore = cookies()

  // Usar opciones mejoradas de cookies
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
    options: {
      cookies: {
        ...COOKIE_OPTIONS,
      },
    },
  })

  if (provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${requestUrl.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Error al iniciar OAuth:", error.message)
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`, {
          status: 302,
        })
      }

      return NextResponse.redirect(data.url, {
        status: 302,
      })
    } catch (e: any) {
      console.error("Error inesperado en OAuth:", e.message)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Error inesperado. Inténtalo de nuevo.")}`,
        {
          status: 302,
        },
      )
    }
  }

  // Si no hay proveedor, redirigir a la página de login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`, {
    status: 302,
  })
}
