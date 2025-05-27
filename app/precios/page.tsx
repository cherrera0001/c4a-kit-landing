import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Precios | C4A - Cybersecurity For All",
  description: "Conoce nuestros planes y precios para mejorar la seguridad de tu organización",
}

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1521] text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Planes y Precios</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ofrecemos diferentes planes adaptados a las necesidades de tu organización
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plan Básico */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">Básico</CardTitle>
              <CardDescription>Para pequeñas empresas</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$299</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">/ mes</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Evaluación de madurez básica",
                  "Hasta 3 usuarios",
                  "Recomendaciones generales",
                  "Soporte por email",
                  "Actualizaciones trimestrales",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link href="/contacto">Comenzar</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Plan Profesional */}
          <Card className="border-2 border-red-500 relative">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-lg">
              Más Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Profesional</CardTitle>
              <CardDescription>Para empresas medianas</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$599</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">/ mes</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Evaluación de madurez completa",
                  "Hasta 10 usuarios",
                  "Recomendaciones personalizadas",
                  "Comparativa con la industria",
                  "Soporte prioritario",
                  "Actualizaciones mensuales",
                  "Informes detallados en PDF",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/contacto">Comenzar</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Plan Enterprise */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>Para grandes organizaciones</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Personalizado</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Evaluación de madurez avanzada",
                  "Usuarios ilimitados",
                  "Consultoría personalizada",
                  "Análisis de riesgos detallado",
                  "Soporte 24/7",
                  "Actualizaciones semanales",
                  "Integración con sistemas existentes",
                  "Formación para el equipo",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link href="/contacto">Contactar</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas una solución personalizada?</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Contáctanos para discutir tus necesidades específicas y crear un plan a medida para tu organización.
          </p>
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
            <Link href="/contacto">Solicitar Cotización</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
