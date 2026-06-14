import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "nitesh@portfolio:~$",
  description: "Principal Fullstack Developer — Portfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const palette = h.get("x-palette") ?? "dawn";
  const theme = h.get("x-theme") ?? "terminal";

  return (
    <html lang="en" className="h-full antialiased" data-palette={palette} data-theme={theme}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
