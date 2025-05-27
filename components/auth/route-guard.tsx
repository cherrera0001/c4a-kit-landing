"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useRoleNavigation } from "@/hooks/use-role-navigation"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: string | string[]
  redirectTo?: string
}

export function RouteGuard({ children, requiredRole, redirectTo = "/auth/login" }: RouteGuardProps) {
  const { user, status, isLoading } = useAuth()
  const { userRole, isRoleLoading } = useRoleNavigation()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    // No hacer nada hasta que tengamos la información de autenticación
    if (status === "loading" || isRoleLoading) return

    // Si el usuario no está autenticado, redirigir al login
    if (status === "unauthenticated") {
      const redirectPath = `${redirectTo}?redirect=${encodeURIComponent(pathname || "")}`
      router.push(redirectPath)
      return
    }

    // Si no se requiere un rol específico, el usuario está autorizado
    if (!requiredRole) {
      setIsAuthorized(true)
      setInitialCheckDone(true)
      return
    }

    // Verificar si el usuario tiene el rol requerido
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const hasRequiredRole = requiredRoles.includes(userRole)

    if (!hasRequiredRole) {
      // Redirigir a la página principal según el rol
      router.push(userRole === "admin" ? "/admin/dashboard" : "/dashboard")
      return
    }

    setIsAuthorized(true)
    setInitialCheckDone(true)
  }, [status, userRole, isRoleLoading, requiredRole, router, pathname, redirectTo])

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading || isRoleLoading || !initialCheckDone) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-500">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Renderizar los hijos solo si el usuario está autorizado
  return isAuthorized ? <>{children}</> : null
}
