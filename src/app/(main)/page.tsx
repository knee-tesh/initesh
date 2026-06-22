import Hero from "@/components/home/hero";
import LiveTerminal from "@/components/home/live-terminal";
import ServicesTeaser from "@/components/home/services-teaser";
import ProjectsGrid from "@/components/home/projects-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveTerminal />
      <ServicesTeaser />
      <ProjectsGrid />
    </>
  );
}
