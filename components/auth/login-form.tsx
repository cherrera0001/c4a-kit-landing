// components/auth/login-form.tsx
"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Info, EyeIcon, EyeOffIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { isPreviewEnvironment } from "@/app/api/config";
import { ERROR_MESSAGES, ROLE_IDS } from "@/lib/constants";
import GoogleAuthButton from "./google-auth-button";
import { cn } from "@/lib/utils"; // <--- IMPORTACIÓN AÑADIDA Y CORREGIDA

// Tipos de errores específicos para mejor manejo
type ErrorType = "auth" | "validation" | "network" | "unknown" | null;

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/dashboard";
  const successParam = searchParams?.get("success");
  const errorParam = searchParams?.get("error");

  const supabase = createClientComponentClient();

  useEffect(() => {
    setIsPreview(isPreviewEnvironment());

    if (successParam) {
      if (successParam === "password_reset") {
        setSuccessMessage(
          "Tu contraseña ha sido restablecida correctamente. Por favor, inicia sesión con tu nueva contraseña."
        );
      } else if (successParam === "email_confirmed") {
        setSuccessMessage("Tu correo electrónico ha sido confirmado. Ahora puedes iniciar sesión.");
      }
    }

    if (errorParam) {
      const decodedError = decodeURIComponent(errorParam);
      const knownError = ERROR_MESSAGES[decodedError.toUpperCase() as keyof typeof ERROR_MESSAGES];
      setError(knownError || decodedError);
      setErrorType("auth");
    }
  }, [successParam, errorParam]);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!email) {
      errors.email = "El correo electrónico es obligatorio.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Por favor, introduce un correo electrónico válido.";
      isValid = false;
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria.";
      isValid = false;
    } else if (password.length < 6 && !isPreview) { // En preview podríamos ser más flexibles
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }, [email, password, isPreview]);

  const handleEmailPasswordLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);
    setSuccessMessage(null);
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setLoginAttempts((prev) => prev + 1);

    try {
      // Configurar opciones de persistencia de sesión para Supabase
      const supabaseClient = createClientComponentClient({
         options: {
           auth: {
             persistSession: rememberMe,
             autoRefreshToken: rememberMe,
           },
         },
       });

      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setErrorType("auth");
        if (authError.message.includes("Invalid login credentials")) {
          setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        } else if (authError.message.includes("Email not confirmed")) {
          setError(ERROR_MESSAGES.EMAIL_NOT_CONFIRMED);
        } else if (authError.message.includes("Too many requests")) {
          setError(ERROR_MESSAGES.TOO_MANY_REQUESTS);
        } else {
          setError(authError.message || ERROR_MESSAGES.UNKNOWN_ERROR);
        }
        if (loginAttempts >= 2) {
            console.warn(`Múltiples intentos fallidos de login para: ${email}. Intento #${loginAttempts + 1}`);
        }
        return;
      }

      if (!data || !data.session) {
        setErrorType("unknown");
        setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
        return;
      }
      
      setSuccessMessage("Inicio de sesión exitoso. Redirigiendo...");
      
      setTimeout(() => {
        router.push(redirectTo);
        router.refresh(); 
      }, 500);

    } catch (err: any) {
      console.error("Error inesperado al iniciar sesión:", err);
      if (err.message?.includes("network") || err.message?.includes("fetch")) {
        setErrorType("network");
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        setErrorType("unknown");
        setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, rememberMe, supabase, router, redirectTo, loginAttempts, validateForm]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder al sistema.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPreview && (
          <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
            <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              <p className="font-medium">Modo de Vista Previa Activado</p>
              <ul className="list-disc pl-5 mt-1 text-xs">
                <li>Admin: admin@example.com / password</li>
                <li>Usuario: usuario@example.com / password</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700">
            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">{successMessage}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant={errorType === "network" ? "default" : "destructive"} className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error de Inicio de Sesión</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <GoogleAuthButton mode="signin" />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O inicia sesión con tu correo
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="flex justify-between text-sm">
              <span>Correo electrónico</span>
              {formErrors.email && <span className="text-xs text-red-500">{formErrors.email}</span>}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              disabled={loading}
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? "email-error" : undefined}
              className={cn(formErrors.email && "border-red-500 focus-visible:ring-red-500")}
            />
            {/* Mensaje de error inline para accesibilidad, aunque ya se muestra arriba */}
            {formErrors.email && <p id="email-error" className="sr-only">{formErrors.email}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="flex justify-between text-sm">
              <span>Contraseña</span>
              {formErrors.password && <span className="text-xs text-red-500">{formErrors.password}</span>}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={loading}
                aria-invalid={!!formErrors.password}
                aria-describedby={formErrors.password ? "password-error" : undefined}
                className={cn(formErrors.password && "border-red-500 focus-visible:ring-red-500")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
             {/* Mensaje de error inline para accesibilidad */}
            {formErrors.password && <p id="password-error" className="sr-only">{formErrors.password}</p>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
              />
              <Label htmlFor="remember-me" className="text-sm font-normal text-muted-foreground">
                Recordarme
              </Label>
            </div>
             <Button variant="link" asChild className="h-auto p-0 text-sm">
                <Link href="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 pt-6">
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Button variant="link" asChild className="h-auto p-0">
            <Link href="/auth/register">Regístrate aquí</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
