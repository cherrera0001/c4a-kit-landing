import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, BookOpen, Calendar } from "lucide-react"

export const metadata = {
  title: "Formación | C4A - Cybersecurity For All",
  description: "Cursos y talleres de formación en ciberseguridad para profesionales y empresas",
}

export default function FormacionPage() {
  return (
    <div className="min-h-screen bg-[#0f1521] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Formación en Ciberseguridad</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Capacita a tu equipo con nuestros cursos especializados en ciberseguridad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Fundamentos de Ciberseguridad",
              description: "Curso introductorio para comprender los conceptos básicos de la ciberseguridad",
              level: "Básico",
              duration: "20 horas",
              participants: "Máximo 15",
              nextDate: "15 de junio, 2023",
              price: "$250.000",
              color: "blue",
            },
            {
              title: "Gestión de Riesgos en Ciberseguridad",
              description: "Aprende a identificar, evaluar y mitigar riesgos de seguridad en tu organización",
              level: "Intermedio",
              duration: "30 horas",
              participants: "Máximo 12",
              nextDate: "10 de julio, 2023",
              price: "$350.000",
              color: "green",
            },
            {
              title: "Respuesta a Incidentes",
              description: "Desarrolla habilidades para responder efectivamente ante incidentes de seguridad",
              level: "Avanzado",
              duration: "40 horas",
              participants: "Máximo 10",
              nextDate: "5 de agosto, 2023",
              price: "$450.000",
              color: "red",
            },
            {
              title: "Seguridad en la Nube",
              description: "Estrategias y mejores prácticas para proteger entornos cloud",
              level: "Intermedio",
              duration: "25 horas",
              participants: "Máximo 12",
              nextDate: "20 de julio, 2023",
              price: "$380.000",
              color: "purple",
            },
            {
              title: "Hacking Ético",
              description: "Técnicas y herramientas para realizar pruebas de penetración",
              level: "Avanzado",
              duration: "45 horas",
              participants: "Máximo 8",
              nextDate: "15 de agosto, 2023",
              price: "$500.000",
              color: "orange",
            },
            {
              title: "Seguridad para Desarrolladores",
              description: "Aprende a desarrollar aplicaciones seguras desde el diseño",
              level: "Intermedio",
              duration: "35 horas",
              participants: "Máximo 12",
              nextDate: "1 de septiembre, 2023",
              price: "$400.000",
              color: "teal",
            },
          ].map((course, index) => (
            <Card key={index} className="bg-[#111827] border-gray-800 text-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{course.title}</CardTitle>
                  <Badge
                    className={`
                      ${course.level === "Básico" ? "bg-blue-500" : ""} 
                      ${course.level === "Intermedio" ? "bg-green-500" : ""} 
                      ${course.level === "Avanzado" ? "bg-red-500" : ""}
                    `}
                  >
                    {course.level}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{course.participants}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Próxima fecha: {course.nextDate}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">{course.price}</span>
                      <span className="text-xs text-gray-400">por persona</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href="/contacto">Solicitar Información</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-[#111827] border border-gray-800 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Formación a Medida para Empresas</h2>
            <p className="text-gray-300">
              Diseñamos programas de formación adaptados a las necesidades específicas de tu organización
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1a2436] p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Formación In-Company</h3>
              <p className="text-gray-300 text-sm">
                Llevamos nuestros cursos a tus instalaciones, adaptando contenidos y horarios a tus necesidades.
              </p>
            </div>

            <div className="bg-[#1a2436] p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Programas Personalizados</h3>
              <p className="text-gray-300 text-sm">
                Desarrollamos contenidos específicos según los riesgos y necesidades de tu sector.
              </p>
            </div>

            <div className="bg-[#1a2436] p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Planes Continuos</h3>
              <p className="text-gray-300 text-sm">
                Programas de formación continua para mantener a tu equipo actualizado en ciberseguridad.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/contacto">Solicitar Propuesta Personalizada</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
