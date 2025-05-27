"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase" // Gets the client-side Supabase client

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ variant = "ghost", size = "default", className }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // Get the client-side Supabase instance using the singleton pattern
  const supabase = getSupabaseClient()

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Call the Supabase signOut method
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error al cerrar sesión:", error)
        // Optionally, use a toast notification here to inform the user
        // import { useToast } from "@/components/ui/use-toast";
        // const { toast } = useToast();
        // toast({
        //   title: "Error al cerrar sesión",
        //   description: error.message,
        //   variant: "destructive",
        // });
      } else {
        console.log("Sesión cerrada exitosamente. Redirigiendo a login.");
        // Redirect to the login page
        router.push("/auth/login")
        // Refresh the page to ensure server components re-fetch authentication state
        router.refresh()
      }
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error)
      // Handle unexpected errors
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} disabled={loading} className={className}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </>
      )}
    </Button>
  )
}
