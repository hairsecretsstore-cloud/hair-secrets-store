import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Announcement } from "@/components/layout/announcement";
import { Preloader } from "@/components/experience/preloader";
import { Cursor } from "@/components/experience/cursor";
import { ScrollProgress } from "@/components/experience/scroll-progress";
import { site } from "@/lib/site";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-src",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-src",
  display: "swap",
});

const siteUrl = site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hair Secrets Store — Luxury Raw Human Hair",
    template: "%s · Hair Secrets Store",
  },
  description:
    "Hair Secrets Store offers 100% raw, single-donor human hair — ethically sourced, full cuticle, and built to last. Shop luxury bundles, wigs, and closures with worldwide DHL shipping.",
  keywords: [
    "raw human hair",
    "luxury hair bundles",
    "brazilian hair",
    "cambodian hair",
    "raw hair extensions",
    "human hair wigs",
  ],
  openGraph: {
    title: "Hair Secrets Store — Luxury Raw Human Hair",
    description:
      "100% raw, single-donor human hair. Ethically sourced, full cuticle, built to last.",
    url: siteUrl,
    siteName: "Hair Secrets Store",
    type: "website",
    images: [{ url: "/photos/hero-1.webp", width: 1000, height: 1250 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hair Secrets Store — Luxury Raw Human Hair",
    description: "100% raw, single-donor human hair. Ethically sourced.",
    images: ["/photos/hero-1.webp"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <style>{`
          :root {
            --font-display: ${display.style.fontFamily}, "Times New Roman", serif;
            --font-sans: ${sans.style.fontFamily}, ui-sans-serif, system-ui, sans-serif;
          }
        `}</style>
      </head>
      <body className="grain">
        <Preloader />
        <Cursor />
        <ScrollProgress />
        <Announcement />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
