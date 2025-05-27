"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, Settings, LogOut, Home } from "lucide-react"
import { useRoleNavigation } from "@/hooks/use-role-navigation"
import { useAuth } from "@/hooks/use-auth"
import { LogoutButton } from "@/components/auth/logout-button"

interface UserHeaderProps {
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
}

export function UserHeader({ showMobileMenu, setShowMobileMenu }: UserHeaderProps) {
  const { role, isAdmin } = useRoleNavigation()
  const { user } = useAuth()
  const pathname = usePathname()

  // Determinar el título según la ruta actual
  const getTitle = () => {
    if (pathname.startsWith("/admin")) {
      return "Panel de Administración"
    }

    if (pathname === "/dashboard") return "Dashboard"
    if (pathname.startsWith("/diagnosticos")) return "Diagnósticos"
    if (pathname.startsWith("/informes")) return "Informes"
    if (pathname === "/perfil") return "Perfil"
    if (pathname === "/configuracion") return "Configuración"

    return "Sistema de Evaluación"
  }

  // Obtener las iniciales del usuario para el avatar
  const getUserInitials = () => {
    if (!user) return "U"

    const fullName = user.user_metadata?.full_name || ""
    if (fullName) {
      const names = fullName.split(" ")
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
      }
      return fullName[0].toUpperCase()
    }

    return user.email?.[0].toUpperCase() || "U"
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
            <span className="sr-only">Inicio</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url || "/placeholder.svg"}
                  alt={user?.email || "Usuario"}
                />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={isAdmin ? "/admin/profile" : "/perfil"}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={isAdmin ? "/admin/settings" : "/configuracion"}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton variant="ghost">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </LogoutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
