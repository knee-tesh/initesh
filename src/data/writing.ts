export interface Article {
  slug: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  readMinutes: number;
}

export const articles: Article[] = [
  {
    slug: "failure-tolerant-event-pipelines",
    title: "Designing Failure-Tolerant Event Pipelines",
    category: "Architecture",
    summary: "How architectural boundaries influence reliability and operational complexity.",
    date: "2026-02-10",
    readMinutes: 8,
  },
  // TODO(content): add at least 2 more pieces. The home preview shows the first 3 (articles.slice(0,3)).
];
