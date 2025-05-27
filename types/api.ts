/**
 * Tipos para las respuestas de la API
 */
import type {
  User,
  Role,
  Permission,
  Company,
  Evaluation,
  Domain,
  Question,
  MaturityLevel,
  Industry,
  EvaluationResult,
  DomainResult,
} from "./database"

// Respuesta base para todas las APIs
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Respuestas específicas para cada entidad
export type UsersResponse = ApiResponse<User[]>
export type UserResponse = ApiResponse<User>

export type RolesResponse = ApiResponse<Role[]>
export type RoleResponse = ApiResponse<Role>

export type PermissionsResponse = ApiResponse<Permission[]>
export type PermissionResponse = ApiResponse<Permission>

export type CompaniesResponse = ApiResponse<Company[]>
export type CompanyResponse = ApiResponse<Company>

export type EvaluationsResponse = ApiResponse<Evaluation[]>
export type EvaluationResponse = ApiResponse<Evaluation>

export type DomainsResponse = ApiResponse<Domain[]>
export type DomainResponse = ApiResponse<Domain>

export type QuestionsResponse = ApiResponse<Question[]>
export type QuestionResponse = ApiResponse<Question>

export type MaturityLevelsResponse = ApiResponse<MaturityLevel[]>
export type MaturityLevelResponse = ApiResponse<MaturityLevel>

export type IndustriesResponse = ApiResponse<Industry[]>
export type IndustryResponse = ApiResponse<Industry>

export type EvaluationResultsResponse = ApiResponse<EvaluationResult>
export type DomainResultsResponse = ApiResponse<DomainResult[]>

// Tipos para solicitudes de API
export interface CreateUserRequest {
  email: string
  first_name?: string
  last_name?: string
  role_id: string
  password?: string
}

export interface UpdateUserRequest {
  first_name?: string
  last_name?: string
  role_id?: string
  active?: boolean
}

export interface CreateCompanyRequest {
  name: string
  industry_id?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  size?: string
  notes?: string
}

export interface UpdateCompanyRequest {
  name?: string
  industry_id?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  size?: string
  notes?: string
}

export interface CreateEvaluationRequest {
  name: string
  company_id: string
  notes?: string
}

export interface UpdateEvaluationRequest {
  name?: string
  status?: "not_started" | "in_progress" | "completed"
  notes?: string
}

export interface SaveResponseRequest {
  question_id: string
  response_value: number
  comments?: string
}

export interface SaveResponsesRequest {
  evaluation_id: string
  responses: SaveResponseRequest[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface UpdatePasswordRequest {
  password: string
}

export interface AuthResponse
  extends ApiResponse<{
    user: User
    role: Role
    permissions: Permission[]
    token?: string
  }> {}
