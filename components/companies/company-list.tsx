"use client"

import { useEffect, useState } from "react"
import { getCompanies } from "@/services/database-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Loader2, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function CompanyList() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCompanies() {
      try {
        const result = await getCompanies()
        if (result.success) {
          setCompanies(result.data || [])
        } else {
          setError("Error al cargar las empresas")
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Error al cargar las empresas")
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Empresas</h2>
        <Button asChild>
          <Link href="/admin/companies/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Empresa
          </Link>
        </Button>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">No hay empresas registradas</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <Link key={company.id} href={`/admin/companies/${company.id}`}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-primary" />
                    {company.name}
                  </CardTitle>
                  <CardDescription>{company.sector?.name || "Sin sector especificado"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Contacto:</span> {company.contact_name || "No especificado"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {company.contact_email || "No especificado"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
