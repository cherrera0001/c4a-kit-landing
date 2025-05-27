import SupabaseConnectionTester from "@/components/debug/supabase-connection-tester"

export const metadata = {
  title: "Diagnóstico de Supabase | Sistema de Evaluación de Madurez",
  description: "Herramienta para diagnosticar la conexión a Supabase",
}

export default function SupabaseDiagnosticPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Conexión a Supabase</h1>
      <SupabaseConnectionTester />
    </div>
  )
}
