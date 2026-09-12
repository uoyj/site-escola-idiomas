// app/[locale]/sobre/page.tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAbout } from '@/content';

type Props = { params: Promise<{ locale: 'pt' | 'en' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SobrePage' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function SobrePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('SobrePage');
  const about = await getAbout(locale);

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-muted-foreground mt-2">{t('subtitle')}</p>

      <div className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold">{about.title}</h2>
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed">{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
