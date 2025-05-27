"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type IdleTimeoutSettingsProps = {
  defaultIdleTime?: number // en minutos
  defaultWarningTime?: number // en minutos
  defaultEnabled?: boolean
  onSave?: (settings: {
    enabled: boolean
    idleTime: number
    warningTime: number
  }) => void
}

export function IdleTimeoutSettings({
  defaultIdleTime = 30,
  defaultWarningTime = 1,
  defaultEnabled = true,
  onSave,
}: IdleTimeoutSettingsProps) {
  const [enabled, setEnabled] = useState(defaultEnabled)
  const [idleTime, setIdleTime] = useState(defaultIdleTime)
  const [warningTime, setWarningTime] = useState(defaultWarningTime)
  const { toast } = useToast()

  const handleSave = () => {
    // Guardar en localStorage
    localStorage.setItem(
      "idleTimeoutSettings",
      JSON.stringify({
        enabled,
        idleTime,
        warningTime,
      }),
    )

    // Llamar al callback si existe
    if (onSave) {
      onSave({
        enabled,
        idleTime,
        warningTime,
      })
    }

    toast({
      title: "Configuración guardada",
      description: "La configuración de tiempo de inactividad ha sido actualizada.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de cierre automático</CardTitle>
        <CardDescription>Configura el tiempo de inactividad antes de cerrar la sesión automáticamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="idle-timeout-enabled" className="flex-1">
            Cerrar sesión por inactividad
          </Label>
          <Switch id="idle-timeout-enabled" checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label htmlFor="idle-time">Tiempo de inactividad</Label>
              <span className="text-sm text-muted-foreground">{idleTime} minutos</span>
            </div>
            <Slider
              id="idle-time"
              disabled={!enabled}
              min={5}
              max={120}
              step={5}
              value={[idleTime]}
              onValueChange={(value) => setIdleTime(value[0])}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label htmlFor="warning-time">Tiempo de advertencia</Label>
              <span className="text-sm text-muted-foreground">{warningTime} minutos</span>
            </div>
            <Slider
              id="warning-time"
              disabled={!enabled}
              min={1}
              max={10}
              step={1}
              value={[warningTime]}
              onValueChange={(value) => setWarningTime(value[0])}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Se mostrará una advertencia {warningTime} minutos antes de cerrar la sesión.
            </p>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Guardar configuración
        </Button>
      </CardContent>
    </Card>
  )
}
