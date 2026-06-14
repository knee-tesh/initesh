import TerminalLayout from "@/components/terminal-layout";
import VisitorTracking from "@/components/visitor-tracking";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TerminalLayout>
      <VisitorTracking />
      {children}
    </TerminalLayout>
  );
}
