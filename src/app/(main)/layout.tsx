import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/chat/chat-widget";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
