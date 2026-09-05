import type { Metadata } from "next";
import { timingSafeEqual } from "node:crypto";
import { notFound } from "next/navigation";
import { QuoteBuilder } from "@/components/QuoteBuilder";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "LRS Werkbon & Prijsengine",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

function equal(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const secret = process.env.OFFERTE_SECRET;
  if (!secret || !equal(token, secret)) notFound();

  return (
    <main className="compact-private-shell">
      <QuoteBuilder />
    </main>
  );
}
