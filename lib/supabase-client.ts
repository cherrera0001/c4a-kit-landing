import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { COOKIE_OPTIONS } from "@/lib/constants"

// Singleton para el cliente de Supabase en el lado del cliente
let supabaseClient: any = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient({
      options: {
        cookies: {
          ...COOKIE_OPTIONS,
        },
      },
    })
  }
  return supabaseClient
}
