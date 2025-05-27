import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { isPreviewEnvironment } from "@/app/api/config"
import { clientEnv } from "@/lib/env"
import { logSessionEvent } from "@/services/session-log-service"

/**
 * Servicio para gestionar la autenticación
 */
export async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
  // Validaciones básicas
  if (!email || !password) {
    throw new Error("El correo electrónico y la contraseña son requeridos")
  }

  // Si estamos en modo de vista previa, simulamos la autenticación
  if (isPreviewEnvironment()) {
    console.log("Modo vista previa: Simulando autenticación para", email)

    // Simulamos un retraso
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (email === "admin@example.com" && password === "password") {
      const userData = {
        user: {
          id: "admin-123",
          email,
          user_metadata: { full_name: "Administrador Demo" },
          last_sign_in_at: new Date().toISOString(),
        },
        session: {
          role: "admin",
          expires_at: Date.now() + 3600 * 1000, // 1 hora
          access_token: "preview-token-admin",
        },
      }

      // Guardar en localStorage para persistencia en modo vista previa
      if (typeof window !== "undefined") {
        localStorage.setItem("preview_auth_user", JSON.stringify(userData))
      }

      return userData
    } else if (email === "usuario@example.com" && password === "password") {
      const userData = {
        user: {
          id: "user-456",
          email,
          user_metadata: { full_name: "Usuario Demo" },
          last_sign_in_at: new Date().toISOString(),
        },
        session: {
          role: "user",
          expires_at: Date.now() + 3600 * 1000, // 1 hora
          access_token: "preview-token-user",
        },
      }

      // Guardar en localStorage para persistencia en modo vista previa
      if (typeof window !== "undefined") {
        localStorage.setItem("preview_auth_user", JSON.stringify(userData))
      }

      return userData
    } else if (email.includes("@") && password.length >= 6) {
      const userData = {
        user: {
          id: "user-" + Math.random().toString(36).substring(2, 9),
          email,
          user_metadata: { full_name: "Usuario Demo" },
          last_sign_in_at: new Date().toISOString(),
        },
        session: {
          role: "user",
          expires_at: Date.now() + 3600 * 1000, // 1 hora
          access_token: "preview-token-generic",
        },
      }

      // Guardar en localStorage para persistencia en modo vista previa
      if (typeof window !== "undefined") {
        localStorage.setItem("preview_auth_user", JSON.stringify(userData))
      }

      return userData
    } else {
      throw new Error("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.")
    }
  }

  // Autenticación real con Supabase
  try {
    const supabase = createClientComponentClient()

    // Intentar iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error de autenticación Supabase:", error)
      // Traducir mensajes de error comunes de Supabase a mensajes más amigables
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.")
      }

      if (error.message.includes("Email not confirmed")) {
        throw new Error("Tu correo electrónico no ha sido confirmado. Por favor, revisa tu bandeja de entrada.")
      }

      throw error
    }

    // Registrar el evento de inicio de sesión exitoso
    if (data?.user?.id) {
      try {
        await logSessionEvent({
          user_id: data.user.id,
          event_type: "login",
          event_reason: "Inicio de sesión exitoso",
        })
      } catch (logError) {
        console.error("Error al registrar inicio de sesión:", logError)
        // No interrumpimos el flujo por un error de registro
      }
    }

    return data
  } catch (error: any) {
    console.error("Error en auth-service:", error)
    throw error
  }
}

/**
 * Cierra la sesión del usuario actual
 */
export async function logoutUser() {
  // En modo vista previa, simplemente eliminamos el usuario del localStorage
  if (isPreviewEnvironment() && typeof window !== "undefined") {
    localStorage.removeItem("preview_auth_user")
    return { error: null }
  }

  const supabase = createClientComponentClient()

  // Obtener el usuario actual antes de cerrar sesión
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  // Registrar el evento de cierre de sesión
  if (userId) {
    try {
      await logSessionEvent({
        user_id: userId,
        event_type: "logout",
        event_reason: "Cierre de sesión manual",
      })
    } catch (error) {
      console.error("Error al registrar cierre de sesión:", error)
    }
  }

  // Cerrar sesión
  return await supabase.auth.signOut()
}

/**
 * Solicita un restablecimiento de contraseña
 */
