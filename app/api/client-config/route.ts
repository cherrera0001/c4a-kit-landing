import { NextResponse } from "next/server"
import { serverEnv } from "@/lib/env"

export async function GET() {
  // Proporcionar solo los datos necesarios y seguros para el cliente
  return NextResponse.json({
    googleClientId: serverEnv.GOOGLE_CLIENT_ID,
    appUrl: serverEnv.NEXTAUTH_URL,
    environment: serverEnv.VERCEL_ENV || serverEnv.NODE_ENV,
  })
}
