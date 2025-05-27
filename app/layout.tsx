import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";
import MonacoInitializer from "@/components/MonacoInitializer";

export const metadata: Metadata = {
  title: "C4A - Cybersecurity For All | Evaluación de Madurez en Ciberseguridad",
  description:
    "Evalúa el nivel de madurez en ciberseguridad de tu organización y obtén recomendaciones personalizadas.",
    generator: 'v0.dev'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* No debe haber ningún espacio, ni {" "}, ni texto literal aquí antes de <body> */}
      <body>
        <MonacoInitializer />
        <ClientLayout>
          <div className="flex flex-col min-h-screen">
            <LandingNavbar />
            <main className="flex-grow">
              {children}
            </main>
            <LandingFooter />
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
