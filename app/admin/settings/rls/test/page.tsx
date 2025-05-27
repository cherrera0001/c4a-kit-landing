import { RlsTest } from "@/components/admin/rls-test"

export const metadata = {
  title: "Prueba de RLS | Sistema de Evaluación de Madurez",
  description: "Herramienta para probar las políticas de Row Level Security",
}

export default function RlsTestPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Prueba de Row Level Security</h1>
      <p className="mb-6 text-muted-foreground">
        Utiliza esta herramienta para verificar que las políticas de Row Level Security (RLS) estén funcionando
        correctamente. Puedes probar el acceso a diferentes recursos con distintos roles de usuario.
      </p>

      <div className="mt-6">
        <RlsTest />
      </div>
    </div>
  )
}
