import Link from "next/link";
import type { CaseStudy } from "@/data/case-studies";

export default function ProjectCard({ study }: { study: CaseStudy }) {
  return (
    <Link href={`/work/${study.slug}`} className="group block bg-surface border border-border rounded-lg p-6 hover:border-accent transition-colors duration-200">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">PROJECT</p>
      <h3 className="mt-2 text-2xl font-semibold text-text">{study.title}</h3>
      <dl className="mt-4 space-y-1.5 text-sm">
        <div><dt className="inline text-muted font-mono text-xs uppercase">Domain · </dt><dd className="inline text-text">{study.domain}</dd></div>
        <div><dt className="inline text-muted font-mono text-xs uppercase">Role · </dt><dd className="inline text-text">{study.role}</dd></div>
        <div><dt className="inline text-muted font-mono text-xs uppercase">Scale · </dt><dd className="inline text-text">{study.scale}</dd></div>
      </dl>
      <p className="mt-3 text-muted text-sm leading-relaxed">{study.summary}</p>
      <p className="mt-4 font-mono text-sm text-accent group-hover:translate-x-1 transition-transform duration-200 inline-flex gap-1">Read case study →</p>
    </Link>
  );
}
