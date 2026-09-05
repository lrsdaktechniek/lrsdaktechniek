import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "LRS Daktechniek | Dakdekker Breda & omgeving",
    template: "%s | LRS Daktechniek"
  },
  description: "LRS Daktechniek voor dakwerk in Breda en omgeving.",
  robots: { index: true, follow: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070a0d"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="nl"><body>{children}</body></html>;
}
