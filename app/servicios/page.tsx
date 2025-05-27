import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, BookOpen, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Servicios | C4A - Cybersecurity For All",
  description: "Conoce nuestros servicios de evaluación de madurez en ciberseguridad y consultoría especializada",
}

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-[#0f1521] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Nuestros Servicios</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ofrecemos soluciones integrales para mejorar la postura de seguridad de tu organización
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-[#111827] border-gray-800 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
              <CardTitle>Evaluación de Madurez</CardTitle>
              <CardDescription className="text-gray-300">
                Evalúa el nivel de madurez en ciberseguridad de tu organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Evaluación completa en 6 categorías</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Resultados instantáneos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Recomendaciones personalizadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Informe descargable en PDF</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/auth/register">
                  Comenzar Evaluación
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-800 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>Consultoría Especializada</CardTitle>
              <CardDescription className="text-gray-300">
                Asesoramiento personalizado para mejorar tu postura de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Análisis de riesgos y vulnerabilidades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Desarrollo de políticas y procedimientos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Implementación de controles de seguridad</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Acompañamiento continuo</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-950">
                <Link href="/contacto">
                  Solicitar Consultoría
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-800 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>Formación y Capacitación</CardTitle>
              <CardDescription className="text-gray-300">
                Capacita a tu equipo en las mejores prácticas de ciberseguridad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Cursos especializados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Talleres prácticos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Simulacros de incidentes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Certificaciones profesionales</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-950">
                <Link href="/formacion">
                  Ver Cursos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">¿No estás seguro de qué servicio necesitas?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Contáctanos para una consulta gratuita y te ayudaremos a determinar la mejor solución para tu organización.
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/contacto">Contactar Ahora</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
