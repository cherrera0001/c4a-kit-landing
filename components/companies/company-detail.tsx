"use client"

import { useEffect, useState } from "react"
import { getCompanyById } from "@/services/database-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Edit, Loader2, Mail, Phone, User } from "lucide-react"
import Link from "next/link"

interface CompanyDetailProps {
  companyId: string
}

export default function CompanyDetail({ companyId }: CompanyDetailProps) {
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCompany() {
      try {
        const result = await getCompanyById(companyId)
        if (result.success) {
          setCompany(result.data)
        } else {
          setError("Error al cargar los datos de la empresa")
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Error al cargar los datos de la empresa")
      } finally {
        setLoading(false)
      }
    }

    loadCompany()
  }, [companyId])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !company) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error || "No se encontró la empresa"}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Building className="mr-2 h-6 w-6" />
          {company.name}
        </h2>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/companies/${company.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/companies/${company.id}/evaluations/new`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Evaluación
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium">Sector</div>
              <div>{company.sector?.name || "No especificado"}</div>
            </div>
            <div>
              <div className="font-medium">Descripción</div>
              <div>{company.description || "No hay descripción disponible"}</div>
            </div>
            <div>
              <div className="font-medium">Tamaño</div>
              <div>{getSizeText(company.size) || "No especificado"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              <div>
                <div className="font-medium">Nombre de Contacto</div>
                <div>{company.contact_name || "No especificado"}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              <div>
                <div className="font-medium">Email de Contacto</div>
                <div>{company.contact_email || "No especificado"}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              <div>
                <div className="font-medium">Teléfono de Contacto</div>
                <div>{company.contact_phone || "No especificado"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evaluaciones</CardTitle>
          <CardDescription>Historial de evaluaciones realizadas a esta empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <EvaluationsList companyId={company.id} />
        </CardContent>
      </Card>
    </div>
  )
}

function getSizeText(size: number | null): string {
  if (size === null) return ""

  const sizes = {
    1: "Pequeña (1-50 empleados)",
    2: "Mediana (51-250 empleados)",
    3: "Grande (251-1000 empleados)",
    4: "Muy grande (1000+ empleados)",
  }

  return sizes[size as keyof typeof sizes] || "Desconocido"
}

// Este componente se implementará más adelante
function EvaluationsList({ companyId }: { companyId: string }) {
  return <div className="text-center text-gray-500">Implementación pendiente del listado de evaluaciones</div>
}

// Importar el icono que faltaba
import { PlusCircle } from "lucide-react"
