"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Users, ShieldCheck, FileText, Settings, LogOut, BarChart3, Building } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Activity,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      label: "Usuarios",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users" || pathname.startsWith("/admin/users/"),
    },
    {
      label: "Empresas",
      icon: Building,
      href: "/admin/companies",
      active: pathname === "/admin/companies" || pathname.startsWith("/admin/companies/"),
    },
    {
      label: "Evaluaciones",
      icon: ShieldCheck,
      href: "/admin/evaluations",
      active: pathname === "/admin/evaluations" || pathname.startsWith("/admin/evaluations/"),
    },
    {
      label: "Informes",
      icon: FileText,
      href: "/admin/reports",
      active: pathname === "/admin/reports" || pathname.startsWith("/admin/reports/"),
    },
    {
      label: "Estadísticas",
      icon: BarChart3,
      href: "/admin/statistics",
      active: pathname === "/admin/statistics",
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className={cn("flex h-full flex-col border-r bg-background", className)}>
      <div className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Panel de Administración</h2>
        <p className="text-sm text-muted-foreground">Gestión del sistema de evaluación</p>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={cn("w-full justify-start", route.active ? "bg-secondary" : "")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <LogoutButton className="w-full justify-start" variant="ghost">
          <LogOut className="mr-2 h-5 w-5" />
          Cerrar Sesión
        </LogoutButton>
      </div>
    </div>
  )
}
