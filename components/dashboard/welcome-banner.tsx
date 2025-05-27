"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WelcomeBanner({ userName }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Cerrar</span>
      </Button>
      <h2 className="text-lg font-semibold">¡Bienvenido/a, {userName || "Usuario"}!</h2>
      <p className="mt-1">
        Tu cuenta ha sido configurada correctamente. Ahora puedes comenzar a utilizar todas las funcionalidades de la
        plataforma.
      </p>
    </div>
  )
}
