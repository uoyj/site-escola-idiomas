'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Palette = 'calm' | 'neutral';

interface PaletteContextValue {
  palette: Palette;
  setPalette: (palette: Palette) => void;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  // Estado inicial precisa ser IGUAL ao que o servidor renderiza (que nao
  // tem acesso a localStorage). Ler localStorage direto no useState()
  // causaria hydration mismatch caso o usuario tenha 'neutral' salvo.
  const [palette, setPalette] = useState<Palette>('calm');
  const [mounted, setMounted] = useState(false);

  // So depois do mount no client sabemos o valor real salvo.
  useEffect(() => {
    const saved = localStorage.getItem('palette') as Palette | null;
    const resolved = saved === 'calm' || saved === 'neutral' ? saved : 'calm';
    setPalette(resolved);
    document.documentElement.setAttribute('data-palette', resolved);
    setMounted(true);
  }, []);

  // Persiste apenas apos o mount, quando o usuario troca de paleta.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('palette', palette);
  }, [palette, mounted]);

  return (
    <PaletteContext.Provider value={{ palette, setPalette }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return context;
}
