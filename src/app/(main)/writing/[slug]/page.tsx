import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articles } from "@/data/writing";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const article = articles.find((a) => a.slug === slug);
    if (!article) return {};
    return { title: article.title, description: article.summary };
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-12">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {article.category}
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-text font-[family-name:var(--font-display)]">
          {article.title}
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          {article.readMinutes} min read · {article.date}
        </p>
      </header>

      <p className="text-text leading-relaxed text-lg">{article.summary}</p>

      <p className="text-sm text-muted italic">
        {/* TODO(content): full article in progress */}
        Full article in progress.
      </p>
    </article>
  );
}
