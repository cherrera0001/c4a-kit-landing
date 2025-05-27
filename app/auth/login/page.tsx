// app/auth/login/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import SessionErrorHandler from "@/components/auth/session-error-handler"
import LoginForm from "@/components/auth/login-form"

// Importar constantes para cookies mejoradas
import { COOKIE_OPTIONS } from "@/lib/constants"

export const dynamic = "force-dynamic" // Para asegurar que se trate como dinámica

export const metadata = {
  title: "Iniciar Sesión | C4A",
  description: "Inicia sesión en tu cuenta de C4A.",
}

interface LoginPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Configuración mejorada de cookies para resolver problemas de token
  const cookieStore = cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
    options: {
      cookies: {
        ...COOKIE_OPTIONS,
      },
    },
  })

  // --- Manejar la verificación de sesión y redirección FUERA del try/catch ---
  let session = null;
  let sessionError = null;

  try {
    const sessionResponse = await supabase.auth.getSession();
    session = sessionResponse.data.session;
    sessionError = sessionResponse.error;
  } catch (e) {
    // Catch potential errors during session fetching itself, but not the redirect exception
    console.error("Error al obtener sesión:", e);
    // You might want to set a specific error state here if fetching the session fails critically
    // For now, we'll let the rest of the page render and potentially show a login form
  }

  // If session exists and there was no error fetching it, redirect
  if (session && !sessionError) {
    console.log("Sesión activa encontrada, redirigiendo a dashboard.");
    redirect("/dashboard"); // This will throw the special exception handled by Next.js
  }
  // --- Fin del manejo de verificación de sesión y redirección ---


  // Procesar parámetros de búsqueda para mensajes y errores
  const error = searchParams?.error ? String(searchParams.error) : null
  const message = searchParams?.message ? String(searchParams.message) : null

  // Añadir manejo para errores específicos de token (si aún son relevantes)
  const refreshTokenError = searchParams?.refresh_token_error ? true : false
  const sessionExpired = searchParams?.session_expired ? true : false

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">C4A</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bienvenido de Nuevo</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Inicia sesión para acceder a tu panel.</p>
        </div>

        {/* Componente de manejo de errores de sesión */}
        {/* This component might also trigger redirects, ensure its logic is sound */}
        <SessionErrorHandler />

        {/* Mostrar alerta para errores de token de actualización */}
        {refreshTokenError && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Sesión Inválida</AlertTitle>
            <AlertDescription>
              Tu sesión ha expirado o es inválida. Por favor, inicia sesión nuevamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Mostrar alerta para sesión expirada */}
        {sessionExpired && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Sesión Expirada</AlertTitle>
            <AlertDescription>
              Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Mantener alertas existentes */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error de Autenticación</AlertTitle>
            {/* Replace underscores for readability */}
            <AlertDescription>{error.replace(/_/g, " ")}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="mb-4"> {/* Consider a different variant like 'success' or 'default' for messages */}
            <AlertTitle>Información</AlertTitle>
             {/* Replace underscores for readability */}
            <AlertDescription>{message.replace(/_/g, " ")}</AlertDescription>
          </Alert>
        )}

        {/* Usar el componente de formulario mejorado */}
        <LoginForm />
      </div>
    </div>
  )
}
