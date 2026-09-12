'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Palette = 'calm' | 'neutral';

interface PaletteContextValue {
  palette: Palette;
  setPalette: (palette: Palette) => void;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

function getStoredPalette(): Palette {
  if (typeof window === 'undefined') return 'calm';
  const saved = localStorage.getItem('palette') as Palette | null;
  return saved === 'calm' || saved === 'neutral' ? saved : 'calm';
}

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<Palette>(getStoredPalette);

  // Persiste paleta no localStorage e no DOM (sincroniza para fora do React)
  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('palette', palette);
  }, [palette]);

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
