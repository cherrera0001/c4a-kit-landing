import { getSupabaseClient } from "@/lib/supabase"; // Asumo que esta función te da el cliente Supabase adecuado
import type { Database } from "@/types/database";

// Tipos para las entidades principales
// ¡IMPORTANTE! Actualizado para apuntar a 'empresas'
export type Company = Database["public"]["Tables"]["empresas"]["Row"];
export type Sector = Database["public"]["Tables"]["sectors"]["Row"]; // Mantener si aún usas sectores
export type Domain = Database["public"]["Tables"]["domains"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type MaturityLevel = Database["public"]["Tables"]["maturity_levels"]["Row"];

// Extender el tipo Evaluation para incluir la estructura de la empresa relacionada
export type Evaluation = Database["public"]["Tables"]["evaluations"]["Row"] & {
  company?: Pick<Company, 'id' | 'nombre'> | null; // Para coincidir con tu uso de evaluation.company?.name
};
export type EvaluationResponse = Database["public"]["Tables"]["evaluation_responses"]["Row"];

/**
 * Servicio para interactuar con la base de datos
 */

// Función para obtener todas las empresas
export async function getCompanies(): Promise<{ success: boolean; data: Company[]; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    // Si 'empresas' tiene una columna 'sector_id' (FK a la tabla 'sectors')
    // y quieres cargar el nombre del sector relacionado, la sintaxis sería:
    // const selectQuery = `id, nombre, rubro, ..., updated_at, sector:sector_id(id, name)`;
    // Por ahora, solo seleccionamos las columnas directas de 'empresas'.
    const selectQuery = `
        id,
        nombre,
        rubro,
        dominios_correo_verificados,
        rango_empleados,
        rango_facturacion,
        created_at,
        updated_at
      `;

    const { data, error } = await supabase
      .from("empresas")
      .select(selectQuery)
      .order("nombre", { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: [], error: err };
  }
}

// Función para obtener una empresa por su ID
export async function getCompanyById(companyId: string): Promise<{ success: boolean; data: Company | null; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    // Ver nota en getCompanies sobre cómo seleccionar datos relacionados como el sector.
    const selectQuery = `
        id,
        nombre,
        rubro,
        dominios_correo_verificados,
        rango_empleados,
        rango_facturacion,
        created_at,
        updated_at
      `;

    const { data, error } = await supabase
      .from("empresas")
      .select(selectQuery)
      .eq("id", companyId)
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: null, error: err };
  }
}

// --- OTRAS FUNCIONES (getSectors, getDomains, etc. se mantienen igual que en tu archivo original si no se relacionan con 'empresas') ---
export async function getSectors(): Promise<{ success: boolean; data: Sector[]; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("sectors").select("*").order("name");
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Error al obtener sectores:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: [], error: err };
  }
}

export async function getDomains(): Promise<{ success: boolean; data: Domain[]; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("domains").select("*").eq("active", true).order("order_index");
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Error al obtener dominios:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: [], error: err };
  }
}

export async function getQuestions(): Promise<{ success: boolean; data: Question[]; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("questions")
      .select(`*, domain:domain_id(*), maturity_level:maturity_level_id(*)`)
      .eq("active", true).order("order_index");
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: [], error: err };
  }
}

export async function getQuestionsByDomain(domainId: number): Promise<{ success: boolean; data: Question[]; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("questions")
      .select(`*, domain:domain_id(*), maturity_level:maturity_level_id(*)`)
      .eq("domain_id", domainId).eq("active", true).order("order_index");
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Error al obtener preguntas por dominio:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: [], error: err };
  }
}
// --- FIN DE SECCIÓN SIN CAMBIOS ASUMIDOS ---

