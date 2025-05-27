"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ROLE_IDS, ROLE_NAMES, getRoleUUID } from "@/lib/constants"

export default function ProfileDiagnostics() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadUserAndProfile() {
      try {
        setLoading(true)
        setError(null)

        // Obtener usuario actual
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!userData.user) {
          setError("No hay usuario autenticado")
          setLoading(false)
          return
        }

        setUser(userData.user)

        // Obtener perfil del usuario
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userData.user.id)
          .maybeSingle()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        setProfile(profileData)

        // Realizar diagnóstico
        const diagnosis = {
          userFound: !!userData.user,
          userId: userData.user.id,
          userEmail: userData.user.email,
          profileFound: !!profileData,
          profileRoleId: profileData?.role_id,
          expectedUserRoleUUID: getRoleUUID(2),
          expectedAdminRoleUUID: getRoleUUID(1),
          roleName: profileData ? ROLE_NAMES[profileData.role_id] || "Desconocido" : "N/A",
          isAdmin: profileData?.role_id === ROLE_IDS.ADMIN,
          isUser: profileData?.role_id === ROLE_IDS.USER,
        }

        setDiagnosisResult(diagnosis)
      } catch (err: any) {
        console.error("Error en diagnóstico:", err)
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    loadUserAndProfile()
  }, [supabase])

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Diagnóstico de Perfil</h2>

      {loading && <p className="text-gray-500">Cargando diagnóstico...</p>}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {diagnosisResult && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-bold text-lg mb-2">Usuario</h3>
            <p>
              <span className="font-semibold">Estado:</span>{" "}
              {diagnosisResult.userFound ? (
                <span className="text-green-600">Encontrado</span>
              ) : (
                <span className="text-red-600">No encontrado</span>
              )}
            </p>
            {diagnosisResult.userFound && (
              <>
                <p>
                  <span className="font-semibold">ID:</span> {diagnosisResult.userId}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {diagnosisResult.userEmail}
                </p>
              </>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-bold text-lg mb-2">Perfil</h3>
            <p>
              <span className="font-semibold">Estado:</span>{" "}
              {diagnosisResult.profileFound ? (
                <span className="text-green-600">Encontrado</span>
              ) : (
                <span className="text-red-600">No encontrado</span>
              )}
            </p>
            {diagnosisResult.profileFound && (
              <>
                <p>
                  <span className="font-semibold">Role ID:</span> {diagnosisResult.profileRoleId}
                </p>
                <p>
                  <span className="font-semibold">Rol:</span> {diagnosisResult.roleName}
                </p>
                <p>
                  <span className="font-semibold">¿Es Admin?</span>{" "}
                  {diagnosisResult.isAdmin ? (
                    <span className="text-green-600">Sí</span>
                  ) : (
                    <span className="text-gray-600">No</span>
                  )}
                </p>
                <p>
                  <span className="font-semibold">¿Es Usuario?</span>{" "}
                  {diagnosisResult.isUser ? (
                    <span className="text-green-600">Sí</span>
                  ) : (
                    <span className="text-gray-600">No</span>
                  )}
                </p>
              </>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-bold text-lg mb-2">Valores Esperados</h3>
            <p>
              <span className="font-semibold">UUID Rol Usuario:</span> {diagnosisResult.expectedUserRoleUUID}
            </p>
            <p>
              <span className="font-semibold">UUID Rol Admin:</span> {diagnosisResult.expectedAdminRoleUUID}
            </p>
          </div>

          {profile && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-bold text-lg mb-2">Datos Completos del Perfil</h3>
              <pre className="bg-gray-100 p-2 rounded overflow-auto text-xs">{JSON.stringify(profile, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
