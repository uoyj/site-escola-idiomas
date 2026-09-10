import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-xl text-gray-600 mb-8">{t('subtitle')}</p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
        {t('cta')}
      </button>
    </main>
  );
}
