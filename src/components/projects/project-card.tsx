import Link from "next/link";
import Tag from "@/components/shared/tag";

export default function ProjectCard({ project }: { project: any }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="stitch-card overflow-hidden group block"
      style={{ borderLeftWidth: "3px", borderLeftColor: project.brandColor }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Tag label={project.category} color={project.brandColor} />
          {project.techStack.slice(0, 2).map((tech: string) => (
            <Tag key={tech} label={tech} />
          ))}
        </div>
        <h3 className="text-base font-semibold text-ink mb-1 font-[family-name:var(--font-display)]">
          {project.title}
        </h3>
        <p className="text-sm text-stone leading-relaxed mb-3">
          {project.description}
        </p>
        <span className="text-sm text-teal group-hover:underline">
          View Case Study →
        </span>
      </div>
    </Link>
  );
}
