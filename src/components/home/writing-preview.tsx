import Link from "next/link";
import SectionHeading from "@/components/shared/section-heading";
import { articles } from "@/data/writing";

export default function WritingPreview() {
  const preview = articles.slice(0, 3);

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Writing"
          title="Selected Writing"
          kicker="Thoughts on architecture, systems thinking, and engineering leadership."
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preview.map((article) => (
            <div key={article.slug} className="bg-surface border border-border rounded-lg p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
                {article.category}
              </p>
              <h3 className="text-lg font-semibold text-text">{article.title}</h3>
              <p className="mt-3 text-muted leading-relaxed">{article.summary}</p>
              <p className="mt-4 text-sm text-muted">{article.readMinutes} min read</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/writing"
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent2 transition-colors"
          >
            View all writing &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
