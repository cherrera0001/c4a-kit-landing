import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata = {
  title: "Contacto | C4A - Cybersecurity For All",
  description: "Contáctanos para obtener más información sobre nuestros servicios de ciberseguridad",
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1521] text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Contacto</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos para obtener más información sobre nuestros servicios.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ContactForm />

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>Puedes contactarnos directamente a través de estos medios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">contacto@c4a.cl</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Teléfono</h3>
                    <p className="text-gray-600 dark:text-gray-300">+56 2 2123 4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Dirección</h3>
                    <p className="text-gray-600 dark:text-gray-300">Av. Apoquindo 4700, Las Condes, Santiago, Chile</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horario de Atención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span>10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
