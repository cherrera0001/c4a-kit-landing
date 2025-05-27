export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          sector_id: number | null
          size: number | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          sector_id?: number | null
          size?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          sector_id?: number | null
          size?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sectors: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      domains: {
        Row: {
          id: number
          name: string
          description: string | null
          order_index: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          order_index?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          order_index?: number
          active?: boolean
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: number
          domain_id: number | null
          text: string
          description: string | null
          help_text: string | null
          maturity_level_id: number | null
          order_index: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          domain_id?: number | null
          text: string
          description?: string | null
          help_text?: string | null
          maturity_level_id?: number | null
          order_index?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          domain_id?: number | null
          text?: string
          description?: string | null
          help_text?: string | null
          maturity_level_id?: number | null
          order_index?: number
          active?: boolean
          created_at?: string
        }
      }
      maturity_levels: {
        Row: {
          id: number
          name: string
          description: string | null
          level: number
          color: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          level: number
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          level?: string
          color?: string | null
          created_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          name: string
          description: string | null
          company_id: string
          created_by: string
          status: string
          progress: number
          score: number | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          company_id: string
          created_by: string
          status?: string
          progress?: number
          score?: number | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          company_id?: string
          created_by?: string
          status?: string
          progress?: number
          score?: number | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      evaluation_responses: {
        Row: {
          id: string
          evaluation_id: string
          question_id: number
          response_value: number
          comments: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          evaluation_id: string
          question_id: number
          response_value: number
          comments?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          evaluation_id?: string
          question_id?: number
          response_value?: number
          comments?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type EvaluationResponse = Database["public"]["Tables"]["evaluation_responses"]["Row"]
export type Domain = Database["public"]["Tables"]["domains"]["Row"]
export type Question = Database["public"]["Tables"]["questions"]["Row"]

export type DomainResult = {
  domain_id: number
  domain_name: string
  score: number
  total_questions: number
  answered_questions: number
  maturity_level: string
}

export type EvaluationResult = {
  evaluation_id: string
  evaluation_name: string
  company_name: string
  overall_score: number
  progress: number
  domain_results: DomainResult[]
  created_at: string
  completed_at: string | null
}

export type User = {
  id: string
  email: string
}

export type Role = {
  id: string
  name: string
}

export type Permission = {
  id: string
  name: string
}

export type Company = {
  id: string
  name: string
}

export type Evaluation = {
  id: string
  name: string
}

export type MaturityLevel = {
  id: string
  name: string
}

export type Industry = {
  id: string
  name: string
}
