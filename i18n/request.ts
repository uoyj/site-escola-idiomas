import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['pt', 'en'] as const;
export const defaultLocale = 'pt';

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;

  // Validate locale
  if (!locales.includes(resolvedLocale as (typeof locales)[number])) {
    console.error('[i18n/request.ts] Locale invalido:', resolvedLocale);
    notFound();
  }

  let messages;
  try {
    // Caminho relativo: import dinamico com alias @/ pode falhar na
    // resolucao de contexto do bundler em dev mode
    messages = (await import(`../messages/${resolvedLocale}.json`)).default;
  } catch (error) {
    console.error('[i18n/request.ts] FALHA AO CARREGAR MESSAGES para', resolvedLocale, ':', error);
    notFound();
  }

  return { locale: resolvedLocale as string, messages };
});
