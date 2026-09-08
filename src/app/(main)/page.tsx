import Hero from "@/components/home/hero";
import ImpactStrip from "@/components/home/impact-strip";
import ErrorBoundary from "@/components/shared/error-boundary";

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Hero />
      <ImpactStrip />
    </ErrorBoundary>
  );
}
