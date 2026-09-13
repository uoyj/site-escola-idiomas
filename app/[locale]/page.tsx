import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getCourses } from '@/content';
import { getTestimonials } from '@/content';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: 'pt' | 'en' }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const hero = await getTranslations({ locale, namespace: 'hero' });
  const coursesT = await getTranslations({ locale, namespace: 'coursesPreview' });
  const statsT = await getTranslations({ locale, namespace: 'stats' });
  const testimonialsT = await getTranslations({ locale, namespace: 'testimonialsPreview' });
  const finalCta = await getTranslations({ locale, namespace: 'finalCta' });
  const courses = await getCourses(locale);
  const testimonials = await getTestimonials(locale);

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-0 right-0 -translate-x-1/2 translate-y-[-30%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-x-[-30%] translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl" />

        <div className="relative container mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              {hero('trustBadge')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              {hero('title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              {hero('subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contato">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {hero('primaryCta')}
                </button>
              </Link>
              <Link href="/sobre">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {hero('secondaryCta')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground mt-1">{statsT('years')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent">500+</p>
              <p className="text-sm text-muted-foreground mt-1">{statsT('students')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">10+</p>
              <p className="text-sm text-muted-foreground mt-1">{statsT('languages')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COURSES PREVIEW ===== */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {coursesT('title')}
            </h2>
            <p className="text-lg text-muted-foreground">{coursesT('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
                <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                  {course.level}
                </span>
                <p className="text-muted-foreground mb-6 flex-grow">{course.description}</p>
                <Link href="/aulas">
                  <button
                    type="button"
                    className="mt-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {t('viewDetails')}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/aulas">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {coursesT('viewAll')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section className="py-20 border-t border-border bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {testimonialsT('title')}
              </h2>
              <p className="text-lg text-muted-foreground">{testimonialsT('subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((tItem) => (
                <div
                  key={tItem.id}
                  className="rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 fill-current"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 17.5l-7.416 3.855 1.48-8.279L.5 8.742l8.332-1.151z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{'"'}{tItem.text}{'"'}</p>
                  <div>
                    <p className="font-semibold text-foreground">{tItem.name}</p>
                    <p className="text-sm text-muted-foreground">{tItem.course}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CALL TO ACTION ===== */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-primary/5 p-12 md:p-16 text-center">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
            <h2 className="relative text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {finalCta('title')}
            </h2>
            <p className="relative text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {finalCta('subtitle')}
            </p>
            <Link href="/contato">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {t('cta')}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
