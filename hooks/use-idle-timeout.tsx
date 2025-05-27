"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/hooks/use-auth" // Ensure useAuth provides a stable 'user' object reference

type IdleTimeoutProps = {
  onIdle: () => void // CRITICAL: Memoize with useCallback in parent
  onActive?: () => void // CRITICAL: Memoize with useCallback in parent
  idleTime: number // en minutos
  warningTime?: number // en minutos
}

export function useIdleTimeout({
  onIdle,
  onActive,
  idleTime,
  warningTime = 1,
}: IdleTimeoutProps) {
  const [isIdle, setIsIdle] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)

  const { user } = useAuth()

  // Convertir minutos a milisegundos
  // These are stable if idleTime and warningTime props are stable primitives
  const idleTimeMs = idleTime * 60 * 1000
  const warningTimeMs = warningTime * 60 * 1000

  // Función para registrar el evento de cierre de sesión por inactividad
  // Depends on 'user' and 'idleTime'. 'user' must be stable from useAuth.
  // 'idleTime' is a primitive prop, stable if not changed by parent.
  const logIdleTimeout = useCallback(async () => {
    if (!user) return

    try {
      await fetch("/api/auth/session-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: "idle_timeout",
          event_reason: `Sesión cerrada automáticamente después de ${idleTime} minutos de inactividad`,
        }),
      })
    } catch (error) {
      console.error("Error al registrar cierre de sesión por inactividad:", error)
    }
  }, [user, idleTime])

  // Clears all existing timers and resets warning/countdown state
  const clearExistingTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
    setShowWarning(false)
    setRemainingTime(0)
  }, []) // No dependencies, this function is stable

  // Sets up the warning and idle timeouts
  // This function's stability is crucial. It should only be recreated if its fundamental parameters change.
  // It no longer depends on 'isIdle' state for its definition.
  const setupTimers = useCallback(() => {
    clearExistingTimers() // Clear before setting new ones

    // Configurar temporizador de advertencia (if applicable)
    if (idleTimeMs > warningTimeMs && warningTimeMs > 0) {
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true)
        setRemainingTime(Math.floor(warningTimeMs / 1000))

        // Iniciar cuenta regresiva
        countdownTimerRef.current = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
              // Idle timer will handle the actual onIdle transition
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }, idleTimeMs - warningTimeMs)
    }

    // Configurar temporizador de inactividad
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true) // Set state to idle
      // Ensure warning UI is hidden and countdown stops when truly idle
      setShowWarning(false)
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)

      logIdleTimeout().then(() => {
        if (onIdle) onIdle() // Call the provided onIdle callback
      })
    }, idleTimeMs)

    // If an onActive callback is provided, call it to signify activity (timers have been reset)
    if (onActive) onActive()

  }, [idleTimeMs, warningTimeMs, onIdle, onActive, logIdleTimeout, clearExistingTimers])


  // Handles user activity detected by event listeners
  const handleActivity = useCallback(() => {
    if (isIdle) {
      // User was idle, but now is active again
      setIsIdle(false) // This state change will trigger the main useEffect
    } else {
      // User is active and continues to be active, reset timers
      setupTimers()
    }
  }, [isIdle, setupTimers]) // Depends on current isIdle state and the stable setupTimers

  // Main useEffect to manage timers and event listeners
  useEffect(() => {
    if (!isIdle) {
      // If the state is not idle (initial mount or became active after being idle),
      // set up the timers.
      setupTimers()
    }
    // If 'isIdle' is true, timers would have been cleared by the idle timeout itself,
    // or by clearExistingTimers. We don't start new timers here,
    // but we keep event listeners active to detect when the user becomes active again.

    const events: (keyof WindowEventMap)[] = ["mousedown", "mousemove", "keydown", "touchstart", "click", "scroll"]
    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Cleanup function on unmount or when dependencies change
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      // Clear all timers on unmount
      clearExistingTimers()
    }
  }, [isIdle, setupTimers, handleActivity, clearExistingTimers]) // Dependencies that control the effect lifecycle

  // Public function to manually indicate activity / keep session alive
  const keepActive = useCallback(() => {
    if (isIdle) {
      setIsIdle(false) // If was idle, set to active. useEffect will handle restarting timers.
    } else {
      setupTimers() // If already active, just reset timers.
    }
  }, [isIdle, setupTimers])

  // Public function to manually clear all timers and reset state
  const clearAllTimers = useCallback(() => {
    clearExistingTimers()
    setIsIdle(false) // Explicitly set to not idle if timers are cleared manually
  }, [clearExistingTimers])

  return {
    isIdle,
    showWarning,
    remainingTime,
    keepActive,
    clearTimeout: clearAllTimers, // Exported with a clearer name
  }
}
