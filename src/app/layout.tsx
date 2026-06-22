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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}