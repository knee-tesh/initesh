import type { Metadata } from "next";
import { IBM_Plex_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { portfolioData } from "@/data/portfolio";
import { baseUrl } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--fc-font-display",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fc-font-body",
  display: "swap",
});

const title = "Nitesh Tiwari — Principal Software Engineer";

const description =
  "Principal Software Engineer with 10+ years building cloud platforms, distributed systems, and event-driven integrations. Currently at Genesys Telecom, where the BYOI platform supports 50K+ concurrent channels.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "Nitesh Tiwari",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: portfolioData.profile.name,
  jobTitle: portfolioData.title,
  email: portfolioData.contact.email,
  url: baseUrl,
  sameAs: [portfolioData.contact.linkedin, portfolioData.contact.github],
  address: { "@type": "PostalAddress", addressLocality: portfolioData.contact.location },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${plex.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
