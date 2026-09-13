import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <section className="flex min-h-screen items-center justify-center bg-background">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          {t('title')}
        </h2>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>
        <Link
          href="/"
          className="inline-block mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('backHome')}
        </Link>
      </div>
    </section>
  );
}
