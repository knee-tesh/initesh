"use client";

import SiteHeader from "@/components/layout/site-header";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/chat/chat-widget";
import { PresenceIndicator } from "@/components/shared/presence-indicator";
import CommandPaletteProvider, { useCommandPalette } from "@/components/shared/command-palette-provider";

function Header() {
  const { open } = useCommandPalette();
  return <SiteHeader onPalette={open} />;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      <Header />
      <main className="max-w-[1240px] mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <PresenceIndicator />
    </CommandPaletteProvider>
  );
}
