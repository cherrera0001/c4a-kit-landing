/**
 * Tipos para formularios de la aplicación
 */

// Formulario de inicio de sesión
export interface LoginFormValues {
  email: string
  password: string
  rememberMe?: boolean
}

// Formulario de recuperación de contraseña
export interface ForgotPasswordFormValues {
  email: string
}

// Formulario de restablecimiento de contraseña
export interface ResetPasswordFormValues {
  password: string
  confirmPassword: string
}

// Formulario de creación/edición de usuario
export interface UserFormValues {
  email: string
  first_name: string
  last_name: string
  role_id: string
  active?: boolean
  password?: string
  confirmPassword?: string
}

// Formulario de creación/edición de empresa
export interface CompanyFormValues {
  name: string
  industry_id: string
  contact_name: string
  contact_email: string
  contact_phone: string
  size: string
  notes: string
}

// Formulario de creación/edición de evaluación
export interface EvaluationFormValues {
  name: string
  company_id: string
  notes: string
}

// Formulario de respuesta a pregunta de evaluación
export interface QuestionResponseFormValues {
  response_value: number
  comments: string
}

// Formulario de filtros para listados
export interface FilterFormValues {
  search?: string
  status?: string[]
  industry_id?: string[]
  date_from?: Date
  date_to?: Date
  sort_by?: string
  sort_order?: "asc" | "desc"
}

// Formulario de contacto
export interface ContactFormValues {
  first_name: string
  last_name: string
  email: string
  company?: string
  message: string
}
