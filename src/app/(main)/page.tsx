import Hero from "@/components/home/hero";
import ImpactStrip from "@/components/home/impact-strip";
import ErrorBoundary from "@/components/shared/error-boundary";
import SectionHeading from "@/components/shared/section-heading";
import ProjectCard from "@/components/work/project-card";
import MoreWork from "@/components/work/more-work";
import { caseStudies } from "@/data/case-studies";

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Hero />
      <ImpactStrip />

      <section id="work" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            eyebrow="Work"
            title="Selected Systems"
            kicker="A few of the systems and engineering problems that best represent my work."
          />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {caseStudies.map((study) => (
              <ProjectCard key={study.slug} study={study} />
            ))}
          </div>
          <div className="mt-16">
            <MoreWork />
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
