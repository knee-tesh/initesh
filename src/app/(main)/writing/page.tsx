import SectionHeading from "@/components/shared/section-heading";
import WritingCard from "@/components/writing/writing-card";
import { articles } from "@/data/writing";

export default function WritingPage() {
  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="Writing"
        title="Writing"
        kicker="Essays on engineering leadership, distributed systems, and craft."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <WritingCard key={article.slug} article={article} />
        ))}
      </div>
      {articles.length === 1 && (
        <p className="text-sm text-muted italic">More writing in progress.</p>
      )}
    </div>
  );
}
