'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { usePalette } from '@/app/theme/palette-provider';
import { cn } from 'cn';

/**
 * Botao combinado: troca de tema (claro/escuro) e paleta (calm/neutral).
 *
 * next-themes com enableSystem resolvemos resolvedTheme apenas no client
 * (post-mount), porque o server nao tem acesso a localStorage nem a
 * prefers-color-scheme do usuario. Usar resolvedTheme diretamente causa
 * hydration mismatch: server renderiza 'light' (resolvedTheme === undefined),
 * client re-renderiza 'dark' se o OS estiver no modo escuro.
 *
 * Solucao: useSyncExternal para detectar mount no client sem setState
 * em effect. Antes do mount, isMounted === false e isDark === false
 * (server render). Apos mount, useSyncExternal retorna true e re-render
 * correto.
 *
 * NOTA: suppressHydrationWarning no <div> externo NAO protege os filhos e
 * esconde mismatches reais — foi removido de proposito.
 */
export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const { palette, setPalette } = usePalette();

  const isMounted = useSyncExternalStore(
    () => () => false,
    () => false,
    () => true,
  );
  const isDark = isMounted && resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const togglePalette = () => {
    setPalette(palette === 'calm' ? 'neutral' : 'calm');
  };

  // Placeholder: mesmo tamanho/layout dos botoes reais, sem logica de tema
  if (!isMounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-14 rounded-full border border-border bg-muted" />
        <div className="h-8 w-14 rounded-full border border-border bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Botao de tema claro/escuro */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Alternar tema claro/escuro"
        className={cn(
          'relative inline-flex h-8 w-14 items-center rounded-full border border-border',
          'transition-colors duration-300',
          isDark ? 'bg-primary' : 'bg-muted',
        )}
      >
        <span className="sr-only">Alternar tema</span>
        <span
          className={cn(
            'inline-block h-6 w-6 rounded-full shadow transform transition-transform duration-300',
            isDark
              ? 'translate-x-3 bg-primary-foreground'
              : 'translate-x-1 bg-white',
          )}
        />
        <span
          className={cn(
            'absolute left-1.5 text-yellow-400 transition-opacity duration-300',
            isDark ? 'opacity-0' : 'opacity-100',
          )}
        >
          ☀️
        </span>
        <span
          className={cn(
            'absolute right-1.5 text-blue-400 transition-opacity duration-300',
            isDark ? 'opacity-100' : 'opacity-0',
          )}
        >
          🌙
        </span>
      </button>

      {/* Botao de paleta calm/neutral */}
      <button
        type="button"
        onClick={togglePalette}
        aria-label="Alternar paleta de cores"
        className="relative inline-flex h-8 w-14 items-center rounded-full border border-border bg-muted transition-colors duration-300"
      >
        <span className="sr-only">Alternar paleta</span>
        <span
          className={cn(
            'inline-block h-6 w-6 rounded-full shadow transform transition-transform duration-300',
            palette === 'neutral'
              ? 'translate-x-3'
              : 'translate-x-1',
            'bg-primary',
          )}
        />
        <span
          className={cn(
            'absolute left-1.5 transition-opacity duration-300 text-xs',
            palette === 'neutral' ? 'opacity-0' : 'opacity-100',
          )}
        >
          🧘
        </span>
        <span
          className={cn(
            'absolute right-1.5 transition-opacity duration-300 text-xs',
            palette === 'neutral' ? 'opacity-100' : 'opacity-0',
          )}
        >
          🎨
        </span>
      </button>
    </div>
  );
}
