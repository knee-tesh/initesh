import Hero from "@/components/home/hero";
import Ledger from "@/components/home/ledger";
import ServicesTeaser from "@/components/home/services-teaser";
import ProjectsGrid from "@/components/home/projects-grid";
import MandalaDivider from "@/components/shared/mandala-divider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MandalaDivider />
      <Ledger />
      <MandalaDivider />
      <ServicesTeaser />
      <ProjectsGrid />
    </>
  );
}