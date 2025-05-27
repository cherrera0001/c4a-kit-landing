"use client"

import { Button } from "@/components/ui/button"

interface GoogleAuthSimpleProps {
  mode: "signin" | "signup"
}

export default function GoogleAuthSimple({ mode }: GoogleAuthSimpleProps) {
  const handleGoogleAuth = async () => {
    try {
      // Use window.location to redirect to the API endpoint
      window.location.href = `/api/auth/${mode === "signin" ? "login" : "signup"}?provider=google`
    } catch (error) {
      console.error("Google auth error:", error)
    }
  }

  return (
    <Button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-2" variant="outline">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 9a3 3 0 1 1 6 0c0 1.657-1.343 3-3 3S9 10.657 9 9z" />
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
      </svg>
      {mode === "signin" ? "Iniciar sesión" : "Registrarse"} con Google
    </Button>
  )
}
