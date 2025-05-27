import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import TestSupabase from "@/components/auth/test-supabase"

export const metadata = {
  title: "Recuperar Contraseña | Sistema de Evaluación de Madurez",
  description: "Solicita un enlace para restablecer tu contraseña",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <h1 className="text-2xl font-bold">Sistema de Evaluación de Madurez</h1>
        </div>
        <ForgotPasswordForm />

        {/* Componente de prueba - eliminar en producción */}
        {process.env.NODE_ENV === "development" && <TestSupabase />}
      </div>
    </div>
  )
}
