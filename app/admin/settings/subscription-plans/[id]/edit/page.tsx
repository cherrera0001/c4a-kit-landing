import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTipoDiagnosticoById } from "@/services/subscription-service"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { EditSubscriptionPlanForm } from "@/components/admin/edit-subscription-plan-form"

interface EditSubscriptionPlanPageProps {
  params: {
    id: string
  }
}

export default async function EditSubscriptionPlanPage({ params }: EditSubscriptionPlanPageProps) {
  const { data: plan, success } = await getTipoDiagnosticoById(params.id)

  if (!success || !plan) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/settings/subscription-plans">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Editar Plan de Suscripción</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar: {plan.nombre_kit}</CardTitle>
          <CardDescription>Modifique las características y configuración del plan de suscripción</CardDescription>
        </CardHeader>
        <CardContent>
          <EditSubscriptionPlanForm plan={plan} />
        </CardContent>
      </Card>
    </div>
  )
}
