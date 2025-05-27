    // lib/supabase/client.ts (o .js)

    import { createBrowserClient } from '@supabase/ssr'; // O 'createClient' de '@supabase/supabase-js' si no usas SSR helpers

    // Asegúrate de que estas variables de entorno estén disponibles en el cliente
    // (prefijadas con NEXT_PUBLIC_ en Next.js)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error("Supabase URL is not defined. Set NEXT_PUBLIC_SUPABASE_URL environment variable.");
    }
    if (!supabaseAnonKey) {
      throw new Error("Supabase anonymous key is not defined. Set NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
    }

    // Exporta el cliente Supabase para usarlo en tu aplicación
    // Si usas los SSR helpers de Supabase (recomendado con Next.js App Router):
    export const supabase = createBrowserClient(
        supabaseUrl!, // El signo de exclamación es si estás seguro que no son null después del check
        supabaseAnonKey!
    );

    /*
    // Si NO usas los SSR helpers (instalación más básica de @supabase/supabase-js):
    import { createClient } from '@supabase/supabase-js';

    export const supabase = createClient(
        supabaseUrl!,
        supabaseAnonKey!
    );
    */
    