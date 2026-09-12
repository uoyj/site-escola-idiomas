import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { locales } from '@/i18n/request';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/app/theme/theme-provider';
import { PaletteProvider } from '@/app/theme/palette-provider';
import { Header } from '@/components/header';
import type { Metadata } from 'next';

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = 'Idioma & Cia - Escola de Idiomas';
  const description = 'Aprenda idiomas com fluidez e confianca';
  const localizedTitle =
    locale === 'en' ? 'Language & Co - Language School' : title;
  const localizedDescription =
    locale === 'en'
      ? 'Learn languages fluently and confidently'
      : description;
  return {
    title: localizedTitle,
    description: localizedDescription,
    // Alternate language versions for SEO
    alternates: {
      languages: {
        pt: locale === 'pt' ? undefined : '/pt',
        en: locale === 'en' ? undefined : '/en',
      },
    },
  };
}

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