// Función para obtener todas las evaluaciones
export async function getEvaluations(): Promise<{ success: boolean; data: Evaluation[]; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("evaluations")
      .select(`
        *,
        company:company_id (
          id,
          nombre 
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Formatear para que la propiedad 'company' tenga 'name' en lugar de 'nombre' para el frontend
    const formattedData = data?.map(ev => {
      const companyData = ev.company as unknown as { id: string, nombre: string } | null; // Cast para acceder a 'nombre'
      return {
        ...ev,
        company: companyData ? { id: companyData.id, name: companyData.nombre } : null
      };
    }) || [];

    return { success: true, data: formattedData, error: null };
  } catch (error) {
    console.error("Error al obtener evaluaciones:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: [], error: err };
  }
}

// Función para obtener una evaluación por su ID
export async function getEvaluationById(evaluationId: string): Promise<{ success: boolean; data: Evaluation | null; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("evaluations")
      .select(`
        *,
        company:company_id (
          id,
          nombre
        )
      `)
      .eq("id", evaluationId)
      .single();

    if (error) throw error;

    let formattedData: Evaluation | null = null;
    if (data) {
      const companyData = data.company as unknown as { id: string, nombre: string } | null; // Cast para acceder a 'nombre'
      formattedData = {
        ...data,
        company: companyData ? { id: companyData.id, name: companyData.nombre } : null
      };
    }

    return { success: true, data: formattedData, error: null };
  } catch (error) {
    console.error("Error al obtener evaluación:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: null, error: err };
  }
}

// Función para crear una nueva evaluación
export async function createEvaluation(evaluationData: {
  name: string;
  description?: string;
  company_id: string; // Este ID vendrá de la tabla 'empresas'
  created_by: string;
}): Promise<{ success: boolean; data: Evaluation | null; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("evaluations")
      .insert({
        name: evaluationData.name,
        description: evaluationData.description || null,
        company_id: evaluationData.company_id,
        created_by: evaluationData.created_by,
        status: "not_started",
        progress: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al crear evaluación:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: null, error: err };
  }
}

// --- NO HAY CAMBIOS EN getEvaluationResponses, saveEvaluationResponse, updateEvaluationProgress ---
export async function getEvaluationResponses(evaluationId: string): Promise<{ success: boolean; data: EvaluationResponse[]; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("evaluation_responses").select(`*, question:question_id(*)`).eq("evaluation_id", evaluationId);
    if (error) throw error;
    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: [], error: err };
  }
}

export async function saveEvaluationResponse(responseData: {
  evaluation_id: string;
  question_id: number;
  response_value: number;
  comments?: string;
}): Promise<{ success: boolean; data: EvaluationResponse | null; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data: existingResponse } = await supabase
      .from("evaluation_responses").select("id")
      .eq("evaluation_id", responseData.evaluation_id).eq("question_id", responseData.question_id).maybeSingle();
    let result;
    if (existingResponse) {
      result = await supabase.from("evaluation_responses")
        .update({ response_value: responseData.response_value, comments: responseData.comments || null, updated_at: new Date().toISOString() })
        .eq("id", existingResponse.id).select().single();
    } else {
      result = await supabase.from("evaluation_responses")
        .insert({ evaluation_id: responseData.evaluation_id, question_id: responseData.question_id, response_value: responseData.response_value, comments: responseData.comments || null })
        .select().single();
    }
    if (result.error) throw result.error;
    await updateEvaluationProgress(responseData.evaluation_id);
    return { success: true, data: result.data, error: null };
  } catch (error) {
    console.error("Error al guardar respuesta:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, data: null, error: err };
  }
}

async function updateEvaluationProgress(evaluationId: string): Promise<{ success: boolean; error?: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data: questions, error: questionsError } = await supabase.from("questions").select("id", {count: 'exact'}).eq("active", true);
    if (questionsError) throw questionsError;
    const totalQuestions = questions?.length || 0; 

    const { count: answeredQuestions, error: responsesError } = await supabase
      .from("evaluation_responses")
      .select("id", { count: 'exact' }) 
      .eq("evaluation_id", evaluationId);

    if (responsesError) throw responsesError;

    const progress = totalQuestions > 0 ? Math.round(((answeredQuestions || 0) / totalQuestions) * 100) : 0;

    const { error: updateError } = await supabase
      .from("evaluations")
      .update({
        progress,
        status: progress === 0 ? "not_started" : progress === 100 ? "completed" : "in_progress",
        completed_at: progress === 100 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", evaluationId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar progreso:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, error: err };
  }
}
