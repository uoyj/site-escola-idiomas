import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { locales } from '@/i18n/request';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/app/theme/theme-provider';
import { PaletteProvider } from '@/app/theme/palette-provider';
import { Header } from '@/components/header';

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'Idioma & Cia - Escola de Idiomas',
  description: 'Aprenda idiomas com fluidez e confianca',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('[layout] FALHA AO CARREGAR MESSAGES para', locale, ':', error);
    notFound();
  }

  return (
    <html lang={locale} className={font.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <PaletteProvider>
            <NextIntlClientProvider messages={messages}>
              <Header />
              {children}
            </NextIntlClientProvider>
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
