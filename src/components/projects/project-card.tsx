import Link from "next/link";
import Tag from "@/components/shared/tag";

export default function ProjectCard({ project }: { project: any }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-surface border border-border rounded-lg overflow-hidden hover:border-border transition-colors group"
      style={{ borderLeftWidth: "3px", borderLeftColor: project.brandColor }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Tag label={project.category} color={project.brandColor} />
          {project.techStack.slice(0, 2).map((tech: string) => (
            <Tag key={tech} label={tech} />
          ))}
        </div>
        <h3 className="text-base font-semibold text-text mb-1 font-[family-name:var(--font-display)]">
          {project.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-3">
          {project.description}
        </p>
        <span className="text-sm text-accent font-[family-name:var(--font-mono)] group-hover:underline">
          View Case Study →
        </span>
      </div>
    </Link>
  );
}
