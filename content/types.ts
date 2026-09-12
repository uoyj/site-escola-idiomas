export interface Course {
  id: string;
  title: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  course: string;
}
