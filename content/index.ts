import type { Course, AboutContent, Testimonial } from './types';

type Locale = 'pt' | 'en';

export async function getCourses(locale: Locale): Promise<Course[]> {
  const data = await import(`./courses.${locale}.json`);
  return data.courses;
}

export async function getAbout(locale: Locale): Promise<AboutContent> {
  const data = await import(`./about.${locale}.json`);
  return data.default;
}

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  const data = await import(`./testimonials.${locale}.json`);
  return data.testimonials;
}
