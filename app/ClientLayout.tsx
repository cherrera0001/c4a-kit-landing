// app/ClientLayout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

// Si tienes setupMonacoEnvironment en MonacoInitializer, no lo necesitas aquí.
// import { useEffect } from 'react';
// import { setupMonacoEnvironment } from '@/lib/monaco-setup';

export default function ClientLayout({ children }: { children: ReactNode }) {
  // useEffect(() => {
  //   setupMonacoEnvironment(); // Solo si no usas MonacoInitializer en layout.tsx
  // }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark" // Puedes poner "dark", "light" o "system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
