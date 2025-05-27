import { Spinner } from "@/components/ui/spinner"

export default function CallbackLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md text-center">
        <Spinner className="mx-auto mb-4 h-12 w-12" />
        <h2 className="text-2xl font-bold mb-4">Procesando autenticación...</h2>
        <p className="text-gray-500">Por favor espere mientras completamos el proceso.</p>
      </div>
    </div>
  )
}
