"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { IdleTimeoutWarning } from "@/components/auth/idle-timeout-warning"

type IdleTimeoutSettings = {
  enabled: boolean
  idleTime: number
  warningTime: number
}

const defaultSettings: IdleTimeoutSettings = {
  enabled: true,
  idleTime: 30, // 30 minutos
  warningTime: 1, // 1 minuto
}

const IdleTimeoutContext = createContext<{
  settings: IdleTimeoutSettings
  updateSettings: (settings: IdleTimeoutSettings) => void
}>({
  settings: defaultSettings,
  updateSettings: () => {},
})

export const useIdleTimeoutSettings = () => useContext(IdleTimeoutContext)

export function IdleTimeoutProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, setSettings] = useState<IdleTimeoutSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar configuración desde localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("idleTimeoutSettings")
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }
      } catch (error) {
        console.error("Error loading idle timeout settings:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSettings()
  }, [])

  const updateSettings = (newSettings: IdleTimeoutSettings) => {
    setSettings(newSettings)
    localStorage.setItem("idleTimeoutSettings", JSON.stringify(newSettings))
  }

  return (
    <IdleTimeoutContext.Provider value={{ settings, updateSettings }}>
      {children}
      {isLoaded && settings.enabled && (
        <IdleTimeoutWarning idleTime={settings.idleTime} warningTime={settings.warningTime} />
      )}
    </IdleTimeoutContext.Provider>
  )
}
