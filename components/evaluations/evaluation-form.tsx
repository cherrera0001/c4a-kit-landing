"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getDomains, getQuestionsByDomain, saveEvaluationResponse } from "@/services/database-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EvaluationFormProps {
  evaluationId: string
  initialResponses?: Record<string, { value: number; comments: string }>
}

export default function EvaluationForm({ evaluationId, initialResponses = {} }: EvaluationFormProps) {
  const [domains, setDomains] = useState<any[]>([])
  const [questions, setQuestions] = useState<Record<string, any[]>>({})
  const [responses, setResponses] = useState<Record<string, { value: number; comments: string }>>(initialResponses)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    async function loadDomains() {
      try {
        const result = await getDomains()
        if (result.success) {
          setDomains(result.data || [])

          // Establecer la primera pestaña como activa
          if (result.data && result.data.length > 0) {
            setActiveTab(result.data[0].id.toString())
          }
        } else {
          setError("Error al cargar los dominios")
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Error al cargar los dominios")
      } finally {
        setLoading(false)
      }
    }

    loadDomains()
  }, [])

  useEffect(() => {
    if (activeTab) {
      loadQuestionsForDomain(Number.parseInt(activeTab))
    }
  }, [activeTab])

  async function loadQuestionsForDomain(domainId: number) {
    try {
      // Si ya tenemos las preguntas para este dominio, no las volvemos a cargar
      if (questions[domainId]) return

      const result = await getQuestionsByDomain(domainId)
      if (result.success) {
        setQuestions((prev) => ({
          ...prev,
          [domainId]: result.data || [],
        }))
      } else {
        setError(`Error al cargar las preguntas para el dominio ${domainId}`)
      }
    } catch (err) {
      console.error("Error:", err)
      setError(`Error al cargar las preguntas para el dominio ${domainId}`)
    }
  }

  useEffect(() => {
    // Calcular el progreso
    const totalQuestions = Object.values(questions).flat().length
    if (totalQuestions > 0) {
      const answeredCount = Object.keys(responses).length
      const progress = Math.round((answeredCount / totalQuestions) * 100)
      setProgress(progress)
    }
  }, [responses, questions])

  const handleResponseChange = (questionId: number, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        value,
        comments: prev[questionId]?.comments || "",
      },
    }))
  }

  const handleCommentsChange = (questionId: number, comments: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        value: prev[questionId]?.value || 0,
        comments,
      },
    }))
  }

  const handleSaveResponse = async (questionId: number) => {
    if (!responses[questionId]) return

    setSaving(true)
    try {
      const result = await saveEvaluationResponse({
        evaluation_id: evaluationId,
        question_id: questionId,
        response_value: responses[questionId].value,
        comments: responses[questionId].comments,
      })

      if (!result.success) {
        setError("Error al guardar la respuesta")
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Error al guardar la respuesta")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Formulario de Evaluación</h2>
        <Button onClick={() => router.push(`/admin/evaluations/${evaluationId}/report`)}>Ver Resultados</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progreso de la Evaluación</CardTitle>
          <CardDescription>
            Has completado {Object.keys(responses).length} preguntas ({progress}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${domains.length}, 1fr)` }}>
          {domains.map((domain) => (
            <TabsTrigger key={domain.id} value={domain.id.toString()}>
              {domain.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {domains.map((domain) => (
          <TabsContent key={domain.id} value={domain.id.toString()} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{domain.name}</CardTitle>
                <CardDescription>{domain.description}</CardDescription>
              </CardHeader>
            </Card>

            {questions[domain.id]?.map((question) => (
              <Card key={question.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">{question.text}</CardTitle>
                  {question.description && <CardDescription>{question.description}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 font-medium">Nivel de Madurez</div>
                    <RadioGroup
                      value={responses[question.id]?.value?.toString() || ""}
                      onValueChange={(value) => handleResponseChange(question.id, Number.parseInt(value))}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value.toString()} id={`q-${question.id}-${value}`} />
                            <Label htmlFor={`q-${question.id}-${value}`}>{value}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor={`comments-${question.id}`}>Comentarios</Label>
                    <Textarea
                      id={`comments-${question.id}`}
                      value={responses[question.id]?.comments || ""}
                      onChange={(e) => handleCommentsChange(question.id, e.target.value)}
                      placeholder="Añade comentarios o justificación para tu respuesta"
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={() => handleSaveResponse(question.id)}
                    disabled={!responses[question.id]?.value || saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Respuesta
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
