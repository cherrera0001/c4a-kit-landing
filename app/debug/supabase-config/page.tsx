import { Suspense } from "react"
import { SupabaseConfigChecker } from "@/components/debug/supabase-config-checker"

export default function SupabaseConfigPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Diagnóstico de Configuración de Supabase</h1>

      <Suspense fallback={<div>Cargando diagnóstico...</div>}>
        <SupabaseConfigChecker />
      </Suspense>
    </div>
  )
}
