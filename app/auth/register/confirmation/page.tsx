import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Registro Exitoso | Sistema de Evaluación de Madurez",
  description: "Tu cuenta ha sido creada exitosamente",
}

export default function RegisterConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center">¡Registro Exitoso!</CardTitle>
            <CardDescription className="text-center">Tu cuenta ha sido creada correctamente</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Hemos enviado un correo electrónico de confirmación a tu dirección de correo. Por favor, verifica tu
              bandeja de entrada y sigue las instrucciones para activar tu cuenta.
            </p>
            <p className="text-sm text-gray-500">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam o correo no deseado.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/auth/login">Ir a Iniciar Sesión</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
