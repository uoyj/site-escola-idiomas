'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { locales } from '@/i18n/request';
import { cn } from 'cn';
import { siteConfig } from '@/content/site-config';

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('home');

  const links = [
    { key: 'about', label: t('about'), href: '/sobre' },
    { key: 'courses', label: t('courses'), href: '/aulas' },
    { key: 'contact', label: t('contact'), href: '/contato' },
  ] as const;

  const switchLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg">
          {siteConfig.name}
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-1.5 rounded-md bg-muted p-1 text-xs">
            {locales.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                disabled={loc === locale}
                className={cn(
                  'rounded px-2 py-1 font-medium transition-colors',
                  loc === locale
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
}
