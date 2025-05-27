import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import UserDashboard from "@/components/dashboard/user-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"
import WelcomeBanner from "@/components/dashboard/welcome-banner"
// Removed import for createUserProfile from services/profile-service
import { ROLE_IDS } from "@/lib/constants"

export const metadata = {
  title: "Dashboard | Sistema de Evaluación de Madurez",
  description: "Panel de control personalizado según tu rol en el sistema.",
}

// Definir el tipo para searchParams
interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
    options: {
      cookieOptions: {
        name: "sb-session",
        lifetime: 60 * 60 * 24 * 7, // 7 días
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
        path: "/",
        sameSite: "lax",
      },
    },
  })

  try {
    // 1. Obtener la sesión del usuario
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Error al obtener sesión:", sessionError.message)
      redirect("/auth/login?error=session_error")
    }

    if (!session) {
      console.log("No hay sesión activa, redirigiendo a login.")
      redirect("/auth/login")
    }

    // 2. Obtener el usuario autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Error al obtener usuario:", authError.message)
      redirect("/auth/login?error=auth_error")
    }

    if (!user) {
      console.log("Usuario no autenticado, redirigiendo a login.")
      redirect("/auth/login")
    }

    // Extraer messages from search params
    const welcomeMessage =
      searchParams.welcome === "true" ? "¡Bienvenido! Tu cuenta y perfil han sido configurados." : null
    // Keep profile creation error message if it came from the callback
    const profileCreationError = searchParams.error_profile
      ? decodeURIComponent(String(searchParams.error_profile))
      : null
    const profileUnexpectedError = searchParams.error_profile_unexpected
      ? decodeURIComponent(String(searchParams.error_profile_unexpected))
      : null

    let userProfile = null
    let profileFetchErrorMessage = null
    let isAdmin = false

    // 3. Obtener el perfil del usuario
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is "No rows found", which is expected if the profile doesn't exist yet
      console.error("Error al obtener perfil en dashboard:", profileError.message)
      profileFetchErrorMessage = `Error al cargar tu perfil: ${profileError.message}`
    }

    // If no profile is found AND there wasn't a fetch error other than "No rows found"
    // This indicates the database trigger might not have run or completed yet.
    // We log a warning and show a message to the user, but DO NOT attempt to create the profile here.
    if (!profileData && !profileFetchErrorMessage) {
        console.warn(`Perfil no encontrado para el usuario: ${user.id} en el dashboard. La base de datos debe crear uno automáticamente.`)
        profileFetchErrorMessage = "Tu perfil de usuario no se encontró inmediatamente. Esto puede tardar unos segundos. Si el problema persiste, contacta a soporte."
    } else {
      userProfile = profileData
    }


    // Determine if the user is an admin by comparing with the admin role UUID
    // Ensure userProfile is not null before accessing role_id
    isAdmin = userProfile?.role_id === ROLE_IDS.ADMIN

    // Prepare user data to pass to components
    const userData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Usuario",
      avatar: user.user_metadata?.avatar_url,
    }

    return (
      <div className="flex flex-col space-y-4 p-4 md:p-8 min-h-screen bg-background text-foreground">
        {welcomeMessage && <WelcomeBanner userName={userProfile?.full_name || userData.name} />}

        {/* Display profile creation error from callback */}
        {profileCreationError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error al Configurar Perfil</p>
            <p>{profileCreationError}</p>
          </div>
        )}

        {profileUnexpectedError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error Inesperado en Callback</p>
            <p>{profileUnexpectedError}</p>
          </div>
        )}

        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Display message if profile fetch had issues or profile was not found */}
        {profileFetchErrorMessage && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">Información del Perfil</p>
            <p>{profileFetchErrorMessage}</p>
          </div>
        )}

        {/* Render the appropriate dashboard */}
        {/* Pass the fetched userProfile data if available */}
        {isAdmin ? <AdminDashboard profile={userProfile || userData} /> : <UserDashboard profile={userProfile || userData} />}
      </div>
    )
  } catch (error) {
    console.error("Error inesperado en dashboard:", error)
    // Redirect to login with a generic error if a critical error occurs
    redirect("/auth/login?error=unexpected_error")
  }
}
