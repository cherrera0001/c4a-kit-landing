import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Evaluación de Madurez en Ciberseguridad | C4A",
  description: "Evalúa el nivel de madurez en ciberseguridad de tu organización con nuestra herramienta especializada.",
}

export default function EvaluacionPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Evaluación de Madurez en Ciberseguridad
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Nuestra herramienta de evaluación te permite medir el nivel de madurez en ciberseguridad de tu organización
            en diferentes áreas clave.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/auth/register">Comenzar Evaluación</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contacto">Solicitar Demo</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluación Básica</CardTitle>
              <CardDescription>Para pequeñas empresas y startups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Evaluación de 5 dominios clave de ciberseguridad
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Reporte básico con recomendaciones generales</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Tiempo estimado: 15-20 minutos</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/auth/register?plan=basic">Comenzar</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full w-fit mb-2">
                Recomendado
              </div>
              <CardTitle>Evaluación Completa</CardTitle>
              <CardDescription>Para medianas empresas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Evaluación de 10 dominios de ciberseguridad</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Reporte detallado con recomendaciones específicas
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Comparativa con estándares de la industria</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Tiempo estimado: 30-40 minutos</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/auth/register?plan=complete">Comenzar</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evaluación Enterprise</CardTitle>
              <CardDescription>Para grandes empresas y organizaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Evaluación exhaustiva de 15+ dominios de ciberseguridad
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Reporte ejecutivo y técnico con plan de acción detallado
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Consultoría personalizada con expertos en ciberseguridad
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contacto?subject=Enterprise">Contactar</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Registro</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Crea una cuenta para acceder a la herramienta de evaluación
              </p>
            </div>
            <div>
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Evaluación</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Responde preguntas sobre las prácticas de ciberseguridad de tu organización
              </p>
            </div>
            <div>
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Resultados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Recibe un informe detallado con recomendaciones personalizadas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
