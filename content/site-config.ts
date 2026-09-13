export const siteConfig = {
  name: 'Idioma & Cia',
  tagline: {
    pt: 'Escola de Idiomas',
    en: 'Language School',
  },
} as const;

export type Locale = keyof typeof siteConfig.tagline;
