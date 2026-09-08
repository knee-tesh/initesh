import Hero from "@/components/home/hero";
import Reel from "@/components/home/reel";
import ServicesTeaser from "@/components/home/services-teaser";
import CreditsMarquee from "@/components/shared/credits-marquee";
import ErrorBoundary from "@/components/shared/error-boundary";

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Hero />
      <Reel />
      <ServicesTeaser />
      <CreditsMarquee />
    </ErrorBoundary>
  );
}