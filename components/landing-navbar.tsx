"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
// Importar el ThemeToggle
import { ThemeToggle } from "@/components/theme-toggle"

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-[#0f1521] dark:bg-[#0f1521] border-b border-gray-800 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-red-500 font-bold text-xl mr-1">C4A</span>
            <span className="text-sm text-gray-400">Cybersecurity For All</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300">
                Inicio
              </Link>
              <Link
                href="/evaluacion"
                className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
              >
                Evaluación
              </Link>
              <Link
                href="/servicios"
                className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
              >
                Servicios
              </Link>
              <Link
                href="/precios"
                className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
              >
                Precios
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild variant="ghost" className="text-gray-700 dark:text-white">
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              type="button"
              className="ml-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white dark:bg-[#0f1521] border-t border-gray-200 dark:border-gray-800 py-4">
        <div className="container mx-auto px-4 space-y-2">
          <Link
            href="/"
            className="block py-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/evaluacion"
            className="block py-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Evaluación
          </Link>
          <Link
            href="/servicios"
            className="block py-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Servicios
          </Link>
          <Link
            href="/precios"
            className="block py-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Precios
          </Link>
          <div className="pt-4 space-y-2">
            <Button asChild variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="w-full bg-red-600 hover:bg-red-700" onClick={() => setIsMenuOpen(false)}>
              <Link href="/auth/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
