import ProjectCard from "@/components/projects/project-card";
import Reveal from "@/components/shared/reveal";
import projects from "@/data/projects.json";

export default function ProjectsPage() {
  return (
    <div>
      <Reveal>
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2 font-[family-name:var(--font-display)]">
          Projects
        </h1>
        <p className="text-stone mb-8">A selection of work I&apos;ve shipped.</p>
      </Reveal>

      <Reveal className="w-full">
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
