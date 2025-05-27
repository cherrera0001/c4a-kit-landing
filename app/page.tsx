import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1521] text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Evaluación de Madurez en <span className="text-red-500">Ciberseguridad</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            Descubre el nivel de madurez en ciberseguridad de tu organización y obtén recomendaciones personalizadas
            para mejorar tu postura de seguridad.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/auth/register">Realizar Evaluación →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 dark:bg-[#111827] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Evaluación de Madurez</h2>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Gratuito</span>
          </div>
          <ul className="space-y-3">
            {[
              "Evaluación completa en 6 categorías",
              "Resultados instantáneos",
              "Recomendaciones personalizadas",
              "Comparativa con tu industria",
              "Informe descargable en PDF",
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full mt-6 bg-red-600 hover:bg-red-700">
            <Link href="/auth/register">Comenzar Ahora →</Link>
          </Button>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 dark:bg-[#0a101b] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Nuestros Servicios</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales para mejorar la postura de seguridad de tu organización
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Evaluación de Madurez",
                description:
                  "Evalúa el nivel de madurez en ciberseguridad de tu organización con nuestra herramienta especializada.",
                icon: "🛡️",
                link: "/auth/register",
                linkText: "Comenzar evaluación →",
              },
              {
                title: "Consultoría",
                description: "Recibe asesoramiento personalizado para mejorar la postura de seguridad de tu empresa.",
                icon: "👥",
                link: "/servicios/consultoria",
                linkText: "Solicitar consultoría →",
              },
              {
                title: "Formación",
                description:
                  "Capacita a tu equipo en las mejores prácticas de ciberseguridad con nuestros cursos especializados.",
                icon: "📚",
                link: "/servicios/formacion",
                linkText: "Ver cursos →",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#111827] p-6 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                <Link href={service.link} className="text-red-500 hover:text-red-400 font-medium inline-block">
                  {service.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonios Section */}
      <div className="py-20 bg-white dark:bg-[#0f1521]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Empresas de diversos sectores han mejorado su postura de seguridad con nuestras soluciones
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                position: "CISO, Empresa de Retail",
                testimonial:
                  "La evaluación de madurez nos permitió identificar rápidamente nuestras debilidades y priorizar las inversiones en seguridad de manera efectiva.",
                avatar: "/avatar-woman-1.png",
              },
              {
                name: "Carlos Rodríguez",
                position: "CTO, Fintech",
                testimonial:
                  "El equipo de C4A nos brindó un soporte excepcional durante todo el proceso. Las recomendaciones fueron precisas y adaptadas a nuestra realidad.",
                avatar: "/avatar-man-1.png",
              },
              {
                name: "Ana Martínez",
                position: "Gerente TI, Sector Salud",
                testimonial:
                  "Implementamos las recomendaciones y en menos de 6 meses mejoramos significativamente nuestra postura de seguridad, cumpliendo con las regulaciones del sector.",
                avatar: "/avatar-woman-2.png",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-[#111827] p-6 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col"
              >
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{testimonial.testimonial}"</p>
                </div>
                <div className="flex items-center mt-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
