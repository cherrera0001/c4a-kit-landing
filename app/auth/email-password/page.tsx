"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import EmailPasswordSignin from "@/components/auth/email-password-signin"
import EmailPasswordSignup from "@/components/auth/email-password-signup"
import PasswordResetRequest from "@/components/auth/password-reset-request"

export default function EmailPasswordAuthPage() {
  const [activeTab, setActiveTab] = useState("signin")

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="signin">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <EmailPasswordSignin />
            </TabsContent>

            <TabsContent value="signup">
              <EmailPasswordSignup />
            </TabsContent>

            <TabsContent value="reset">
              <PasswordResetRequest />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          {activeTab === "signin" && (
            <div className="text-sm text-gray-500 flex flex-col items-center space-y-2">
              <div>
                ¿No tienes una cuenta?{" "}
                <button onClick={() => setActiveTab("signup")} className="text-primary hover:underline">
                  Regístrate
                </button>
              </div>
              <button onClick={() => setActiveTab("reset")} className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          {activeTab === "signup" && (
            <div className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <button onClick={() => setActiveTab("signin")} className="text-primary hover:underline">
                Inicia sesión
              </button>
            </div>
          )}

          {activeTab === "reset" && (
            <button onClick={() => setActiveTab("signin")} className="text-sm text-primary hover:underline">
              Volver a inicio de sesión
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
