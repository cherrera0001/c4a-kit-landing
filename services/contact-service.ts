import { neon } from "@neondatabase/serverless"
import type { ContactFormValues } from "@/types/forms"

// Conexión a la base de datos Neon
const sql = neon(process.env.DATABASE_URL!)

/**
 * Servicio para manejar los mensajes de contacto
 */
export class ContactService {
  /**
   * Guarda un nuevo mensaje de contacto en la base de datos
   * @param contactData Datos del formulario de contacto
   * @returns El ID del mensaje creado
   */
  static async saveContactMessage(contactData: ContactFormValues): Promise<string> {
    try {
      // Validar datos de entrada
      if (!contactData.first_name || !contactData.last_name || !contactData.email || !contactData.message) {
        throw new Error("Todos los campos obligatorios deben estar completos")
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactData.email)) {
        throw new Error("El formato del email no es válido")
      }

      const { first_name, last_name, email, company, message } = contactData

      // Verificar si la tabla existe, si no, crearla
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS contact_messages (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            company VARCHAR(255),
            message TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `
      } catch (tableError) {
        console.error("Error al verificar/crear tabla contact_messages:", tableError)
        // Continuamos con la inserción de todos modos
      }

      const result = await sql`
        INSERT INTO contact_messages (
          first_name, 
          last_name, 
          email, 
          company, 
          message
        ) 
        VALUES (
          ${first_name}, 
          ${last_name}, 
          ${email}, 
          ${company || ""}, 
          ${message}
        )
        RETURNING id
      `

      if (!result || result.length === 0) {
        throw new Error("No se pudo guardar el mensaje de contacto")
      }

      return result[0].id
    } catch (error: any) {
      console.error("Error al guardar mensaje de contacto:", error)
      throw new Error(error.message || "No se pudo guardar el mensaje de contacto")
    }
  }

  /**
   * Obtiene todos los mensajes de contacto
   * @returns Lista de mensajes de contacto
   */
  static async getAllContactMessages() {
    try {
      const messages = await sql`
        SELECT * FROM contact_messages
        ORDER BY created_at DESC
      `

      return messages
    } catch (error: any) {
      console.error("Error al obtener mensajes de contacto:", error)

      // Si el error es porque la tabla no existe, devolvemos un array vacío
      if (error.message && error.message.includes("does not exist")) {
        return []
      }

      throw new Error("No se pudieron obtener los mensajes de contacto")
    }
  }

  /**
   * Obtiene un mensaje de contacto por su ID
   * @param id ID del mensaje
   * @returns El mensaje de contacto
   */
  static async getContactMessageById(id: string) {
    try {
      const message = await sql`
        SELECT * FROM contact_messages
        WHERE id = ${id}
      `

      if (!message || message.length === 0) {
        throw new Error("Mensaje no encontrado")
      }

      return message[0]
    } catch (error: any) {
      console.error("Error al obtener mensaje de contacto:", error)
      throw new Error("No se pudo obtener el mensaje de contacto")
    }
  }

  /**
   * Actualiza el estado de un mensaje de contacto
   * @param id ID del mensaje
   * @param status Nuevo estado
   */
  static async updateMessageStatus(id: string, status: string) {
    try {
      // Validar estado
      const validStatuses = ["pending", "in_progress", "completed", "rejected"]
      if (!validStatuses.includes(status)) {
        throw new Error("Estado no válido")
      }

      const result = await sql`
        UPDATE contact_messages
        SET status = ${status}, updated_at = now()
        WHERE id = ${id}
        RETURNING id
      `

      if (!result || result.length === 0) {
        throw new Error("Mensaje no encontrado")
      }

      return true
    } catch (error: any) {
      console.error("Error al actualizar estado del mensaje:", error)
      throw new Error(error.message || "No se pudo actualizar el estado del mensaje")
    }
  }

  /**
   * Elimina un mensaje de contacto
   * @param id ID del mensaje
   */
  static async deleteContactMessage(id: string) {
    try {
      const result = await sql`
        DELETE FROM contact_messages
        WHERE id = ${id}
        RETURNING id
      `

      if (!result || result.length === 0) {
        throw new Error("Mensaje no encontrado")
      }

      return true
    } catch (error: any) {
      console.error("Error al eliminar mensaje de contacto:", error)
      throw new Error("No se pudo eliminar el mensaje de contacto")
    }
  }
}
