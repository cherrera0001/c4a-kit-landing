"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

// Definir los tipos de roles disponibles
export type UserRole = "admin" | "user" | "guest"

// Definir la estructura de los elementos de navegación
export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  roles: UserRole[] // Roles que pueden ver este elemento
  children?: NavItem[]
}

export function useRoleNavigation() {
  const [role, setRole] = useState<UserRole>("guest")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getSupabaseClient()

  // Cargar el rol del usuario al montar el componente
  useEffect(() => {
    async function loadUserRole() {
      try {
        setIsLoading(true)

        // Obtener la sesión actual
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setRole("guest")
          return
        }

        // Obtener el perfil del usuario con su rol
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*, roles(name)")
          .eq("id", session.user.id)
          .single()

        if (profile?.roles?.name === "admin") {
          setRole("admin")
        } else {
          setRole("user")
        }
      } catch (error) {
        console.error("Error al cargar el rol del usuario:", error)
        setRole("guest")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserRole()
  }, [supabase])

  // Función para filtrar elementos de navegación según el rol
  const filterNavItems = (items: NavItem[]): NavItem[] => {
    return items
      .filter((item) => item.roles.includes(role))
      .map((item) => ({
        ...item,
        children: item.children ? filterNavItems(item.children) : undefined,
      }))
  }

  // Función para verificar si el usuario tiene acceso a una ruta
  const hasAccessToRoute = (route: string): boolean => {
    // Rutas públicas accesibles para todos
    const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/forgot-password"]
    if (publicRoutes.includes(route)) return true

    // Rutas de administrador
    if (route.startsWith("/admin") && role !== "admin") return false

    // Rutas de usuario autenticado
    if (
      (route.startsWith("/dashboard") || route.startsWith("/diagnosticos") || route.startsWith("/informes")) &&
      role === "guest"
    )
      return false

    return true
  }

  // Función para redirigir si no tiene acceso
  const redirectIfNoAccess = (route: string) => {
    if (!hasAccessToRoute(route)) {
      if (role === "guest") {
        router.push("/auth/login")
      } else {
        router.push("/dashboard")
      }
      return false
    }
    return true
  }

  return {
    role,
    isLoading,
    filterNavItems,
    hasAccessToRoute,
    redirectIfNoAccess,
    isAdmin: role === "admin",
    isUser: role === "user",
    isGuest: role === "guest",
    isAuthenticated: role !== "guest",
  }
}
