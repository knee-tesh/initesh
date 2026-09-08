import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { rfcs } from "@/data/rfcs";
import RFCReader from "@/components/architecture/rfc-reader";

export function generateStaticParams() {
  return rfcs.map((rfc) => ({ id: rfc.id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return params.then(({ id }) => {
    const rfc = rfcs.find((r) => r.id === id);
    if (!rfc) return {};
    const desc = rfc.sections.find((s) => !s.body.startsWith("TODO"))?.body;
    return {
      title: `${rfc.id} · ${rfc.title}`,
      description: desc ?? rfc.title,
    };
  });
}

export default async function RFCPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rfc = rfcs.find((r) => r.id === id);
  if (!rfc) notFound();

  return (
    <>
      <Link href="/architecture" className="inline-block font-mono text-xs text-muted hover:text-accent transition-colors mb-8">
        ← Architecture
      </Link>
      <RFCReader rfc={rfc} />
    </>
  );
}
