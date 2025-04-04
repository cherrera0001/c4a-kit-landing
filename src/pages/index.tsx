import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { RocketIcon, ShieldCheckIcon, TargetIcon, BarChart3Icon, MailIcon, DownloadIcon } from "lucide-react";

export default function LandingC4AKit() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white p-6">
      <section className="max-w-6xl mx-auto grid gap-12 text-center py-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-emerald-400">
            Diagnostica, Mejora y Despega con el Kit de Madurez Digital C4A
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Evalúa tu madurez, toma acción y demuestra que estás listo para despegar.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="/kit/C4A_Kit_Madurez_v1.xlsx"
              download
              className="text-lg px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl inline-flex gap-2 items-center"
            >
              <DownloadIcon className="w-5 h-5" /> Kit Básico (Descarga Libre)
            </a>
            <a
              href="https://form.jotform.com/tu_formulario_para_kit_mediano"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg px-6 py-3 border border-emerald-400 text-emerald-400 hover:bg-emerald-900/20 rounded-xl inline-flex gap-2 items-center"
            >
              <ShieldCheckIcon className="w-5 h-5" /> Solicitar Kit Mediano
            </a>
            <Button variant="outline" className="text-lg px-6 py-3 border-emerald-400 text-emerald-400 hover:bg-emerald-900/20 flex items-center gap-2">
              <MailIcon className="w-5 h-5" /> Agendar Diagnóstico
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <RocketIcon className="h-10 w-10 mb-4 text-emerald-400" />
              <h3 className="text-xl font-semibold text-white">Despega tu estrategia</h3>
              <p className="text-sm text-slate-400 mt-2">
                Descubre en qué nivel estás y diseña el roadmap de madurez de tu empresa digital o software factory.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <ShieldCheckIcon className="h-10 w-10 mb-4 text-emerald-400" />
              <h3 className="text-xl font-semibold text-white">Ciberseguridad aplicable</h3>
              <p className="text-sm text-slate-400 mt-2">
                Herramientas prácticas, listas para implementar, pensadas para pymes, startups y equipos que están creciendo.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <TargetIcon className="h-10 w-10 mb-4 text-emerald-400" />
              <h3 className="text-xl font-semibold text-white">Diagnóstico real</h3>
              <p className="text-sm text-slate-400 mt-2">
                Evalúa 8 dominios críticos como riesgos, cumplimiento, desarrollo seguro y cultura.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <BarChart3Icon className="h-10 w-10 mb-4 text-emerald-400" />
              <h3 className="text-xl font-semibold text-white">Visualización clara</h3>
              <p className="text-sm text-slate-400 mt-2">
                Radar de madurez, resultados comparativos, plan de acción y más. Todo en un kit descargable.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl font-semibold text-white">
            Este kit ha sido diseñado por profesionales en ciberseguridad que han trabajado con startups y corporativos. 
            Si estás listo para dejar el cascarón, este es tu primer gran salto.
          </p>
          <div className="mt-6">
            <Button className="text-lg px-8 py-4">¡Quiero despegar!</Button>
          </div>
        </div>
      </section>
    </div>
  );
}