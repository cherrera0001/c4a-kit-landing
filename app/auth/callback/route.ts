// app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_IDS, COOKIE_OPTIONS } from "@/lib/constants"; // Usar ROLE_IDS y COOKIE_OPTIONS

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  console.log(`[AUTH_CALLBACK] Recibida solicitud en: ${requestUrl.pathname}${requestUrl.search}`);

  if (errorParam) {
    const errorMessage = decodeURIComponent(errorDescription || errorParam);
    console.error(`[AUTH_CALLBACK] Error en callback de OAuth provider: ${errorMessage}`);
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(`OAuth Error: ${errorMessage}`)}`);
  }

  if (!code) {
    console.error("[AUTH_CALLBACK] No se encontró el código 'code' en la URL de callback.");
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent("Código de autorización no encontrado.")}`);
  }

  console.log(`[AUTH_CALLBACK] Código de autorización encontrado: ${code}. Intentando intercambiar por sesión.`);

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore }, {
    // Pasar opciones de cookie aquí si es necesario, aunque auth-helpers debería usar las por defecto
    // cookieOptions: COOKIE_OPTIONS, // auth-helpers-nextjs v0.7+ puede no necesitar esto explícitamente aquí
  });

  let finalRedirectPath = "/dashboard"; // Ruta por defecto después del login exitoso
  let profileCreationErrorOccurred = false;
  let profileCreationErrorMessage = "";

  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error(`[AUTH_CALLBACK] Error al intercambiar código por sesión: ${exchangeError.message}`);
      // Podrías querer redirigir con un error más específico aquí
      throw new Error(`Error de Supabase: ${exchangeError.message}`);
    }
    console.log("[AUTH_CALLBACK] Intercambio de código por sesión exitoso.");

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error(`[AUTH_CALLBACK] Error al obtener sesión post-intercambio: ${sessionError.message}`);
      throw new Error(`Error al obtener sesión: ${sessionError.message}`);
    }
    if (!session) {
      console.error("[AUTH_CALLBACK] No se pudo crear la sesión después del intercambio de código.");
      throw new Error("No se pudo establecer la sesión de usuario.");
    }

    console.log(`[AUTH_CALLBACK] Sesión establecida para usuario ID: ${session.user.id}`);
    const userId = session.user.id;
    const userEmail = session.user.email;

    // Verificar si el perfil existe. El trigger debería haberlo creado.
    // Esta verificación es más para logging y para un posible fallback (aunque el trigger es lo ideal).
    const { data: userProfile, error: profileFetchError } = await supabase
      .from("user_profiles")
      .select("id, role_id") // Solo selecciona lo necesario
      .eq("id", userId)
      .maybeSingle();

    if (profileFetchError && profileFetchError.code !== 'PGRST116') { // PGRST116: No rows found, lo cual es esperado si el perfil no existe aún
      console.error(`[AUTH_CALLBACK] Error al consultar perfil para ${userId}: ${profileFetchError.message}`);
      // No lanzar error aquí, el trigger debería manejarlo. Si el trigger falla, es un problema separado.
    }

    if (!userProfile) {
      console.warn(`[AUTH_CALLBACK] Perfil no encontrado para ${userId} (email: ${userEmail}) después del login OAuth. El trigger debería haberlo creado.`);
      // Aquí podrías tener una lógica de reintento o marcar al usuario para revisión,
      // pero idealmente el trigger SQL es el responsable.
      // Por ahora, asumimos que el trigger funcionará o ya funcionó.
      // Si el dashboard falla por esto, el problema está en el trigger o en cómo DashboardClientPage maneja un perfil faltante.
      profileCreationErrorOccurred = true;
      profileCreationErrorMessage = "El perfil de usuario no se encontró o no se pudo crear automáticamente. Contacte a soporte.";
    } else {
      console.log(`[AUTH_CALLBACK] Perfil existente encontrado para ${userId} con role_id: ${userProfile.role_id}.`);
      // Determinar redirección basada en rol si es necesario
      if (userProfile.role_id === ROLE_IDS.ADMIN) {
        finalRedirectPath = "/admin/dashboard";
      }
    }

    // Determinar la URL de redirección final (si venía en el estado de OAuth, por ejemplo)
    // const nextUrlParam = requestUrl.searchParams.get("next"); // Si usas 'next' en el estado de OAuth
    // if (nextUrlParam) finalRedirectPath = nextUrlParam;


  } catch (error: any) {
    console.error(`[AUTH_CALLBACK] Error general en el handler: ${error.message}`);
    const encodedError = encodeURIComponent(error.message || "Error_inesperado_durante_autenticación_OAuth");
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodedError}`);
  }
  
  // Construir URL de redirección final
  const redirectUrlObj = new URL(finalRedirectPath, requestUrl.origin);
  if (profileCreationErrorOccurred) {
      redirectUrlObj.searchParams.set("profile_error", encodeURIComponent(profileCreationErrorMessage));
  }
  // Puedes añadir un parámetro ?welcome=true si es un nuevo registro
  // const isNewUser = sessionUser?.created_at && (Date.now() - new Date(sessionUser.created_at).getTime() < 5 * 60 * 1000);
  // if (isNewUser) redirectUrlObj.searchParams.set("welcome", "true");

  console.log(`[AUTH_CALLBACK] Autenticación completada. Redirigiendo a: ${redirectUrlObj.toString()}`);
  return NextResponse.redirect(redirectUrlObj.toString());
}
