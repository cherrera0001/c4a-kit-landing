"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus } from "lucide-react"
import { addBlockedDomain, removeBlockedDomain } from "@/lib/email-validator"

// En un entorno real, estos dominios vendrían de una base de datos
// Aquí los simulamos con un array local
const initialBlockedDomains = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "temp-mail.org",
  "guerrillamail.com",
  "mailinator.com",
]

export default function EmailDomainsPage() {
  const [blockedDomains, setBlockedDomains] = useState<string[]>(initialBlockedDomains)
  const [newDomain, setNewDomain] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleAddDomain = () => {
    if (!newDomain) {
      setError("Por favor, introduce un dominio")
      return
    }

    if (!newDomain.includes(".")) {
      setError("Por favor, introduce un dominio válido (ej: ejemplo.com)")
      return
    }

    if (blockedDomains.includes(newDomain.toLowerCase())) {
      setError("Este dominio ya está en la lista")
      return
    }

    // Añadir a la lista local
    setBlockedDomains([...blockedDomains, newDomain.toLowerCase()])

    // Añadir al servicio
    addBlockedDomain(newDomain)

    setNewDomain("")
    setError(null)
  }

  const handleRemoveDomain = (domain: string) => {
    // Eliminar de la lista local
    setBlockedDomains(blockedDomains.filter((d) => d !== domain))

    // Eliminar del servicio
    removeBlockedDomain(domain)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Dominios de Correo</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dominios Bloqueados</CardTitle>
            <CardDescription>
              Los usuarios con correos de estos dominios no podrán registrarse en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input placeholder="ejemplo.com" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} />
              <Button onClick={handleAddDomain}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
            </div>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dominio</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedDomains.map((domain) => (
                    <TableRow key={domain}>
                      <TableCell>{domain}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveDomain(domain)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {blockedDomains.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                        No hay dominios bloqueados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
            <CardDescription>
              Gestiona qué dominios de correo electrónico pueden registrarse en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">¿Qué son los dominios bloqueados?</h3>
                <p className="text-sm text-gray-600">
                  Los dominios bloqueados son aquellos que no se permiten para el registro de usuarios. Normalmente, se
                  bloquean dominios de correo personal (como Gmail o Hotmail) y dominios de correo temporal para
                  asegurar que solo usuarios con correos corporativos puedan registrarse.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Recomendaciones</h3>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Bloquea dominios de correo personal comunes (gmail.com, hotmail.com, etc.)</li>
                  <li>Bloquea dominios de correo temporal (temp-mail.org, mailinator.com, etc.)</li>
                  <li>Considera si quieres permitir dominios específicos de empresas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
