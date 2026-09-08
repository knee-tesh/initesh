import Link from "next/link";
import projects from "@/data/projects.json";

export default function MoreWork() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-text mb-4">More Work</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/work/${project.id}`}
            className="group block bg-surface border border-border rounded-lg p-4 hover:border-accent transition-colors duration-200"
            style={{ borderLeftWidth: "3px", borderLeftColor: project.brandColor }}
          >
            <p className="text-xs font-mono uppercase tracking-wider text-muted">{project.category}</p>
            <h4 className="mt-1 text-base font-semibold text-text">{project.title}</h4>
            <p className="mt-1 text-sm text-muted leading-relaxed">{project.description}</p>
            <span className="mt-2 inline-block text-sm text-accent group-hover:translate-x-1 transition-transform duration-200">
              Read case study →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
