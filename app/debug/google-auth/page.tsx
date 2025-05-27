import GoogleAuthDebug from "@/components/debug/google-auth-debug"

export default function GoogleAuthDebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Depuración de Autenticación con Google</h1>
      <GoogleAuthDebug />
    </div>
  )
}
