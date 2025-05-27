"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ChartWrapperProps {
  children: React.ReactNode
}

export function ChartWrapper({ children }: ChartWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return <div className="flex items-center justify-center h-[350px] text-muted-foreground">Cargando gráfico...</div>
  }

  return <>{children}</>
}
