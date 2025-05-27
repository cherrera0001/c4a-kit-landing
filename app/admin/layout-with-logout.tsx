import type React from "react"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/auth/logout-button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Panel de Administración</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">admin@example.com</span>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            A
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r p-4 pt-8">
          <AdminNav />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
