'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * next-themes injeta um <script> inline para resolver o tema antes do
 * primeiro paint e evitar flash de tema. O React 19 emite um warning
 * "Encountered a script tag while rendering React component" por isso.
 *
 * É um falso positivo documentado:
 * https://github.com/pacocoursey/next-themes/issues/385
 *
 * Suprimimos SOMENTE essa mensagem — outros console.error continuam
 * visíveis para não mascarar bugs reais.
 */
const originalConsoleError = console.error;
if (typeof window !== 'undefined') {
  console.error = (...args: unknown[]) => {
    const message = args.join(' ');
    if (message.includes('Encountered a script tag while rendering React component')) {
      return; // next-themes inline script — falso positivo do React 19
    }
    originalConsoleError(...args);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
