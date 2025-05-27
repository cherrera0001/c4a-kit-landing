"use client"

import { getDomains } from "@/services/database-service"
import { QuestionForm } from "@/components/admin/question-form"
import { getSupabaseClient } from "@/lib/supabase"

async function getMaturityLevels() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("maturity_levels").select("*").order("level")

  if (error) throw error
  return data
}

export default async function QuestionsPage() {
  const domainsResult = await getDomains()
  const domains = domainsResult.success ? domainsResult.data : []

  const maturityLevels = await getMaturityLevels()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Preguntas</h1>

      <div className="grid grid-cols-1 gap-8">
        <QuestionForm
          domains={domains}
          maturityLevels={maturityLevels}
          onSubmit={async (data) => {
            "use server"
            // Esta función se ejecutará en el servidor
            const supabase = getSupabaseClient()

            if (data.id) {
              // Actualizar pregunta existente
              await supabase
                .from("questions")
                .update({
                  text: data.text,
                  description: data.description,
                  help_text: data.help_text,
                  domain_id: data.domain_id,
                  maturity_level_id: data.maturity_level_id,
                  order_index: data.order_index,
                  active: data.active,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", data.id)
            } else {
              // Crear nueva pregunta
              await supabase.from("questions").insert({
                text: data.text,
                description: data.description,
                help_text: data.help_text,
                domain_id: data.domain_id,
                maturity_level_id: data.maturity_level_id,
                order_index: data.order_index,
                active: data.active,
              })
            }
          }}
        />
      </div>
    </div>
  )
}
