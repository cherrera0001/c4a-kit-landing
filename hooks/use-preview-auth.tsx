"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const PreviewAuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: () => {},
})

export const PreviewAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simular carga inicial de sesión
  useEffect(() => {
    const storedUser = localStorage.getItem("preview_auth_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("preview_auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simular validación
    if (!email || !password) {
      throw new Error("El correo electrónico y la contraseña son requeridos")
    }

    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres")
    }

    // Simular autenticación
    let mockUser: User | null = null

    if (email === "admin@example.com" && password === "password") {
      mockUser = {
        id: "admin-123",
        email: "admin@example.com",
        role: "admin",
      }
    } else if (email.includes("@") && password.length >= 6) {
      mockUser = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        email,
        role: "user",
      }
    } else {
      throw new Error("Credenciales incorrectas")
    }

    // Guardar en localStorage para simular persistencia
    localStorage.setItem("preview_auth_user", JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const signOut = () => {
    localStorage.removeItem("preview_auth_user")
    setUser(null)
  }

  return (
    <PreviewAuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </PreviewAuthContext.Provider>
  )
}

export const usePreviewAuth = () => {
  const context = useContext(PreviewAuthContext)
  if (context === undefined) {
    throw new Error("usePreviewAuth debe ser usado dentro de un PreviewAuthProvider")
  }
  return context
}
