/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV === "development"

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://*.google.com https://*.googleapis.com https://*.gstatic.com https://js.stripe.com https://*.vercel-insights.com blob:;
  style-src 'self' 'unsafe-inline' https://*.googleapis.com https://fonts.gstatic.com;
  img-src 'self' data: blob: https: *.supabase.co;
  font-src 'self' https://*.gstatic.com data:;
  frame-src 'self' https://*.supabase.co https://*.google.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google.com https://*.googleapis.com https://*.vercel-insights.com https://*.sentry.io;
  media-src 'self' https://*.supabase.co;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://*.google.com;
  frame-ancestors 'self';
`
// Nota: Mantenemos 'unsafe-eval' para desarrollo, pero en producción debería ser más restrictivo

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Cambiado de ALLOW-FROM, SAMEORIGIN es más seguro y estándar.
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ]
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Considera resolver los errores de lint en lugar de ignorarlos
  },
  typescript: {
    ignoreBuildErrors: true, // Considera resolver los errores de tipo en lugar de ignorarlos
  },
  images: {
    // Configuración de imágenes (si es necesaria)
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'lh3.googleusercontent.com',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'iaropbslnjhkvwmivuth.supabase.co', // Tu ID de proyecto Supabase
    //   },
    // ],
  },
}

module.exports = nextConfig
