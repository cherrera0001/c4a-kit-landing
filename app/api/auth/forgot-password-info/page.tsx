import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ApiInfoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Ruta de API</span>
          </div>
          <CardTitle>Endpoint de Recuperación de Contraseña</CardTitle>
          <CardDescription>Esta es una ruta de API y no una página para visualizar directamente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-slate-100 p-4">
            <h3 className="font-medium mb-1">Información del Endpoint</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Este endpoint acepta solicitudes POST para iniciar el proceso de recuperación de contraseña.
            </p>
            <div className="text-xs font-mono bg-slate-200 p-2 rounded">
              POST /api/auth/forgot-password
              <br />
              Content-Type: application/json
              <br />
              {`{ "email": "usuario@ejemplo.com" }`}
            </div>
          </div>

          <div className="text-center">
            <Button asChild>
              <Link href="/auth/forgot-password">Ir a la página de recuperación de contraseña</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
