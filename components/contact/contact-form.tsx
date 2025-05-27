"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MathCaptcha } from "./math-captcha"

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStartTime, setFormStartTime] = useState(Date.now())
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: boolean
    message?: string
    errors?: Record<string, string[]>
  }>({})

  // Reiniciar el tiempo cuando se monta el componente
  useEffect(() => {
    setFormStartTime(Date.now())
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Verificar si el captcha es válido
    if (!isCaptchaValid) {
      setFormStatus({
        success: false,
        message: "Por favor, completa la verificación humana correctamente.",
      })
      return
    }

    setIsSubmitting(true)
    setFormStatus({})

    const formData = new FormData(event.currentTarget)

    try {
      // Preparar los datos para enviar al endpoint
      const formValues = {
        name: `${formData.get("first_name")} ${formData.get("last_name")}`,
        email: formData.get("email") as string,
        company: formData.get("company") as string,
        message: formData.get("message") as string,
        subject: "Nuevo mensaje desde el formulario de contacto",
        formStartTime: formStartTime,
      }

      // Enviar datos al endpoint de email
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      })

      const emailResult = await emailResponse.json()

      if (!emailResponse.ok) {
        throw new Error(emailResult.error || "Error al enviar el email")
      }

      // También guardar en la base de datos usando el endpoint existente
      const dbResponse = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          email: formData.get("email"),
          company: formData.get("company"),
          message: formData.get("message"),
        }),
      })

      const dbResult = await dbResponse.json()

      if (!dbResponse.ok) {
        console.warn("El mensaje se envió por email pero no se guardó en la base de datos:", dbResult.error)
      }

      // Mostrar mensaje de éxito
      setFormStatus({
        success: true,
        message: "¡Gracias! Tu mensaje ha sido enviado correctamente. Te responderemos a la brevedad.",
      })

      // Limpiar el formulario
      event.currentTarget.reset()

      // Reiniciar el tiempo del formulario
      setFormStartTime(Date.now())

      toast({
        title: "¡Mensaje enviado!",
        description: "Hemos recibido tu mensaje y te responderemos pronto.",
      })
    } catch (error) {
      console.error("Error:", error)
      setFormStatus({
        success: false,
        message: error instanceof Error ? error.message : "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envíanos un mensaje</CardTitle>
        <CardDescription>Completa el formulario y te responderemos a la brevedad</CardDescription>
      </CardHeader>
      <CardContent>
        {formStatus.message && (
          <Alert
            className={`mb-4 ${formStatus.success ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900" : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"}`}
          >
            {formStatus.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <AlertTitle>{formStatus.success ? "Éxito" : "Error"}</AlertTitle>
            <AlertDescription>{formStatus.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="first_name" className="text-sm font-medium">
                Nombre
              </label>
              <Input id="first_name" name="first_name" placeholder="Tu nombre" required />
              {formStatus.errors?.first_name && (
                <p className="text-sm text-red-500">{formStatus.errors.first_name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium">
                Apellido
              </label>
              <Input id="last_name" name="last_name" placeholder="Tu apellido" required />
              {formStatus.errors?.last_name && <p className="text-sm text-red-500">{formStatus.errors.last_name[0]}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
            {formStatus.errors?.email && <p className="text-sm text-red-500">{formStatus.errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              Empresa
            </label>
            <Input id="company" name="company" placeholder="Nombre de tu empresa" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Mensaje
            </label>
            <Textarea id="message" name="message" placeholder="¿En qué podemos ayudarte?" rows={4} required />
            {formStatus.errors?.message && <p className="text-sm text-red-500">{formStatus.errors.message[0]}</p>}
          </div>

          {/* Campo honeypot - invisible para usuarios pero los bots lo completarán */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          {/* Captcha matemático */}
          <MathCaptcha onChange={setIsCaptchaValid} />

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isSubmitting || !isCaptchaValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Mensaje"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
