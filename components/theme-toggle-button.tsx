'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { usePalette } from '@/app/theme/palette-provider';
import { cn } from 'cn';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { Sun, Moon, Leaf, Palette } from 'lucide-react';

/**
 * Botao combinado: troca de tema (claro/escuro) e paleta (calm/neutral).
 *
 * next-themes com enableSystem resolve `resolvedTheme` apenas no client
 * (post-mount), porque o server nao tem acesso a localStorage nem a
 * prefers-color-scheme do usuario. Usar resolvedTheme diretamente causa
 * hydration mismatch: server renderiza 'light' (resolvedTheme === undefined),
 * client re-renderiza 'dark' se o OS estiver no modo escuro.
 *
 * Solucao: manter sempre a MESMA arvore de elementos no server e no
 * client. `isDark`/`isNeutral` ficam false ate mounted === true, de
 * propósito — o cliente concorda deliberadamente com o server no
 * primeiro paint. suppressHydrationWarning é usado apenas nos
 * elementos cujo className muda por depender do tema/paleta.
 *
 * Os ícones Lucide sao renderizados dentro do thumb,
 * centralizados com absolute inset-0 m-auto, cross-fade por opacidade.
 */
export function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { palette, setPalette } = usePalette();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Antes do mount, tratamos como 'claro'/'calm' de propósito — mesmo
  // estado que o servidor renderizou. So depois que o efeito acima roda
  // é que passamos a refletir o valor real (resolvedTheme/palette).
  const isDark = mounted && resolvedTheme === 'dark';
  const isNeutral = mounted && palette === 'neutral';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
  const togglePalette = () => setPalette(palette === 'calm' ? 'neutral' : 'calm');

  return (
    <div className="flex items-center gap-2">
      {/* Toggle de tema claro/escuro */}
      <SwitchPrimitive.Root
        aria-label="Alternar tema claro/escuro"
        checked={isDark}
        onCheckedChange={toggleTheme}
        className={cn(
          'relative inline-flex h-8 w-14 items-center rounded-full border border-border',
          'transition-colors duration-300',
          isDark ? 'bg-primary' : 'bg-muted',
        )}
      >
        <span className="sr-only">Alternar tema</span>
        <SwitchPrimitive.Thumb
          suppressHydrationWarning
          className={cn(
            'absolute top-0.5 left-1 h-6 w-6 rounded-full shadow transform transition-transform duration-300',
            isDark ? 'translate-x-6 bg-primary-foreground' : 'translate-x-0 bg-white',
          )}
        >
          <Sun
            suppressHydrationWarning
            size={14}
            className={cn(
              'absolute inset-0 m-auto text-yellow-400 transition-opacity duration-300',
              isDark ? 'opacity-0' : 'opacity-100',
            )}
          />
          <Moon
            suppressHydrationWarning
            size={14}
            className={cn(
              'absolute inset-0 m-auto text-blue-400 transition-opacity duration-300',
              isDark ? 'opacity-100' : 'opacity-0',
            )}
          />
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>

      {/* Toggle de paleta calm/neutral */}
      <SwitchPrimitive.Root
        aria-label="Alternar paleta de cores"
        checked={isNeutral}
        onCheckedChange={togglePalette}
        className="relative inline-flex h-8 w-14 items-center rounded-full border border-border bg-muted transition-colors duration-300"
      >
        <span className="sr-only">Alternar paleta</span>
        <SwitchPrimitive.Thumb
          suppressHydrationWarning
          className={cn(
            'absolute top-0.5 left-1 h-6 w-6 rounded-full shadow transform transition-transform duration-300',
            'bg-primary',
            isNeutral ? 'translate-x-6' : 'translate-x-0',
          )}
        >
          <Leaf
            suppressHydrationWarning
            size={14}
            className={cn(
              'absolute inset-0 m-auto text-green-500 transition-opacity duration-300',
              isNeutral ? 'opacity-0' : 'opacity-100',
            )}
          />
          <Palette
            suppressHydrationWarning
            size={14}
            className={cn(
              'absolute inset-0 m-auto text-purple-500 transition-opacity duration-300',
              isNeutral ? 'opacity-100' : 'opacity-0',
            )}
          />
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    </div>
  );
}
