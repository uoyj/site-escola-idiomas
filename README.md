# Idioma & Cia — Escola de Idiomas

Site institucional para a escola de idiomas **Idioma & Cia**, desenvolvido em [Next.js 16](https://nextjs.org) com [App Router](https://nextjs.org/docs/app), internacionalização em [next-intl 4](https://next-intl-docs.vercel.app/) e estilização com [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/).

## Stack

| Categoria | Tecnologia |
|---|---|
| Framework | Next.js 16.3.4 (App Router) |
| Runtime | React 19, TypeScript |
| Internacionalização | next-intl 4.14.2 (pt / en) |
| Estilos | Tailwind CSS 4, tw-animate-css |
| Componentes | shadcn/ui, Radix UI |
| Temas | next-themes (claro/escuro) + PaletteProvider (calm/neutral) |
| Fonte | Plus Jakarta Sans (next/font/google) |

## Paginas

| Rota | Locale | Descricao |
|---|---|---|
| `/` | pt, en | Home com titulo, subtitle e CTA |
| `/[locale]/aulas` | pt, en | Lista de cursos (fetch via `getCourses`) |
| `/[locale]/sobre` | pt, en | Conteudo sobre a escola (fetch via `getAbout`) |
| `/[locale]/contato` | pt, en | Formulario de contato via WhatsApp |

> A rota `/` redireciona para o locale default (`pt`) via middleware.

## Arquitetura

```
app/
  [locale]/          # Rotas com prefixo de locale
    aulas/           # Pagina de cursos
    contato/         # Pagina de contato (WhatsApp deep-link)
    sobre/           # Pagina sobre
    page.tsx         # Home
    layout.tsx       # Layout raiz (ThemeProvider, PaletteProvider, NextIntlClientProvider, Header)
  globals.css        # Tailwind + temas (calm/neutral, light/dark)
  theme/
    theme-provider.tsx     # next-themes wrapper
    palette-provider.tsx   # PaletteProvider + usePalette hook (persistencia no localStorage)
components/
  header.tsx         # Nav locale-aware + seletor de idioma + ThemeToggleButton
  theme-toggle-button.tsx
  ui/button.tsx      # shadcn/ui Button
content/
  index.ts           # Helpers: getCourses, getAbout, getTestimonials
  types.ts           # Interfaces TypeScript
  *.{pt,en}.json     # Dados de cursos, sobre e testemunhos
i18n/
  request.ts         # next-intl config + validacao de locales
messages/
  pt.json            # Mensagens de interface pt
  en.json            # Mensagens de interface en
proxy.ts             # Middleware de locale routing (next-intl)
```

### Content layer

Dados de cursos, sobre e testemunhos sao carregados via **dynamic imports** com caminhos relativos:

```ts
// content/index.ts
export async function getCourses(locale: 'pt' | 'en'): Promise<Course[]> {
  const data = await import(`./courses.${locale}.json`);
  return data.courses;
}
```

> Usar caminho relativo em vez de `@/` evita falhas de resolucao do alias em dev mode com o bundler do next-intl.

## Temas e paletas

### ThemeProvider (claro/escuro)

```tsx
// app/theme/theme-provider.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

- Atributo `class` no `<html>` (`.dark`)
- `enableSystem`: respeita preferencia do SO
- `defaultTheme="light"` como fallback

### PaletteProvider (calm / neutral)

```tsx
// app/theme/palette-provider.tsx
export function usePalette() {
  const context = useContext(PaletteContext);
  if (!context) throw new Error('usePalette must be used within a PaletteProvider');
  return context;
}
```

- Paletas definidas via `[data-palette="calm"]` e `[data-palette="neutral"]` em `globals.css`
- Persistencia no `localStorage` + atributo `data-palette` no `<html>`
- Default: `calm` (azul-petroleo + verde-salvia)

| Paleta | Light | Dark |
|---|---|---|
| **calm** (default) | hsl(200 20% 98%) bg, hsl(199 45% 35%) primary | hsl(200 25% 10%) bg, hsl(199 55% 55%) primary |
| **neutral** | hsl(30 15% 98%) bg, hsl(16 85% 55%) primary | hsl(30 10% 9%) bg, hsl(16 80% 60%) primary |

### ThemeToggleButton

Botao combinado para alternar tema (claro/escuro) e paleta (calm/neutral). Implementacao **hydration-safe**:

- Usa `mounted` state (padrao do next-themes) para evitar hydration mismatch
- Renderiza placeholder de mesmo tamanho antes do primeiro `useEffect` (zero layout shift)
- Comentarios documentam por que `suppressHydrationWarning` no `<div>` externo nao protege filhos

## Internacionalizacao

### Configuracao

```ts
// i18n/request.ts
export const locales = ['pt', 'en'] as const;
export const defaultLocale = 'pt';

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;
  if (!locales.includes(resolvedLocale as (typeof locales)[number])) {
    notFound();
  }
  messages = (await import(`../messages/${resolvedLocale}.json`)).default;
  return { locale: resolvedLocale as string, messages };
});
```

> **Nota:** usar `requestLocale` (nao `locale`) como recomendado pelo next-intl 4.

### Rotas e middleware

```ts
// proxy.ts
import createMiddleware from 'next-intl/middleware';
export default createMiddleware({ locales, defaultLocale });

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

