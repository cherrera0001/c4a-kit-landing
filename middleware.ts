// src/middleware.ts o middleware.ts (en la raíz de tu proyecto)
import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

  let supabaseHostname = ""
  try {
    const supabaseUrlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrlEnv) {
      const supabaseUrl = new URL(supabaseUrlEnv)
      supabaseHostname = supabaseUrl.hostname // ej. iaropbslnjhkvwmivuth.supabase.co
    } else {
      console.warn("CSP Middleware: NEXT_PUBLIC_SUPABASE_URL no está definida.")
    }
  } catch (e) {
    console.error("CSP Middleware: Error parseando NEXT_PUBLIC_SUPABASE_URL:", e)
  }

  // Dominios para recursos externos
  const externalDomains = [
    "*.google.com",
    "*.gstatic.com", // Para Google Fonts
    "fonts.googleapis.com", // Para Google Fonts CSS
    "js.stripe.com",
    "*.stripe.com", // Para API calls y otros recursos de Stripe
    "*.instagram.com",
    // Añade otros dominios específicos que necesites
  ]
  const externalDomainString = externalDomains.join(" ")

  // Detectar si estamos en desarrollo
  const isDevelopment = process.env.NODE_ENV === "development"

  // --- Construcción de la Cabecera CSP ---
  const cspHeaderLines = [
    `default-src 'self'`,
    // Scripts:
    // 'self': Mismo origen.
    // nonce-${nonce}: Scripts inline con nonce.
    // 'strict-dynamic': Permite a scripts confiables cargar otros.
    // dominios externos: Para SDKs y scripts de terceros.
    // blob:: Para workers si Monaco los carga así y no se puede configurar de otra manera.
    // 'unsafe-eval': ¡ÚLTIMO RECURSO! Solo si Monaco lo requiere estrictamente y no hay alternativa.
    // Added the specific hash for the blocked inline script
    `script-src 'self' 'nonce-${nonce}' 'sha256-E8EPi3ovz+EfxEviTr9UjHKYh5PnfxNoZOnJbyuXKOo=' ${isDevelopment ? "'unsafe-eval'" : ""} 'strict-dynamic' ${externalDomainString} blob:`, // Added blob: and the specific hash
    // Estilos:
    `style-src 'self' 'unsafe-inline' fonts.googleapis.com ${externalDomainString}`, // 'unsafe-inline' is common but less secure.
    // Imágenes:
    `img-src 'self' blob: data: ${supabaseHostname} ${externalDomainString}`,
    // Fuentes:
    `font-src 'self' fonts.gstatic.com ${externalDomainString} data:`, // Added data: for potential data URLs in fonts
    // Conexiones (API, WebSockets):
    `connect-src 'self' ${supabaseHostname} wss://${supabaseHostname} ${externalDomainString} *.vscodeweb.net`, // *.vscodeweb.net for Monaco telemetry if applicable
    // Iframes:
    `frame-src 'self' ${supabaseHostname} js.stripe.com hooks.stripe.com *.instagram.com`,
    // Workers:
    `worker-src 'self' blob:`, // ALLOW WORKERS FROM SAME ORIGIN AND BLOBS
    // Others:
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self' ${supabaseHostname}`,
    `frame-ancestors 'none'`,
    `block-all-mixed-content`,
    `upgrade-insecure-requests`,
  ]
  const cspHeaderValue = cspHeaderLines.join("; ")

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set("Content-Security-Policy", cspHeaderValue)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
