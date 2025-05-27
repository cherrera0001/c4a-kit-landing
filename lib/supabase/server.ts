// lib/supabase/server.ts
// PARA USAR EN SERVER COMPONENTS, API ROUTES, generateMetadata, etc.
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Solo para Server Components y Route Handlers que leen cookies

// Para funciones de servidor que no pueden acceder a `cookies()` (ej. algunas funciones de build o helpers genéricos)
// o si necesitas un cliente con service_role para operaciones administrativas.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Para operaciones de admin (USAR CON PRECAUCIÓN Y SOLO EN EL SERVIDOR)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;


// Cliente para Server Components que necesita leer/escribir cookies de sesión
export function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL or Anon Key is missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.'
    );
  }
  const cookieStore = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  });
}

// Cliente de servidor genérico (sin acceso a cookies de request, usa anon key)
// Útil para prerendering de páginas que no dependen del usuario, o para builds.
export function createGenericSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL or Anon Key is missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.'
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Cliente de servidor con Service Role (USAR CON EXTREMA PRECAUCIÓN)
// Solo para tareas administrativas muy específicas desde el backend seguro.
export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Supabase URL or Service Role Key is missing for admin client.'
    );
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // autoRefreshToken: false, // Deshabilitar si no es necesario para un servicio
      // persistSession: false, // No persistir sesión para un cliente de servicio
    }
  });
}
