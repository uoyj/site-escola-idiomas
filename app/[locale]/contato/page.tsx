// app/[locale]/contato/page.tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = { params: Promise<{ locale: 'pt' | 'en' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContatoPage' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function ContatoPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('ContatoPage');

  const numero = '5541999999999';
  const mensagem = encodeURIComponent('Ola! Gostaria de agendar uma aula experimental.');

  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      <a
        href={`https://wa.me/${numero}?text=${mensagem}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        {t('cta')}
      </a>
    </main>
  );
}
