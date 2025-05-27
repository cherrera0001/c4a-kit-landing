"use server"

import { ContactService } from "@/services/contact-service"
import { z } from "zod"
import type { ContactFormValues } from "@/types/forms"

// Esquema de validación para el formulario de contacto
const contactFormSchema = z.object({
  first_name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  last_name: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor, introduce un email válido" }),
  company: z.string().optional(),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
  website: z.string().optional(), // Campo honeypot
  captcha_answer: z.string().min(1, { message: "Por favor, completa el captcha" }),
  captcha_expected: z.string().min(1),
  form_start_time: z.string().optional(),
})

export async function submitContactForm(formData: FormData) {
  try {
    // Extraer datos del formulario
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      company: (formData.get("company") as string) || "",
      message: formData.get("message") as string,
      website: (formData.get("website") as string) || "",
      captcha_answer: formData.get("captcha_answer") as string,
      captcha_expected: formData.get("captcha_expected") as string,
      form_start_time: formData.get("form_start_time") as string,
    }

    // Validar datos
    const validationResult = contactFormSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Por favor, corrige los errores en el formulario",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const data = validationResult.data

    // Verificar honeypot (si el campo website está lleno, es probablemente un bot)
    if (data.website) {
      // Simular éxito para no alertar al bot
      console.log("Honeypot detectado, posible bot")
      return {
        success: true,
        message: "Mensaje enviado correctamente",
      }
    }

    // Verificar captcha
    if (data.captcha_answer !== data.captcha_expected) {
      return {
        success: false,
        message: "La verificación humana ha fallado. Por favor, intenta de nuevo.",
      }
    }

    // Verificar tiempo mínimo de llenado del formulario (anti-bot)
    const formStartTime = data.form_start_time ? Number.parseInt(data.form_start_time) : 0
    const currentTime = Date.now()
    const formFillTime = currentTime - formStartTime

    if (formFillTime < 3000) {
      // Si el formulario se llenó en menos de 3 segundos, probablemente es un bot
      console.log("Formulario llenado demasiado rápido, posible bot")
      return {
        success: true, // Simular éxito para no alertar al bot
        message: "Mensaje enviado correctamente",
      }
    }

    // Preparar datos para guardar
    const contactData: ContactFormValues = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      company: data.company || "",
      message: data.message,
      status: "new",
      created_at: new Date().toISOString(),
    }

    // Guardar en la base de datos
    const messageId = await ContactService.saveContactMessage(contactData)

    return {
      success: true,
      messageId,
      message: "Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.",
    }
  } catch (error) {
    console.error("Error al procesar el formulario de contacto:", error)
    return {
      success: false,
      message: "Ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.",
    }
  }
}
