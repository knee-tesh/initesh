import type { Metadata } from "next";
import "./globals.css";
import contact from "@/data/contact.json";

export const metadata: Metadata = {
  title: "Nitesh Tiwari — Principal Software Engineer | Distributed Systems | Cloud Architecture",
  description: "Principal Software Engineer designing resilient distributed systems and cloud platforms. 10+ years shipping serverless architecture, AI-driven workflows, and high-scale SaaS.",
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nitesh Tiwari",
  jobTitle: "Principal Software Engineer",
  email: contact.email,
  url: "https://nitesh.in",
  sameAs: [contact.linkedin, contact.github],
  address: { "@type": "PostalAddress", addressLocality: contact.location },
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}