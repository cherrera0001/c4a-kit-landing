import { getSupabaseClient } from "@/lib/supabase"
import { validateCorporateEmail } from "@/lib/email-validator"

/**
 * Servicio para gestionar usuarios
 */
export async function createUser({
  email,
  password,
  fullName,
  roleName,
}: {
  email: string
  password: string
  fullName: string
  roleName: "admin" | "user"
}) {
  const supabase = getSupabaseClient()

  // Validar que el correo sea corporativo
  const emailValidation = validateCorporateEmail(email)
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.message)
  }

  // NUEVA VALIDACIÓN: Verificar si el usuario actual es administrador
  // Solo los administradores pueden crear otros administradores
  if (roleName === "admin") {
    const { data: session } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error("No tienes permiso para crear usuarios administradores")
    }

    // Verificar si el usuario actual es administrador
    const { data: currentUserRole, error: roleCheckError } = await supabase
      .from("user_profiles")
      .select("roles(name)")
      .eq("id", session.user.id)
      .single()

    if (roleCheckError) {
      console.error("Error al verificar rol del usuario:", roleCheckError)
      throw new Error("No se pudo verificar tu nivel de acceso")
    }

    // Si el usuario actual no es administrador, no permitir crear administradores
    if (!currentUserRole?.roles?.name || currentUserRole.roles.name !== "admin") {
      throw new Error("Solo los administradores pueden crear usuarios con rol de administrador")
    }

    console.log("Usuario administrador creando otro administrador - Acción registrada")
  }

  // 1. Crear el usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: roleName, // Guardamos el rol en los metadatos para referencia
      },
    },
  })

  if (authError) throw authError

  if (!authData.user) {
    throw new Error("No se pudo crear el usuario")
  }

  // 2. Obtener el ID del rol
  const { data: roleData, error: roleError } = await supabase.from("roles").select("id").eq("name", roleName).single()

  if (roleError) throw roleError

  // 3. Actualizar el perfil del usuario
  // Esperamos un momento para asegurarnos de que Supabase haya creado el perfil
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const { error: profileError } = await supabase
    .from("user_profiles")
    .update({
      full_name: fullName,
      role_id: roleData.id,
    })
    .eq("id", authData.user.id)

  if (profileError) {
    // Si hay un error al actualizar, intentamos insertar
    const { error: insertError } = await supabase.from("user_profiles").insert({
      id: authData.user.id,
      full_name: fullName,
      role_id: roleData.id,
    })

    if (insertError) throw insertError
  }

  // Registrar la creación de usuario con su rol asignado
  console.log(`Usuario creado: ${email} con rol: ${roleName}`)

  // Si se creó un administrador, registrar esto como una acción importante
  if (roleName === "admin") {
    // Aquí podrías implementar un registro de auditoría más formal
    console.warn(`¡ATENCIÓN! Se ha creado un usuario administrador: ${email}`)
  }

  return authData.user
}
