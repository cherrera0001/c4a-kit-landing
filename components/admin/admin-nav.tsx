"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Users, ShieldCheck, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Activity,
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Evaluaciones",
    href: "/admin/evaluations",
    icon: ShieldCheck,
  },
  {
    title: "Informes",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
