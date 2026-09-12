import { getCourses } from '@/content';
import { getTranslations } from 'next-intl/server';

export default async function AulasPage({
  params,
}: {
  params: Promise<{ locale: 'pt' | 'en' }>;
}) {
  const { locale } = await params;
  const courses = await getCourses(locale);
  const t = await getTranslations('aulas');

  return (
    <main className="min-h-screen py-16 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          {t('subtitle')}
        </p>

        <ul className="space-y-6">
          {courses.map((course) => (
            <li
              key={course.id}
              className="bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border"
            >
              <h2 className="text-2xl font-bold text-primary mb-2">
                {course.title}
              </h2>
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full mb-3">
                {course.level}
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </li>
          ))}
        </ul>

        {courses.length === 0 && (
          <p className="text-center text-muted-foreground mt-12">{t('noCourses')}</p>
        )}

        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors duration-200">
            {t('ctaButton')}
          </button>
        </div>
      </div>
    </main>
  );
}
