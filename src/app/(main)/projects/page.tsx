import ProjectCard from "@/components/projects/project-card";
import projects from "@/data/projects.json";

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-2 font-[family-name:var(--font-display)]">
        Projects
      </h1>
      <p className="text-muted mb-8">A selection of work I&apos;ve shipped.</p>

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
