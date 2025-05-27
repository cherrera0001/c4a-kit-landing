"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 dark:bg-[#0a101b] text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-red-500 font-bold text-xl mr-1">C4A</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Cybersecurity For All</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Ayudamos a organizaciones de todos los tamaños a mejorar su postura de seguridad a través de evaluaciones,
              consultoría y formación especializada.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {[
                { name: "Inicio", href: "/" },
                { name: "Evaluación", href: "/evaluacion" },
                { name: "Servicios", href: "/servicios" },
                { name: "Formación", href: "/formacion" },
                { name: "Contacto", href: "/contacto" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="font-bold text-lg mb-4">Servicios</h3>
            <ul className="space-y-2">
              {[
                { name: "Evaluación de Madurez", href: "/servicios#evaluacion" },
                { name: "Consultoría", href: "/servicios#consultoria" },
                { name: "Formación", href: "/servicios#formacion" },
                { name: "Auditoría", href: "/servicios#auditoria" },
                { name: "Respuesta a Incidentes", href: "/servicios#incidentes" },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">contacto@c4a.cl</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">+56 2 2123 4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  Av. Apoquindo 4700, Las Condes, Santiago, Chile
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} C4A - Cybersecurity For All. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacidad"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-sm"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/terminos"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-sm"
            >
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
