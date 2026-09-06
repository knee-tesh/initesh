import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nitesh Tiwari — Principal Fullstack Developer",
  description: "I build production systems that scale. 10+ years shipping serverless architecture, AI-driven workflows, and high-scale SaaS. Based in Bangalore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Figtree:wght@400;500;600&family=Kalam:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}