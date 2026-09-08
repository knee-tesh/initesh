import Hero from "@/components/home/hero";
import Reel from "@/components/home/reel";
import CreditsMarquee from "@/components/shared/credits-marquee";
import ErrorBoundary from "@/components/shared/error-boundary";

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Hero />
      <Reel />
      <CreditsMarquee />
    </ErrorBoundary>
  );
}