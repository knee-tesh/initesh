import Link from "next/link";
import Tag from "@/components/shared/tag";
import projects from "@/data/projects.json";

export default function ProjectsGrid() {
  return (
    <section className="my-16">
      <h2 className="text-xs uppercase tracking-[2px] text-muted text-center mb-2 font-[family-name:var(--font-mono)]">
        Featured Work
      </h2>
      <h3 className="text-2xl font-bold text-text text-center mb-8 font-[family-name:var(--font-display)]">
        Projects I&apos;ve Shipped
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="bg-surface border border-border rounded-lg overflow-hidden hover:border-border transition-colors group"
            style={{ borderLeftWidth: "3px", borderLeftColor: project.brandColor }}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag label={project.category} color={project.brandColor} />
                {project.techStack.slice(0, 2).map((tech) => (
                  <Tag key={tech} label={tech} />
                ))}
              </div>
              <h4 className="text-base font-semibold text-text mb-1 font-[family-name:var(--font-display)]">
                {project.title}
              </h4>
              <p className="text-sm text-muted leading-relaxed mb-3">
                {project.description}
              </p>
              <span className="text-sm text-accent font-[family-name:var(--font-mono)] group-hover:underline">
                View Case Study →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
