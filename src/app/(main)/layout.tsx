import SiteHeader from "@/components/layout/site-header";
import Footer from "@/components/layout/footer";
import { ChatAssistant, NarrationDock, PortfolioNarrationProvider } from "@/components/portfolio";
import { portfolioNarrationSections } from "@/data/portfolio-sections";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioNarrationProvider sections={portfolioNarrationSections}>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <Footer />
      <NarrationDock />
      <ChatAssistant />
    </PortfolioNarrationProvider>
  );
}
