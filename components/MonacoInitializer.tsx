// app/components/MonacoInitializer.tsx
'use client';

import { useEffect } from 'react';
import { setupMonacoEnvironment } from '@/lib/monaco-setup'; // Ajusta la ruta si es necesario

export default function MonacoInitializer() {
  useEffect(() => {
    setupMonacoEnvironment();
  }, []);

  return null; // Este componente no renderiza nada visible
}
