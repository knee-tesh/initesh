export type SkillCategory = 'frontend' | 'backend' | 'infrastructure' | 'databases' | 'tools' | 'leadership';
export type SkillDepth = 'expert' | 'advanced' | 'proficient';

export interface Skill {
  category: SkillCategory;
  name: string;
  depth: SkillDepth;
  years: number;
  note?: string;
}

export type ServiceTier = 'audit' | 'advisory' | 'execution' | 'interim';

export interface Service {
  id: string;
  title: string;
  description: string;
  tier: ServiceTier;
  priceRange: string;
  delivery: string;
  cta: string;
}

export interface About {
  narrative: string[];
  philosophy: string[];
  principles: string[];
  timeline: { year: number; role: string; org: string; highlight: string }[];
}

export interface Contact {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  calendar: string;
  responseTime: string;
}

export type Palette = 'dawn' | 'day' | 'dusk' | 'midnight';
export type Theme = 'terminal' | 'retrowave';

export interface Process {
  pid: number;
  name: string;
  href: string;
  status: 'running' | 'idle' | 'sleeping';
}
