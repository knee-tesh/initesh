"use client";

import SiteHeader from "@/components/layout/site-header";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/chat/chat-widget";
import { PresenceIndicator } from "@/components/shared/presence-indicator";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader onPalette={() => {}} />
      <main className="max-w-[1240px] mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <PresenceIndicator />
    </>
  );
}
