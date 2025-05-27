import { type NextRequest, NextResponse } from "next/server"
import { createEvaluation } from "@/services/evaluation-service"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    if (!body.name) {
      return NextResponse.json({ error: "El nombre de la evaluación es requerido" }, { status: 400 })
    }

    if (!body.company_id) {
      return NextResponse.json({ error: "La empresa es requerida" }, { status: 400 })
    }

    if (!body.created_by) {
      return NextResponse.json({ error: "El ID del usuario creador es requerido" }, { status: 400 })
    }

    if (!body.tipo_diagnostico_id) {
      return NextResponse.json({ error: "El tipo de diagnóstico es requerido" }, { status: 400 })
    }

    // Verificar que el usuario existe
    const supabase = createSupabaseServerClient()
    const { data: userExists, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", body.created_by)
      .single()

    if (userError || !userExists) {
      console.error("Error al verificar usuario:", userError)
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const result = await createEvaluation({
      name: body.name,
      description: body.description,
      company_id: body.company_id,
      created_by: body.created_by,
      tipo_diagnostico_id: body.tipo_diagnostico_id,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Error al crear la evaluación" }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error: any) {
    console.error("Error en API evaluations:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const companyId = url.searchParams.get("companyId")
    const status = url.searchParams.get("status")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    const supabase = createSupabaseServerClient()

    let query = supabase
      .from("evaluations")
      .select(`
        *,
        companies(id, name),
        tipos_diagnostico(id, nombre_kit),
        user_profiles(id, full_name)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros si existen
    if (userId) {
      query = query.eq("created_by", userId)
    }

    if (companyId) {
      query = query.eq("company_id", companyId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error al obtener evaluaciones:", error)
      return NextResponse.json({ error: "Error al obtener evaluaciones" }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    })
  } catch (error: any) {
    console.error("Error en API evaluations (GET):", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
