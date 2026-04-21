import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import LenisProvider from "@/components/providers/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import { SITE } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "828 Construction | Quality Building Solutions - Torrance, CA",
    template: "%s | 828 Construction",
  },
  description: SITE.description,
  keywords: [
    "construction Torrance CA",
    "ADU builder Torrance",
    "remediation contractor Torrance",
    "construction consulting South Bay",
    "general contractor Torrance",
    "building science expert California",
    "accessory dwelling unit Torrance",
  ],
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: "828 Construction — Built with Intent. Not by Accident.",
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black font-body">
        {/* Skip to main content — keyboard accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Grain texture — fixed overlay, pointer-events none */}
        <div className="grain-overlay" aria-hidden="true" />
        <ScrollProgress />
        {/* Custom cursor — hidden on touch devices via CSS */}
        <CustomCursor />
        <LenisProvider>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </LenisProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
