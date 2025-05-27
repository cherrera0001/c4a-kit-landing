"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, ShieldCheck, FileText, Settings, LogOut, User, HelpCircle } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"

interface UserSidebarProps {
  className?: string
}

export function UserSidebar({ className }: UserSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Activity,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Diagnósticos",
      icon: ShieldCheck,
      href: "/diagnosticos",
      active: pathname === "/diagnosticos" || pathname.startsWith("/diagnosticos/"),
    },
    {
      label: "Informes",
      icon: FileText,
      href: "/informes",
      active: pathname === "/informes" || pathname.startsWith("/informes/"),
    },
    {
      label: "Perfil",
      icon: User,
      href: "/perfil",
      active: pathname === "/perfil",
    },
    {
      label: "Ayuda",
      icon: HelpCircle,
      href: "/ayuda",
      active: pathname === "/ayuda",
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/configuracion",
      active: pathname === "/configuracion",
    },
  ]

  return (
    <div className={cn("flex h-full flex-col border-r bg-background", className)}>
      <div className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Sistema de Evaluación</h2>
        <p className="text-sm text-muted-foreground">Evaluación de madurez en ciberseguridad</p>
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
