"use client"

import { useRoleNavigation } from "@/hooks/use-role-navigation"
import { AdminSidebar } from "@/components/navigation/admin-sidebar"
import { UserSidebar } from "@/components/navigation/user-sidebar"
import { Skeleton } from "@/components/ui/skeleton"

interface RoleBasedNavigationProps {
  className?: string
}

export function RoleBasedNavigation({ className }: RoleBasedNavigationProps) {
  const { role, isLoading } = useRoleNavigation()

  if (isLoading) {
    return <NavigationSkeleton className={className} />
  }

  if (role === "admin") {
    return <AdminSidebar className={className} />
  }

  if (role === "user") {
    return <UserSidebar className={className} />
  }

  return null
}

function NavigationSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex h-full w-64 flex-col border-r bg-background p-6 ${className}`}>
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-8" />

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
