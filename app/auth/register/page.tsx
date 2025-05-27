import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import GoogleAuthButtonRedirect from "@/components/auth/google-auth-button-redirect"
import MagicLinkAuth from "@/components/auth/magic-link-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Registro | C4A - Cybersecurity For All",
  description: "Crea una cuenta en C4A para acceder a las evaluaciones de madurez en ciberseguridad.",
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const error = searchParams.error ? String(searchParams.error) : null

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear una cuenta</CardTitle>
          <CardDescription className="text-center">Regístrate para acceder a todas las funcionalidades</CardDescription>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">{error}</div>}
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <MagicLinkAuth />
            </TabsContent>

            <TabsContent value="google">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center">
                  Serás redirigido a Google para registrarte de forma segura
                </p>
                <GoogleAuthButtonRedirect mode="signup" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
