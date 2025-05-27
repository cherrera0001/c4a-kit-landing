// Configuración para la autenticación de Google
export const googleAuthConfig = {
  clientId: "155243449003-8aan53ilv328a0b5osgd19r5a7hd0evc.apps.googleusercontent.com",
  clientSecret: "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",
  // URLs de redirección autorizadas
  redirectUris: {
    supabase: "https://iaropbslnjhkvwmivuth.supabase.co/auth/v1/callback",
    nextAuth: {
      production: "https://www.c4a.cl/api/auth/callback/google",
      vercel: "https://v0-landingpage-c4a.vercel.app/api/auth/callback/google",
    },
  },
  // Orígenes JavaScript autorizados
  javascriptOrigins: ["https://iaropbslnjhkvwmivuth.supabase.co", "https://www.c4a.cl"],
}

// Función para determinar la URL de redirección correcta basada en el entorno
export function getRedirectUrl(useSupabase = true): string {
  // Si estamos usando Supabase para autenticación
  if (useSupabase) {
    return googleAuthConfig.redirectUris.supabase
  }

  // Si estamos usando NextAuth, determinar el entorno
  const isProduction =
    process.env.NODE_ENV === "production" && typeof window !== "undefined" && window.location.hostname === "www.c4a.cl"

  return isProduction
    ? googleAuthConfig.redirectUris.nextAuth.production
    : googleAuthConfig.redirectUris.nextAuth.vercel
}
