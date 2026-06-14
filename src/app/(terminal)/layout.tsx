import TerminalLayout from "@/components/terminal-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TerminalLayout>{children}</TerminalLayout>;
}
