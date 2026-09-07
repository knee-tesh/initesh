import Hero from "@/components/home/hero";
import Ledger from "@/components/home/ledger";
import ServicesTeaser from "@/components/home/services-teaser";
import ProjectsGrid from "@/components/home/projects-grid";
import MandalaDivider from "@/components/shared/mandala-divider";
import Reveal from "@/components/shared/reveal";
import ErrorBoundary from "@/components/shared/error-boundary";

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Hero />
      <MandalaDivider />
      <Reveal><Ledger /></Reveal>
      <MandalaDivider />
      <Reveal><ServicesTeaser /></Reveal>
      <Reveal><ProjectsGrid /></Reveal>
    </ErrorBoundary>
  );
}