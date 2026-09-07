import { notFound } from "next/navigation";
import Breadcrumb from "@/components/shared/breadcrumb";
import ProjectShowcase from "@/components/projects/project-showcase";
import ErrorBoundary from "@/components/shared/error-boundary";
import projects from "@/data/projects.json";
import type { Project } from "@/lib/types";

export function generateStaticParams() {
  return projects.map((p: any) => ({ slug: p.id }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p: any) => p.id === slug) as Project | undefined;

  if (!project) notFound();

  return (
    <div>
      <Breadcrumb items={[{ label: "Projects", href: "/projects" }, { label: project.title }]} />
      <ErrorBoundary><ProjectShowcase project={project} /></ErrorBoundary>
    </div>
  );
}
