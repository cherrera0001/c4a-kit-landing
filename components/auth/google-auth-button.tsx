// components/auth/google-auth-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
// Ya no necesitamos getRedirectUrl de google-auth-config para esta parte.
// import { getRedirectUrl } from "@/lib/google-auth-config";
import { ERROR_MESSAGES } from "@/lib/constants";

interface GoogleAuthButtonProps {
  mode: "signin" | "signup";
  className?: string;
}

export default function GoogleAuthButton({ mode, className = "" }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClientComponentClient();

      // La URL a la que Supabase redirigirá DESPUÉS de procesar el callback de Google.
      // Esta DEBE ser la ruta de callback en TU aplicación Next.js.
      const appCallbackUrl = `${window.location.origin}/auth/callback`;

      console.log("🔧 Iniciando autenticación con Google. Redirigiendo a Supabase, que luego llamará a:", appCallbackUrl);

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: appCallbackUrl, // URL de tu app donde se maneja el código
          queryParams: {
            access_type: "offline",
            prompt: "consent", // Puedes quitar 'consent' después de la primera vez para mejor UX
          },
          // skipBrowserRedirect: false, // Dejar que Supabase maneje la redirección inicial a Google
        },
      });

      if (signInError) {
        console.error("❌ Error de Supabase al iniciar OAuth con Google:", signInError);
        setError(signInError.message || ERROR_MESSAGES.GOOGLE_AUTH_FAILED);
        setLoading(false); // Detener carga si hay error antes de redirigir
        return;
      }

      // Si signInWithOAuth tiene una URL (para skipBrowserRedirect: true), redirigir.
      // Con skipBrowserRedirect: false (por defecto), Supabase maneja la redirección a Google.
      if (data?.url) {
        console.log("✅ Redirigiendo a la URL de Google proporcionada por Supabase:", data.url);
        window.location.href = data.url;
      } else {
        // Esto no debería ocurrir si skipBrowserRedirect es false y no hay error.
        console.warn("⚠️ Supabase no devolvió una URL de redirección y no hubo error. El flujo podría estar incompleto.");
        setError("No se pudo iniciar el proceso de autenticación con Google.");
        setLoading(false);
      }

    } catch (err: any) {
      console.error("❌ Error inesperado al autenticar con Google:", err);
      setError(err.message || ERROR_MESSAGES.GOOGLE_AUTH_FAILED);
      setLoading(false);
    }
    // No establecer setLoading(false) aquí si la redirección es exitosa,
    // ya que la página cambiará. Se maneja en los bloques de error.
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300">
          <p className="font-semibold">Error de Autenticación:</p>
          <p>{error}</p>
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        className={`w-full flex items-center justify-center gap-2 ${className}`}
        onClick={handleGoogleAuth}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
        )}
        {mode === "signin" ? "Iniciar sesión con Google" : "Registrarse con Google"}
      </Button>
    </div>
  );
}
