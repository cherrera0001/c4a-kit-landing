import ResetPasswordForm from "@/components/auth/reset-password-form"

export const metadata = {
  title: "Restablecer Contraseña | Sistema de Evaluación de Madurez",
  description: "Establece una nueva contraseña para tu cuenta",
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <h1 className="text-2xl font-bold">Sistema de Evaluación de Madurez</h1>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
