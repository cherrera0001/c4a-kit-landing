"use client";

import { useEffect, useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // useRouter de next/navigation para App Router
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Asumiendo que tienes un componente Input
import { Label } from "@/components/ui/label"; // Asumiendo que tienes un componente Label
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // AlertTitle añadido
import { supabase } from "@/lib/supabase/client"; // Asegúrate que esta ruta sea correcta

// Componente para el formulario de actualización de contraseña
const UpdatePasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) { // Considera tu política de contraseñas
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);
    if (updateError) {
      setError(`Error al actualizar la contraseña: ${updateError.message}`);
    } else {
      setMessage("Contraseña actualizada con éxito. Serás redirigido al inicio de sesión en unos segundos.");
      setTimeout(() => {
        router.push('/auth/login'); // Redirige a la página de login
      }, 3000);
    }
  };

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Establecer Nueva Contraseña</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu nueva contraseña a continuación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center text-sm">
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </CardFooter>
    </div>
  );
};

export default function ForgotPasswordConfirmationOrUpdatePage() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "tu correo"; // Para el mensaje de "correo enviado"
  
  const [pageMode, setPageMode] = useState<"loading" | "showConfirmation" | "showUpdateForm" | "error">("loading");
  const [isPreview, setIsPreview] = useState(false); // Se determinará en useEffect
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Determinar si es modo preview
    const currentHostname = window.location.hostname;
    if (currentHostname.includes("cloudworkstations.dev")) {
      setIsPreview(false); // Forzar a false para tu entorno de "datos duros"
    } else {
      setIsPreview(
        process.env.NODE_ENV === "development" ||
        currentHostname === "localhost" ||
        currentHostname.includes("vercel.app") || // Si usas deploys de preview de Vercel
        currentHostname.includes("preview")
      );
    }

    // Escuchar cambios de autenticación para detectar PASSWORD_RECOVERY
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        console.log("Evento PASSWORD_RECOVERY detectado. Mostrando formulario para actualizar contraseña.");
        setPageMode("showUpdateForm");
      } else if (pageMode === 'loading') { 
        // Si no es PASSWORD_RECOVERY y aún estamos cargando,
        // podría ser que el usuario llegó aquí sin un token válido
        // o después de solicitar el envío del correo.
        // Si hay un error en el hash (ej. token inválido), Supabase lo indica.
        const hash = window.location.hash;
        if (hash.includes("error_code=401") || hash.includes("error=unauthorized")) {
            setErrorMessage("El enlace de recuperación es inválido o ha expirado. Por favor, solicita uno nuevo.");
            setPageMode("error");
        } else if (!hash.startsWith("#access_token=")) { // Si no hay token, es probable que sea la página de confirmación de envío
            setPageMode("showConfirmation");
        }
        // Si hay un access_token pero el evento no es PASSWORD_RECOVERY inmediatamente,
        // Supabase podría estar procesándolo. El listener debería eventualmente capturarlo.
        // Si no, podría ser un token ya usado.
      }
    });
    
    // Comprobación inicial por si el evento ya ocurrió o hay error en el hash
    // Esto es importante porque onAuthStateChange podría no dispararse para el estado inicial
    // si la página carga y el hash ya está presente.
    const initialHash = window.location.hash;
    if (initialHash.startsWith("#access_token=")) {
        // Si hay un token, esperamos que onAuthStateChange lo maneje y ponga showUpdateForm.
        // Si después de un breve tiempo no cambia, podría ser un token inválido no detectado por el listener aún.
        // No se cambia pageMode aquí directamente para dar tiempo al listener.
    } else if (initialHash.includes("error_code=401") || initialHash.includes("error=unauthorized")) {
        setErrorMessage("El enlace de recuperación es inválido o ha expirado. Por favor, solicita uno nuevo.");
        setPageMode("error");
    } else {
        // Si no hay token ni error en el hash, es la página de confirmación de envío de correo.
        setPageMode("showConfirmation");
    }


    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pageMode]); // pageMode en dependencias para re-evaluar si es necesario

  if (pageMode === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Verificando...</p>
        {/* Aquí podrías poner un spinner/loader */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="w-full">
          {pageMode === "showUpdateForm" && <UpdatePasswordForm />}

          {pageMode === "showConfirmation" && (
            <>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-center">Correo Enviado</CardTitle>
                <CardDescription className="text-center">
                  Hemos enviado un enlace de recuperación a <strong>{emailFromQuery}</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2 text-sm text-muted-foreground">
                  <p>Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
                  <p>Si no recibes el correo en unos minutos, revisa tu carpeta de spam.</p>
                  {isPreview && (
                    <Alert className="mt-4 bg-blue-50 border-blue-200 text-left">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertTitle className="text-blue-800 font-semibold">Modo de Vista Previa Activo</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        <p>En este modo, la funcionalidad de envío de correos podría estar simulada.</p>
                        <p className="mt-1">Para probar el flujo de restablecimiento completo en este modo, usualmente se navega manualmente o se usa un enlace de prueba si el backend lo provee.</p>
                        {/* El enlace a /auth/reset-password que tenías antes podría ser relevante si esa es OTRA página diferente
                            pero si esta página AHORA maneja el reseteo, ese enlace directo ya no sería necesario desde aquí.
                        <p className="font-medium mt-1">
                           Puedes simular la llegada a la página de reseteo (si es diferente):
                           <Link href="/auth/reset-password" className="text-blue-600 hover:underline">
                             /auth/reset-password
                           </Link>
                         </p>
                        */}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Volver a inicio de sesión</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/forgot-password">Solicitar nuevo enlace</Link>
                </Button>
              </CardFooter>
            </>
          )}
          {pageMode === "error" && (
             <>
             <CardHeader>
               <div className="flex justify-center mb-4">
                 <AlertTriangle className="h-12 w-12 text-red-500" />
               </div>
               <CardTitle className="text-center">Error en la Recuperación</CardTitle>
             </CardHeader>
             <CardContent>
               <Alert variant="destructive" className="text-left">
                 <AlertTriangle className="h-4 w-4" />
                 <AlertTitle>No se puede proceder</AlertTitle>
                 <AlertDescription>
                   {errorMessage || "Ha ocurrido un error. El enlace podría ser inválido o haber expirado."}
                 </AlertDescription>
               </Alert>
               <p className="mt-4 text-sm text-center text-muted-foreground">
                Asegúrate de usar el enlace más reciente que te hemos enviado.
               </p>
             </CardContent>
             <CardFooter className="flex flex-col space-y-2">
               <Button asChild className="w-full">
                 <Link href="/auth/forgot-password">Solicitar nuevo enlace</Link>
               </Button>
               <Button asChild variant="outline" className="w-full">
                 <Link href="/auth/login">Volver a inicio de sesión</Link>
               </Button>
             </CardFooter>
           </>
          )}
        </Card>
      </div>
    </div>
  );
}
