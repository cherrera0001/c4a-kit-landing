import MagicLinkAuth from "@/components/auth/magic-link-auth"

export default function MagicLinkPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Iniciar sesión con enlace mágico
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para iniciar sesión sin contraseña.
          </p>
        </div>

        <div className="mt-8">
          <MagicLinkAuth />
        </div>
      </div>
    </div>
  )
}
