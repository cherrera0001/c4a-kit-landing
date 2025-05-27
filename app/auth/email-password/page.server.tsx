import { Card, CardContent } from "@/components/ui/card"

// This is a server component version of the email-password page
// It will be used during prerendering and then replaced with the client component
export default function EmailPasswordAuthServerPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Autenticación</h2>
            <p className="text-gray-500">Cargando opciones de inicio de sesión...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
