"use client"

import type React from "react"

import { useState } from "react"
import { RoleBasedNavigation } from "@/components/navigation/role-based-navigation"
import { UserHeader } from "@/components/navigation/user-header"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <UserHeader showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar para escritorio */}
        <RoleBasedNavigation className="hidden md:block w-64" />

        {/* Sidebar móvil */}
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <SheetContent side="left" className="p-0">
            <RoleBasedNavigation />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
