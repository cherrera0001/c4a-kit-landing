"use client"

import { useEffect, useState } from "react"
import { useIdleTimeout } from "@/hooks/use-idle-timeout"
import { useAuth } from "@/hooks/use-auth"
import { AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type IdleTimeoutWarningProps = {
  idleTime?: number // en minutos
  warningTime?: number // en minutos
}

export function IdleTimeoutWarning({
  idleTime = 30, // 30 minutos por defecto
  warningTime = 1, // 1 minuto de advertencia por defecto
}: IdleTimeoutWarningProps) {
  const { signOut, status } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [keepActiveFlag, setKeepActiveFlag] = useState(false)

  const handleIdle = async () => {
    await signOut()
  }

  const timeout = useIdleTimeout({
    onIdle: handleIdle,
    idleTime,
    warningTime,
  })

  const keepActive = () => {
    setKeepActiveFlag(true)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || status !== "authenticated") {
      return
    }

    setShowWarning(timeout.showWarning)
    setRemainingTime(timeout.remainingTime)

    return () => {
      // Aquí está el error: timeout.clearTimeout no es una función
      if (timeout && typeof timeout.clearTimeout === "function") {
        timeout.clearTimeout()
      }
    }
  }, [isClient, status, idleTime, warningTime, signOut, keepActiveFlag, timeout])

  // Formatear el tiempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isClient || status !== "authenticated") {
    return null
  }

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Sesión a punto de expirar
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tu sesión expirará en <span className="font-bold">{formatTime(remainingTime)}</span> por inactividad.
            ¿Deseas mantener la sesión activa?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleIdle()}>Cerrar sesión</AlertDialogCancel>
          <AlertDialogAction onClick={keepActive}>Mantener sesión</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
