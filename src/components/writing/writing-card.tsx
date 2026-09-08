import Link from "next/link";
import type { Article } from "@/data/writing";

export default function WritingCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/writing/${article.slug}`}
      className="block bg-surface border border-border rounded-lg p-6 hover:border-accent transition-colors"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
        {article.category}
      </p>
      <h3 className="text-lg font-semibold text-text">{article.title}</h3>
      <p className="mt-2 text-muted text-sm leading-relaxed">{article.summary}</p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
        {article.readMinutes} min read · {article.date}
      </p>
    </Link>
  );
}
