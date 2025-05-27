/**
 * Email validator utility for corporate email validation
 * Provides functions to validate emails and manage blocked domains
 */

// Set to store blocked domains
const blockedDomains = new Set<string>([
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "aol.com",
  "icloud.com",
  "protonmail.com",
])

/**
 * Valida si una cadena es un email válido
 * @param email Email a validar
 * @returns true si el email es válido, false en caso contrario
 */
export function validateEmail(email: string): boolean {
  // Expresión regular para validar emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates if an email is a corporate email (not from blocked domains)
 */
export function validateCorporateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) {
    return { isValid: false, message: "El correo electrónico es requerido" }
  }

  if (!validateEmail(email)) {
    return { isValid: false, message: "Por favor, introduce un correo electrónico válido" }
  }

  const domain = email.split("@")[1].toLowerCase()

  if (blockedDomains.has(domain)) {
    return {
      isValid: false,
      message: "Por favor, utiliza un correo electrónico corporativo en lugar de un correo personal",
    }
  }

  return { isValid: true }
}

/**
 * Adds a domain to the blocked domains list
 */
export function addBlockedDomain(domain: string): void {
  blockedDomains.add(domain.toLowerCase())
}

/**
 * Removes a domain from the blocked domains list
 */
export function removeBlockedDomain(domain: string): void {
  blockedDomains.delete(domain.toLowerCase())
}

/**
 * Gets the list of all blocked domains
 */
export function getBlockedDomains(): string[] {
  return Array.from(blockedDomains)
}

/**
 * Checks if a domain is blocked
 */
export function isDomainBlocked(domain: string): boolean {
  return blockedDomains.has(domain.toLowerCase())
}
