import ProfileDiagnostics from "@/components/debug/profile-diagnostics"

export const metadata = {
  title: "Diagnóstico de Perfil | Sistema de Evaluación de Madurez",
  description: "Herramienta de diagnóstico para perfiles de usuario",
}

export default function ProfileDiagnosticsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Diagnóstico de Perfil de Usuario</h1>
      <ProfileDiagnostics />
    </div>
  )
}
