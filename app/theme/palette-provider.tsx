'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';

type Palette = 'calm' | 'neutral';

interface PaletteContextValue {
  palette: Palette;
  setPalette: (palette: Palette) => void;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

function paletteReducer(state: Palette, action: Palette): Palette {
  return action;
}

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  // Estado inicial precisa ser IGUAL ao que o servidor renderiza (que nao
  // tem acesso a localStorage). Ler localStorage direto no useState()
  // causaria hydration mismatch caso o usuario tenha 'neutral' salvo.
  const [palette, dispatch] = useReducer(paletteReducer, 'calm');

  // So depois do mount no client sabemos o valor real salvo.
  useEffect(() => {
    const saved = localStorage.getItem('palette') as Palette | null;
    const resolved = saved === 'calm' || saved === 'neutral' ? saved : 'calm';
    dispatch(resolved);
    document.documentElement.setAttribute('data-palette', resolved);
  }, []);

  // Persiste toda vez que a paleta muda no client.
  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('palette', palette);
  }, [palette]);

  return (
    <PaletteContext.Provider value={{ palette, setPalette: dispatch }}>
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
