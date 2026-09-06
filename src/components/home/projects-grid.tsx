import Link from "next/link";
import Tag from "@/components/shared/tag";
import projects from "@/data/projects.json";

export default function ProjectsGrid() {
  return (
    <section className="my-16">
      <h2 className="text-xs uppercase tracking-[2px] text-stone text-center mb-2 font-[family-name:var(--font-script)]">
        Featured Work
      </h2>
      <h3 className="text-2xl font-bold text-ink text-center mb-8 font-[family-name:var(--font-display)]">
        Projects I&apos;ve Shipped
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="stitch-card overflow-hidden group block"
            style={{ borderLeftWidth: "3px", borderLeftColor: project.brandColor }}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag label={project.category} color={project.brandColor} />
                {project.techStack.slice(0, 2).map((tech) => (
                  <Tag key={tech} label={tech} />
                ))}
              </div>
              <h4 className="text-base font-semibold text-ink mb-1 font-[family-name:var(--font-display)]">
                {project.title}
              </h4>
              <p className="text-sm text-stone leading-relaxed mb-3">
                {project.description}
              </p>
              <span className="text-sm text-teal group-hover:underline">
                View Case Study →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}