export async function requestPasswordReset(email: string) {
  const supabase = createClientComponentClient()

  if (!email) {
    throw new Error("El correo electrónico es requerido")
  }

  // Si estamos en modo de vista previa, simulamos la solicitud
  if (isPreviewEnvironment()) {
    console.log("Modo vista previa: Simulando solicitud de restablecimiento para", email)
    await new Promise((resolve) => setTimeout(resolve, 800))
    return true
  }

  // Obtener la URL base de la aplicación para redirecciones
  const appUrl = clientEnv.APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/reset-password`,
  })

  if (error) throw error

  return true
}

/**
 * Registra un nuevo usuario
 */
export async function registerUser({
  email,
  password,
  fullName,
  companyName,
}: {
  email: string
  password: string
  fullName: string
  companyName?: string
}) {
  // Validaciones básicas
  if (!email || !password) {
    throw new Error("El correo electrónico y la contraseña son requeridos")
  }

  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres")
  }

  // Si estamos en modo de vista previa, simulamos el registro
  if (isPreviewEnvironment()) {
    console.log("Modo vista previa: Simulando registro para", email)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // En modo vista previa, simulamos un registro exitoso sin enviar correo
    return {
      user: {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: {
          full_name: fullName,
          company_name: companyName || "Empresa Demo",
        },
      },
      session: null, // En un registro real, no hay sesión hasta confirmar el correo
    }
  }

  // Obtener la URL base de la aplicación para redirecciones
  const appUrl = clientEnv.APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

  // Registro real con Supabase
  try {
    const supabase = createClientComponentClient()

    // Intentar registrar al usuario
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName || "",
        },
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    })

    if (error) {
      console.error("Error de registro Supabase:", error)

      // Manejar errores específicos
      if (error.message.includes("email") && error.message.includes("already")) {
        throw new Error("Este correo electrónico ya está registrado. Por favor, utiliza otro o recupera tu contraseña.")
      }

      // Si hay un error relacionado con el envío de correo, manejarlo de forma especial
      if (error.message.includes("email") && error.message.includes("send")) {
        console.warn("Problema con el envío de correo, pero el usuario se creó correctamente")

        // Si el usuario se creó pero hubo problemas con el correo, intentamos crear el perfil de todos modos
        if (data?.user) {
          try {
            await supabase.from("user_profiles").insert({
              id: data.user.id,
              full_name: fullName,
              company_name: companyName || "",
              email: email,
              role_id: 2, // Rol de usuario por defecto
            })
          } catch (profileError) {
            console.error("Error al crear perfil de usuario:", profileError)
          }

          // Devolvemos el usuario con una nota sobre el correo
          return {
            user: data.user,
            session: null,
            note: "Usuario creado correctamente, pero hubo problemas al enviar el correo de confirmación. Por favor, contacta a soporte.",
          }
        }
      }

      throw error
    }

    // Si no hay usuario en la respuesta, algo salió mal
    if (!data.user) {
      throw new Error("Error al crear el usuario. Por favor, intenta de nuevo más tarde.")
    }

    // Crear perfil de usuario
    try {
      await supabase.from("user_profiles").insert({
        id: data.user.id,
        full_name: fullName,
        company_name: companyName || "",
        email: email,
        role_id: 2, // Rol de usuario por defecto
      })

      // Registrar el evento de registro
      await logSessionEvent({
        user_id: data.user.id,
        event_type: "register",
        event_reason: "Registro de nuevo usuario",
      })
    } catch (profileError) {
      console.error("Error al crear perfil de usuario:", profileError)
      // No lanzamos error aquí para no interrumpir el flujo de registro
    }

    return data
  } catch (error: any) {
    console.error("Error en auth-service:", error)

    // Si el error está relacionado con el envío de correo, proporcionar un mensaje más amigable
    if (
      error.message &&
      (error.message.includes("sending confirmation email") ||
        error.message.includes("send email") ||
        error.message.includes("correo"))
    ) {
      throw new Error(
        "Se creó tu cuenta, pero hubo un problema al enviar el correo de confirmación. Por favor, contacta a soporte.",
      )
    }

    throw error
  }
}

/**
 * Obtiene información del usuario actual y su rol
 */
export async function getCurrentUser() {
  // Si estamos en modo de vista previa, verificamos si hay un usuario simulado en localStorage
  if (isPreviewEnvironment()) {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("preview_auth_user") : null
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        return null
      }
    }
    return null
  }

  const supabase = createClientComponentClient()

  try {
    // Obtener sesión real de Supabase
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      return null
    }

    // Obtener información adicional del perfil
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*, roles(*)")
      .eq("id", data.session.user.id)
      .single()

    if (profileError) {
      console.error("Error al obtener perfil de usuario:", profileError)
      // Si no podemos obtener el perfil, al menos devolvemos la información básica del usuario
      return {
        user: data.session.user,
        profile: null,
        role: "user", // Rol por defecto
      }
    }

    return {
      user: data.session.user,
      profile,
      role: profile?.roles?.name || "user",
    }
  } catch (error) {
    console.error("Error al obtener usuario actual:", error)
    return null
  }
}

/**
 * Actualiza la sesión del usuario
 */
export async function refreshSession() {
  if (isPreviewEnvironment()) {
    // En modo vista previa, simplemente devolvemos el usuario almacenado
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("preview_auth_user") : null
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)

        // Verificar si la sesión ha expirado
        if (userData.session && userData.session.expires_at < Date.now()) {
          // Actualizar la fecha de expiración
          userData.session.expires_at = Date.now() + 3600 * 1000 // 1 hora más
          localStorage.setItem("preview_auth_user", JSON.stringify(userData))
        }

        return userData
      } catch (error) {
        console.error("Error parsing stored user:", error)
        return null
      }
    }
    return null
  }

  const supabase = createClientComponentClient()

  try {
    // Obtener el usuario actual antes de refrescar
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession()
    const userId = currentSession?.user?.id

    const { data, error } = await supabase.auth.refreshSession()

    if (error) throw error

    // Registrar el evento de actualización de sesión
    if (userId) {
      try {
        await logSessionEvent({
          user_id: userId,
          event_type: "token_refresh",
          event_reason: "Actualización manual de token",
        })
      } catch (logError) {
        console.error("Error al registrar actualización de sesión:", logError)
      }
    }

    return data
  } catch (error) {
    console.error("Error al refrescar la sesión:", error)
    throw error
  }
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export async function hasRole(role: string): Promise<boolean> {
  try {
    const userData = await getCurrentUser()
    if (!userData) return false

    return userData.role === role
  } catch (error) {
    console.error("Error al verificar rol:", error)
    return false
  }
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const userData = await getCurrentUser()
    return !!userData
  } catch (error) {
    console.error("Error al verificar autenticación:", error)
    return false
  }
}
