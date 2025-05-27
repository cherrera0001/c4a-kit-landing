"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

// Importar el componente de gráfico dinámicamente con SSR desactivado
const ChartComponent = dynamic(() => import("./chart-component"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[350px] text-muted-foreground">Cargando gráfico...</div>
  ),
})

interface ComparisonChartProps {
  evaluations: any[]
  title?: string
  description?: string
}

export function ComparisonChart({
  evaluations,
  title = "Comparación de Evaluaciones",
  description = "Comparativa de niveles de madurez entre diferentes evaluaciones",
}: ComparisonChartProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [domains, setDomains] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    // Extraer dominios únicos de todas las evaluaciones
    if (evaluations && evaluations.length > 0) {
      const allDomains = new Set<string>()
      evaluations.forEach((evaluation) => {
        if (evaluation.domain_results) {
          evaluation.domain_results.forEach((domain: any) => {
            if (domain && domain.domain_name) {
              allDomains.add(domain.domain_name)
            }
          })
        }
      })
      setDomains(Array.from(allDomains))
    }
  }, [evaluations])

  if (!evaluations || evaluations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            No hay evaluaciones disponibles para comparar.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar dominio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Puntuación General</SelectItem>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isMounted && <ChartComponent evaluations={evaluations} selectedDomain={selectedDomain} />}
      </CardContent>
    </Card>
  )
}
