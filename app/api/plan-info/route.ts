import { NextResponse } from "next/server";

// --- Interfaces para el tipado fuerte de tus planes ---
interface PlanFeature {
  text: string;
  available?: boolean; // Opcional: para marcar si una característica está o no incluida
}

interface Plan {
  id: string;
  name: string;
  price: number; // Usar number para el precio facilita cálculos futuros
  priceCurrency?: string; // ej. "CLP", "USD"
  priceDescription?: string; // ej. "/ mes", "pago único"
  features: (string | PlanFeature)[]; // Permite strings simples o objetos más detallados
  isRecommended?: boolean; // Usar 'isRecommended' es más semántico que 'recommended'
  ctaText?: string; // Texto para el botón de llamada a la acción
  stripePriceId?: string; // MUY ÚTIL si vas a integrar con Stripe para suscripciones
}

// --- Definición de los planes disponibles (con tipado) ---
// Si estos datos vinieran de una base de datos, esta función haría la consulta.
async function fetchPlansData(): Promise<Plan[]> {
  // Por ahora, devolvemos datos estáticos.
  // En el futuro, podrías reemplazar esto con una llamada a Supabase.
  // ej: const supabase = createGenericSupabaseServerClient();
  //     const { data, error } = await supabase.from('plans_table').select('*');
  //     if (error) throw error;
  //     return data as Plan[];

  const plansData: Plan[] = [
    {
      id: "free",
      name: "Plan Gratuito / Evaluación",
      price: 0,
      priceCurrency: "CLP",
      priceDescription: "único pago",
      features: [
        "Evaluación básica de madurez",
        "Reporte resumido",
        "Acceso a recursos educativos generales",
      ],
      isRecommended: false,
      ctaText: "Comenzar Evaluación",
      // stripePriceId: "price_xxxxxxxxxxxxxx" // Ejemplo si tuvieras un producto en Stripe
    },
    {
      id: "standard",
      name: "Plan Estándar",
      price: 9900, // Usar el valor en la menor unidad (centavos) si el precio es para Stripe, o el valor directo.
      priceCurrency: "CLP",
      priceDescription: "mensual",
      features: [
        "Evaluación completa de madurez (6 categorías)",
        "Reporte detallado con puntajes",
        "Recomendaciones personalizadas priorizadas",
        "Acceso a recursos premium y plantillas",
        "Soporte por email (respuesta en 48h)",
      ],
      isRecommended: true,
      ctaText: "Suscribirse al Estándar",
      // stripePriceId: "price_yyyyyyyyyyyyyy"
    },
    {
      id: "premium",
      name: "Plan Premium / Corporativo",
      price: 29900,
      priceCurrency: "CLP",
      priceDescription: "mensual",
      features: [
        "Todo lo del Plan Estándar",
        "Evaluación avanzada con benchmarks de industria",
        "Reporte ejecutivo para C-Level y Directorio",
        "Plan de acción detallado con seguimiento",
        "Consultoría inicial (2 horas)",
        "Soporte prioritario 24/7 (teléfono y email)",
        "Acceso anticipado a nuevas funcionalidades",
      ],
      isRecommended: false,
      ctaText: "Contactar para Premium",
      // stripePriceId: "price_zzzzzzzzzzzzzz"
    },
  ];
  return plansData;
}

export async function GET(request: Request) {
  try {
    // Simular un pequeño retraso SOLO en desarrollo para probar UI de carga
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const plans = await fetchPlansData();

    // Es buena práctica devolver un objeto con una clave para los datos,
    // en lugar de solo el array. Esto da flexibilidad para añadir metadatos en el futuro.
    // Tu frontend deberá ajustarse para acceder a `data.plans` en lugar de solo `data`.
    // Si prefieres devolver el array directamente, usa: return NextResponse.json(plans, { status: 200 });
    return NextResponse.json({ plans: plans }, { status: 200 });

  } catch (error: any) { // Especificar 'any' o un tipo de error más específico
    console.error("[API_PLAN_INFO_ERROR] Error al obtener información de planes:", error.message, error.stack);
    return NextResponse.json(
      {
        error: "No se pudo obtener la información de los planes en este momento.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined, // Solo mostrar detalles en desarrollo
      },
      { status: 500 }
    );
  }
}

// Opcional: Si los planes raramente cambian, puedes exportar esta constante
// para indicar a Next.js que puede generar esta ruta estáticamente en tiempo de build
// y revalidarla periódicamente. Pero si la función fetchPlansData() se vuelve dinámica (ej. DB),
// querrás reconsiderar esto o usar 'force-dynamic'.
// export const revalidate = 3600; // Revalida la data cada hora (3600 segundos)
