import { CreateUserForm } from "@/components/admin/create-user-form-updated"

export const metadata = {
  title: "Crear Usuario | Sistema de Evaluación de Madurez",
  description: "Añadir un nuevo usuario al sistema",
}

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Crear Nuevo Usuario</h2>

      <CreateUserForm />
    </div>
  )
}
