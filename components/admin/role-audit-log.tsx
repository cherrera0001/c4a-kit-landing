"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

type AuditEvent = {
  id: string
  user_id: string
  action: string
  details: any
  created_at: string
  user_email?: string
}

export function RoleAuditLog() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchAuditLog() {
      try {
        // Aquí asumimos que tienes una tabla de auditoría
        // Si no existe, deberías crearla
        const { data, error } = await supabase
          .from("audit_logs")
          .select(`
            id,
            user_id,
            action,
            details,
            created_at,
            users:user_id (email)
          `)
          .eq("action", "role_change")
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error

        // Formatear los datos
        const formattedEvents = data.map((event) => ({
          id: event.id,
          user_id: event.user_id,
          action: event.action,
          details: event.details,
          created_at: new Date(event.created_at).toLocaleString(),
          user_email: event.users?.email || "Usuario desconocido",
        }))

        setAuditEvents(formattedEvents)
      } catch (err: any) {
        console.error("Error al cargar registro de auditoría:", err)
        setError(err.message || "Error al cargar el registro de auditoría")
      } finally {
        setLoading(false)
      }
    }

    fetchAuditLog()
  }, [supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-amber-500" />
          Registro de Cambios de Roles
        </CardTitle>
        <CardDescription>Monitoreo de asignaciones y cambios de roles de usuario en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : auditEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No se encontraron registros de cambios de roles.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap">{event.created_at}</TableCell>
                    <TableCell>{event.user_email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.action}</Badge>
                    </TableCell>
                    <TableCell>
                      {event.details.old_role && event.details.new_role ? (
                        <span>
                          Cambio de rol:{" "}
                          <Badge variant="outline" className="mr-1">
                            {event.details.old_role}
                          </Badge>
                          →
                          <Badge variant={event.details.new_role === "admin" ? "default" : "outline"} className="ml-1">
                            {event.details.new_role}
                          </Badge>
                        </span>
                      ) : (
                        <span>
                          Rol asignado:{" "}
                          <Badge variant={event.details.role === "admin" ? "default" : "outline"}>
                            {event.details.role}
                          </Badge>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
