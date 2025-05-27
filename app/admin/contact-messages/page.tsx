import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactService } from "@/services/contact-service"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Mensajes de Contacto | Admin C4A",
  description: "Administración de mensajes de contacto",
}

export default async function ContactMessagesPage() {
  const messages = await ContactService.getAllContactMessages()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mensajes de Contacto</h1>

      <div className="grid gap-6">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No hay mensajes de contacto</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {message.first_name} {message.last_name}
                    </CardTitle>
                    <CardDescription>{message.email}</CardDescription>
                  </div>
                  <Badge
                    className={
                      message.status === "pending"
                        ? "bg-yellow-500"
                        : message.status === "completed"
                          ? "bg-green-500"
                          : "bg-blue-500"
                    }
                  >
                    {message.status === "pending"
                      ? "Pendiente"
                      : message.status === "completed"
                        ? "Completado"
                        : "En proceso"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {message.company && (
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">Empresa:</span> {message.company}
                  </p>
                )}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                  <p className="whitespace-pre-wrap">{message.message}</p>
                </div>
                <div className="text-xs text-gray-500">
                  Recibido:{" "}
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
