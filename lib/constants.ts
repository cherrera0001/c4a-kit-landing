// lib/constants.ts

// UUIDs exactos de tu base de datos para los roles
export const ROLE_IDS = {
  ADMIN: "21dafa54-4167-4b8f-8373-12b6cf86fabc",
  USER: "5077d75d-c434-44a4-90b0-b7622c8532cd",
  ADVISOR: "45239a2c-3500-43d4-be80-5cf7ea7a4973",
};

// Mapeo de nombres de roles a UUIDs para fácil acceso
export const ROLE_NAME_TO_UUID: Record<string, string | undefined> = {
  admin: ROLE_IDS.ADMIN,
  user: ROLE_IDS.USER,
  advisor: ROLE_IDS.ADVISOR,
};

// Mapeo de UUIDs a nombres de roles (útil para UI o logs)
export const UUID_TO_ROLE_NAME: Record<string, string | undefined> = {
  [ROLE_IDS.ADMIN]: "admin",
  [ROLE_IDS.USER]: "user",
  [ROLE_IDS.ADVISOR]: "advisor",
};

/**
 * Obtiene el UUID de un rol por su nombre.
 * @param roleName Nombre del rol ('admin', 'user', 'advisor').
 * @returns El UUID del rol o undefined si el nombre del rol no es válido.
 */
export function getRoleUUID(roleName: keyof typeof ROLE_NAME_TO_UUID): string | undefined {
  return ROLE_NAME_TO_UUID[roleName];
}

/**
 * Obtiene el nombre de un rol por su UUID.
 * @param uuid El UUID del rol.
 * @returns El nombre del rol o undefined si el UUID no corresponde a un rol conocido.
 */
export function getRoleNameFromUUID(uuid: string): string | undefined {
  return UUID_TO_ROLE_NAME[uuid];
}

/**
 * Convierte un ID numérico de rol (si se usa internamente como legacy o para simplificar en algunos contextos)
 * al UUID correspondiente. Se recomienda usar getRoleUUID(roleName) para mayor claridad y evitar errores.
 * @param roleIdNumber Número del rol (1 para admin, 2 para user, 3 para advisor).
 * @returns El UUID del rol. Devuelve el UUID de USER por defecto si el número no está mapeado.
 */
export function roleIdToUUID(roleIdNumber: number): string {
  switch (roleIdNumber) {
    case 1: return ROLE_IDS.ADMIN;
    case 2: return ROLE_IDS.USER;
    case 3: return ROLE_IDS.ADVISOR;
    default:
      console.warn(`roleIdNumber ${roleIdNumber} no mapeado, usando USER por defecto.`);
      return ROLE_IDS.USER;
  }
}

// Opciones para cookies de Supabase (consistentes con la configuración del middleware)
export const COOKIE_OPTIONS = {
  name: "sb-session", // Nombre común para la cookie de sesión de Supabase
  lifetime: 60 * 60 * 24 * 7, // 7 días en segundos
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined, // Para subdominios si es necesario
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production", // Solo sobre HTTPS en producción
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  SESSION_EXPIRED: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
  PROFILE_NOT_FOUND: "No se pudo encontrar tu perfil. Por favor, contacta a soporte.",
  PROFILE_CREATION_FAILED: "No se pudo crear tu perfil. Por favor, intenta nuevamente.",
  INVALID_ROLE: "Rol de usuario inválido. Por favor, contacta a soporte.",
  INVALID_CREDENTIALS: "Credenciales inválidas. Por favor, verifica tu correo y contraseña.",
  EMAIL_NOT_CONFIRMED: "Tu correo electrónico no ha sido confirmado. Por favor, revisa tu bandeja de entrada.",
  TOO_MANY_REQUESTS: "Demasiados intentos fallidos. Por favor, intenta de nuevo más tarde.",
  NETWORK_ERROR: "Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.",
  UNKNOWN_ERROR: "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.",
  GOOGLE_AUTH_FAILED: "Error durante la autenticación con Google. Por favor, intenta de nuevo.",
  OAUTH_CODE_MISSING: "Código de autorización de OAuth no encontrado.",
  SESSION_EXCHANGE_ERROR: "Error al intercambiar el código de autorización por una sesión.",
  SESSION_FETCH_ERROR: "Error al obtener la sesión del usuario.",
  PROFILE_FETCH_ERROR: "Error al obtener el perfil del usuario.",
  PROFILE_MISSING_TRIGGER_FAILED: "El perfil de usuario no se encontró y el trigger automático parece haber fallado. Contacte a soporte.",
};
