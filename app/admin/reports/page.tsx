import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Informes | Sistema de Evaluación de Madurez",
  description: "Gestión de informes de evaluación de madurez",
}

// Datos de ejemplo para la tabla de informes
const reports = [
  {
    id: "1",
    name: "Informe de Madurez - Empresa A",
    company: "Empresa A",
    type: "full",
    score: 3.5,
    generatedAt: "30/04/2023",
    generatedBy: "Juan Pérez",
  },
  {
    id: "2",
    name: "Informe de Madurez - Empresa B (Preliminar)",
    company: "Empresa B",
    type: "preliminary",
    score: 2.8,
    generatedAt: "15/05/2023",
    generatedBy: "María López",
  },
  {
    id: "3",
    name: "Informe de Madurez - Empresa C (Ejecutivo)",
    company: "Empresa C",
    type: "executive",
    score: 4.0,
    generatedAt: "10/05/2023",
    generatedBy: "Carlos Rodríguez",
  },
  {
    id: "4",
    name: "Informe de Madurez - Empresa D",
    company: "Empresa D",
    type: "full",
    score: 4.2,
    generatedAt: "15/03/2023",
    generatedBy: "Ana Martínez",
  },
  {
    id: "5",
    name: "Informe de Madurez - Empresa E (Técnico)",
    company: "Empresa E",
    type: "technical",
    score: 3.7,
    generatedAt: "20/05/2023",
    generatedBy: "Roberto Sánchez",
  },
]

// Datos de ejemplo para la tabla de informes comparativos
const comparativeReports = [
  {
    id: "1",
    name: "Comparativa Sectorial - Financiero",
    sector: "Financiero",
    companies: 12,
    averageScore: 3.8,
    generatedAt: "15/05/2023",
    generatedBy: "Juan Pérez",
  },
  {
    id: "2",
    name: "Comparativa Sectorial - Salud",
    sector: "Salud",
    companies: 8,
    averageScore: 3.2,
    generatedAt: "10/04/2023",
    generatedBy: "María López",
  },
  {
    id: "3",
    name: "Comparativa Sectorial - Tecnología",
    sector: "Tecnología",
    companies: 15,
    averageScore: 4.1,
    generatedAt: "01/05/2023",
    generatedBy: "Carlos Rodríguez",
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Informes</h2>
        <Button>
          <BarChart3 className="mr-2 h-4 w-4" /> Generar Informe Comparativo
        </Button>
      </div>

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Informes Individuales</TabsTrigger>
          <TabsTrigger value="comparative">Informes Comparativos</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informes de Evaluación</CardTitle>
              <CardDescription>Visualiza y descarga los informes de evaluación de madurez generados.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar informes..." className="pl-8" />
                </div>
                <Button variant="outline">Filtrar</Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Puntuación</TableHead>
                      <TableHead>Fecha Generación</TableHead>
                      <TableHead>Generado Por</TableHead>
                      <TableHead className="w-[100px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.company}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.type === "full" ? "default" : report.type === "executive" ? "outline" : "secondary"
                            }
                          >
                            {report.type === "full"
                              ? "Completo"
                              : report.type === "executive"
                                ? "Ejecutivo"
                                : report.type === "technical"
                                  ? "Técnico"
                                  : "Preliminar"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{report.score}</span>
                        </TableCell>
                        <TableCell>{report.generatedAt}</TableCell>
                        <TableCell>{report.generatedBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="Ver Informe">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Descargar">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparative" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informes Comparativos</CardTitle>
              <CardDescription>Visualiza y descarga los informes comparativos por sector.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar informes comparativos..." className="pl-8" />
                </div>
                <Button variant="outline">Filtrar</Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Empresas</TableHead>
                      <TableHead>Puntuación Media</TableHead>
                      <TableHead>Fecha Generación</TableHead>
                      <TableHead>Generado Por</TableHead>
                      <TableHead className="w-[100px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparativeReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.sector}</TableCell>
                        <TableCell>{report.companies}</TableCell>
                        <TableCell>
                          <span className="font-medium">{report.averageScore}</span>
                        </TableCell>
                        <TableCell>{report.generatedAt}</TableCell>
                        <TableCell>{report.generatedBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="Ver Informe">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Descargar">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