- `/` redireciona automaticamente para `/pt`
- Rotas: `/pt/*`, `/en/*`

### Mensagens

Mensagens de interface em `messages/pt.json` e `messages/en.json`, organizadas por namespaces:

- `home` — titulo, subtitle, cta, about, courses, contact
- `about` — titulo e descricao
- `aulas` — titulo, subtitle, ctaButton, noCourses
- `AulasPage`, `SobrePage`, `ContatoPage` — metadados e conteudo das paginas

## Componentes

### Header

Navegacao locale-aware com `useLocale()` do next-intl. Links:

- `Sobre` → `/${locale}/sobre`
- `Aulas` → `/${locale}/aulas`
- `Contato` → `/${locale}/contato`

Inclui **seletor de idioma** (PT / EN) e `ThemeToggleButton`.

### Seletor de idioma

```tsx
const switchLocale = (nextLocale: string) => {
  if (nextLocale === locale) return;
  const path = window.location.pathname;
  const newPath = path.replace(`/${locale}`, `/${nextLocale}`);
  window.location.href = newPath;
};
```

- Troca prefixo do locale na URL mantendo o caminho
- Botao do locale ativo e `disabled`

### Button (shadcn/ui)

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';

const buttonVariants = cva("...", {
  variants: {
    variant: { default, outline, secondary, ghost, destructive, link },
    size: { default, xs, sm, lg, icon, "icon-xs", "icon-sm", "icon-lg" },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

- Usa `cva` para variants e `cn` para merge de classes
- Suporte a `asChild` via Radix `Slot`

## Comandos

```bash
# Desenvolvimento
npm run dev

# Build de producao
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Estrutura de dados

### Cursos (content/courses.{pt,en}.json)

```json
{
  "courses": [
    {
      "id": "ingles-conversacao",
      "title": "Inglês Conversação",
      "level": "Intermediário",
      "description": "Foco em fluência oral para o dia a dia."
    }
  ]
}
```

### Sobre (content/about.{pt,en}.json)

```json
{
  "title": "Sobre a Idioma & Cia",
  "paragraphs": ["...", "...", "..."]
}
```

### Testemunhos (content/testimonials.{pt,en}.json)

```json
{
  "testimonials": [
    {
      "id": "testimonial-1",
      "name": "Maria Silva",
      "text": "Estudar na escola transformou minha carreira.",
      "course": "Inglês Conversação"
    }
  ]
}
```

## Configuracao do projeto

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

- Alias `@/` configurado para imports absolutos
- Em dev mode, dynamic imports de JSON usam caminhos relativos (alias `@/` pode falhar)

### next.config.ts

```ts
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
export default withNextIntl({});
```

## Deploy

Build validado localmente:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/aulas
├ ƒ /[locale]/contato
└ ƒ /[locale]/sobre
```

Pronto para deploy em Vercel, Netlify ou servidor Node.
