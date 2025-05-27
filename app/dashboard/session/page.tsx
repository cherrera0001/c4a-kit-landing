import { RouteGuard } from "@/components/auth/route-guard"
import { SessionInfo } from "@/components/auth/session-info"

export default function SessionPage() {
  return (
    <RouteGuard>
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">Información de Sesión</h1>
        <div className="grid gap-6">
          <SessionInfo />
        </div>
      </div>
    </RouteGuard>
  )
}
