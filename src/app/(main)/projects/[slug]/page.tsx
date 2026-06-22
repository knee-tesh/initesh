import { notFound } from "next/navigation";
import Breadcrumb from "@/components/shared/breadcrumb";
import Tag from "@/components/shared/tag";
import CtaButton from "@/components/shared/cta-button";
import projects from "@/data/projects.json";

export function generateStaticParams() {
  return projects.map((p: any) => ({ slug: p.id }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p: any) => p.id === slug);

  if (!project) notFound();

  return (
    <div>
      <Breadcrumb items={[{ label: "Projects", href: "/projects" }, { label: project.title }]} />

      <div className="flex items-center gap-2 mb-4">
        <Tag label={project.category} color={project.brandColor} />
        {project.techStack.map((tech: string) => (
          <Tag key={tech} label={tech} />
        ))}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-text mb-3 font-[family-name:var(--font-display)]">
        {project.title}
      </h1>
      <p className="text-muted leading-relaxed mb-8 max-w-[600px]">
        {project.description}
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-[2px] text-accent mb-3 font-[family-name:var(--font-mono)]">
            The Problem
          </h2>
          <p className="text-sm text-muted leading-relaxed">{project.problem}</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-[2px] text-mint mb-3 font-[family-name:var(--font-mono)]">
            The Result
          </h2>
          <p className="text-sm text-muted leading-relaxed">{project.result}</p>
        </div>
      </div>

      {project.features && (
        <div className="bg-surface border border-border rounded-lg p-5 mb-8">
          <h2 className="text-sm font-semibold text-text mb-3 font-[family-name:var(--font-display)]">
            Key Features
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {project.features.map((f: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted">
                <span className="text-mint">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-5 mb-8">
        <h2 className="text-sm font-semibold text-text mb-2 font-[family-name:var(--font-display)]">
          Tech Stack
        </h2>
        <p className="text-sm text-muted">{project.techStack.join(" · ")}</p>
      </div>

      <div className="flex items-center gap-3">
        <CtaButton href={project.liveUrl}>View Live Site →</CtaButton>
      </div>
    </div>
  );
}
