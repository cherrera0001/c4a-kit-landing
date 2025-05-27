import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TestRLS from "@/components/auth/test-rls"

export const metadata = {
  title: "Configuración de RLS | Sistema de Evaluación de Madurez",
  description: "Configuración y prueba de Row Level Security",
}

export default function RLSSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Configuración de Row Level Security</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Row Level Security (RLS)</CardTitle>
          <CardDescription>
            Row Level Security es una característica de PostgreSQL que permite controlar qué filas pueden ser leídas,
            insertadas, actualizadas o eliminadas por diferentes usuarios.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Las políticas RLS están configuradas para proteger los datos de tu aplicación. Estas políticas garantizan
            que:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Los usuarios solo pueden ver y modificar sus propios datos</li>
            <li>Los administradores tienen acceso completo a todos los datos</li>
            <li>Los datos sensibles están protegidos adecuadamente</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
            <h3 className="text-amber-800 font-medium mb-2">Importante</h3>
            <p className="text-amber-700 text-sm">
              Para que RLS funcione correctamente, asegúrate de que todas las conexiones a la base de datos establezcan
              la variable de sesión <code>app.current_user_id</code> con el ID del usuario actual.
            </p>
          </div>
        </CardContent>
      </Card>

      <TestRLS />
    </div>
  )
}
