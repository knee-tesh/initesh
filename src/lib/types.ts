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

export interface Visitor {
  id: string;
  timestamp: string;
  page: string;
  ipHash: string;
  country?: string;
  city?: string;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
  visitDuration?: number;
  scrollDepth?: number;
  exitPage?: boolean;
}

export interface Query {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
}

export interface AdminSession {
  token: string;
  expiresAt: number;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  weekVisits: number;
  topPages: { page: string; visits: number; percentage: number }[];
}
