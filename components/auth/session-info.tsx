"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRoleNavigation } from "@/hooks/use-role-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, RefreshCw } from "lucide-react"
import { useState } from "react"

export function SessionInfo() {
  const { user, session, status, signOut, refreshSession, isLoading } = useAuth()
  const { userRole, isRoleLoading } = useRoleNavigation()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshSession()
    setIsRefreshing(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Estado de Sesión
          <Badge variant={status === "authenticated" ? "success" : "destructive"}>
            {status === "authenticated" ? "Activa" : "Inactiva"}
          </Badge>
        </CardTitle>
        <CardDescription>Información sobre tu sesión actual</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || isRoleLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : status === "authenticated" && user ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">Usuario:</p>
              <p className="text-sm">{user.email}</p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">Rol:</p>
              <p className="text-sm">{userRole || "Cargando..."}</p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">ID de Usuario:</p>
              <p className="text-sm truncate">{user.id}</p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">Último inicio de sesión:</p>
              <p className="text-sm">{new Date(user.last_sign_in_at || Date.now()).toLocaleString()}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Actualizar
              </Button>

              <Button variant="destructive" className="flex-1" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p>No hay sesión activa</p>
            <Button variant="default" className="mt-4" onClick={() => (window.location.href = "/auth/login")}>
              Iniciar Sesión
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
