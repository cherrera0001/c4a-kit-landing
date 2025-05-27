"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import type { Session, User, AuthError } from "@supabase/supabase-js"
import { useRouter, usePathname } from "next/navigation"
import { isClientPreview } from "@/lib/env"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  status: AuthStatus
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  error: AuthError | Error | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  status: "loading",
  signOut: async () => {},
  refreshSession: async () => {},
  error: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [error, setError] = useState<AuthError | Error | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Obtener el cliente de Supabase (seguro para el cliente)
  // Usamos una referencia constante al cliente para evitar múltiples instancias
  const supabase = getSupabaseClient()

  // Función para refrescar la sesión manualmente
  const refreshSession = useCallback(async () => {
    setIsLoading(true)
    try {
      if (!supabase) {
        console.warn("Supabase client is null. Refresh session cannot proceed.")
        setStatus("unauthenticated")
        setIsLoading(false)
        return
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      if (session) {
        setSession(session)
        setUser(session.user)
        setStatus("authenticated")
      } else {
        setSession(null)
        setUser(null)
        setStatus("unauthenticated")
      }
    } catch (err) {
      console.error("Error al refrescar la sesión:", err)
      setError(err as AuthError)
      setStatus("unauthenticated")
    } finally {
      setIsLoading(false)
    }
  }, [supabase?.auth])

  // Cargar la sesión inicial
  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)
      try {
        // Modo de vista previa
        if (isClientPreview()) {
          const storedUser = localStorage.getItem("preview_auth_user")
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            setUser(userData.user)
            setSession({ user: userData.user } as Session)
            setStatus("authenticated")
          } else {
            setStatus("unauthenticated")
          }
          setIsLoading(false)
          return
        }

        // Modo producción con Supabase
        if (!supabase) {
          console.warn("Supabase client is null. Initial session load cannot proceed.")
          setStatus("unauthenticated")
          setIsLoading(false)
          return
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (session) {
          setSession(session)
          setUser(session.user)
          setStatus("authenticated")
        } else {
          setStatus("unauthenticated")
        }
      } catch (err) {
        console.error("Error al cargar la sesión:", err)
        setError(err as AuthError)
        setStatus("unauthenticated")
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Configurar el listener para cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setStatus(session ? "authenticated" : "unauthenticated")
      setIsLoading(false)

      // Redirigir según el estado de autenticación y la ruta actual
      if (
        session &&
        pathname?.startsWith("/auth") &&
        pathname !== "/auth/logout" &&
        pathname !== "/auth/reset-password" &&
        !pathname.startsWith("/auth/forgot-password")
      ) {
        router.push("/dashboard")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router, supabase?.auth])

  const signOut = async () => {
    setIsLoading(true)
    try {
      if (isClientPreview()) {
        localStorage.removeItem("preview_auth_user")
        setUser(null)
        setSession(null)
        setStatus("unauthenticated")
        router.push("/auth/login")
        return
      }

      if (!supabase) {
        console.warn("Supabase client is null. Sign out cannot proceed.")
        setIsLoading(false)
        return
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // La sesión se actualizará automáticamente a través del listener onAuthStateChange
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
      setError(err as AuthError)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    status,
    signOut,
    refreshSession,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
