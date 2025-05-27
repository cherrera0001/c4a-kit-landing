"use client"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import UserDashboard from "@/components/dashboard/user-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"
import WelcomeBanner from "@/components/dashboard/welcome-banner"
import { createUserProfile } from "@/services/profile-service"
import { useEffect, useState } from "react"

export default function DashboardClientPage({ searchParams }) {
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<JSX.Element | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      // Usar cookies() sin await por ahora
      const cookieStore = cookies()
      const supabase = createServerComponentClient({ cookies: () => cookieStore })

      // Verificar si el usuario está autenticado
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        redirect("/auth/login")
      }

      try {
        // Obtener el perfil del usuario
        let profiles = null
        const { data: fetchedProfiles, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)

        if (profileError) {
          console.error("Error al obtener perfil:", profileError.message)
        }

        // Si no hay perfil o hay un error, intentar crear uno básico
        if (!fetchedProfiles || fetchedProfiles.length === 0) {
          console.log(
            `Perfil no encontrado para el usuario: ${session.user.id} en el dashboard. Intentando crear uno básico...`,
          )

          try {
            // Usar el servicio mejorado para crear el perfil
            const result = await createUserProfile(session.user.id, 2)

            if (!result.success) {
              console.error(`Error al crear perfil en dashboard: ${result.error}`)
              setContent(
                <div className="p-8">
                  <h1 className="text-2xl font-bold mb-4">Error al configurar tu cuenta</h1>
                  <p>No se pudo crear tu perfil de usuario. Por favor, contacta a soporte.</p>
                  <p className="text-sm text-gray-500 mt-2">Error: {result.error}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => window.location.reload()}
                  >
                    Intentar nuevamente
                  </button>
                </div>,
              )
              return
            }

            // Obtener el perfil recién creado
            const { data: newProfile } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", session.user.id)
              .maybeSingle()

            if (newProfile) {
              console.log(`Perfil creado exitosamente en dashboard para: ${session.user.id}`)
              profiles = [newProfile]
            }
          } catch (createError) {
            console.error("Error al crear perfil en dashboard:", createError)
            setContent(
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Error al configurar tu cuenta</h1>
                <p>Ocurrió un error inesperado al crear tu perfil. Por favor, contacta a soporte.</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => window.location.reload()}
                >
                  Intentar nuevamente
                </button>
              </div>,
            )
            return
          }
        } else {
          profiles = fetchedProfiles
        }

        // Obtener el perfil actualizado o usar el que ya teníamos
        const profile = profiles && profiles.length > 0 ? profiles[0] : null

        if (!profile) {
          console.error(`No se pudo obtener o crear el perfil para el usuario: ${session.user.id}`)
          setContent(
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-4">Error de perfil</h1>
              <p>No se pudo cargar o crear tu perfil de usuario. Por favor, contacta a soporte.</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Intentar nuevamente
              </button>
            </div>,
          )
          return
        }

        // Determinar si mostrar el banner de bienvenida
        const showWelcome = searchParams?.welcome === "true"

        // Determinar si es administrador
        const isAdmin = profile?.role_id === 1

        // Datos del usuario para pasar a los componentes
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || profile.full_name || session.user.email?.split("@")[0],
          avatar: session.user.user_metadata?.avatar_url || profile.avatar_url,
        }

        setContent(
          <div className="min-h-screen bg-background">
            {showWelcome && <WelcomeBanner userName={userData.name} />}
            {isAdmin ? <AdminDashboard profile={userData} /> : <UserDashboard profile={userData} />}
          </div>,
        )
      } catch (error) {
        console.error("Error en dashboard:", error)
        setContent(
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Error inesperado</h1>
            <p>Ocurrió un error al cargar tu dashboard. Por favor, intenta nuevamente.</p>
            <p className="text-sm text-gray-500 mt-2">{error.message}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Intentar nuevamente
            </button>
          </div>,
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return content
}
