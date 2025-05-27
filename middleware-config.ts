// Configuración para Content Security Policy
export const cspConfig = {
  // Fuentes permitidas para scripts
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://ssl.google-analytics.com",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://apis.google.com",
  ],

  // Fuentes permitidas para iframes
  frameSrc: [
    "'self'",
    "http://localhost:*",
    "https://*.vusercontent.net/",
    "https://*.lite.vusercontent.net/",
    "https://generated.vusercontent.net/",
    "https://vercel.live/",
    "https://vercel.com",
    "https://vercel.fides-cdn.ethyca.com/",
    "https://js.stripe.com/",
    "https://*.accounts.dev",
    "https://*.supabase.co", // Añadido para permitir iframes de Supabase
    "https://iaropbslnjhkvwmivuth.supabase.co", // URL específica de tu proyecto Supabase
  ],

  // Fuentes permitidas para conexiones
  connectSrc: [
    "'self'",
    "https://www.google-analytics.com",
    "https://ssl.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://*.supabase.co", // Añadido para permitir conexiones a Supabase
    "https://iaropbslnjhkvwmivuth.supabase.co", // URL específica de tu proyecto Supabase
  ],
}
