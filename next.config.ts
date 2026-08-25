import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Dev server writes to .next-dev so `next build` / preflight / deploy runs
  // (which wipe .next) can never corrupt a running `npm run dev` on :3001.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  devIndicators: false,
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    qualities: [62, 72, 74, 75, 82, 86, 88, 90, 92, 93, 95],
    minimumCacheTTL: 31536000,
  },
  // `npm run build` runs `tsc --noEmit` before Next. Keep Next's duplicate
  // checker disabled so local hooks and Vercel enforce types exactly once.
  typescript: { ignoreBuildErrors: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            // Add `includeSubDomains; preload` only after every subdomain,
            // including `www`, has a valid HTTPS certificate.
            value: "max-age=63072000",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          { key: "X-828-Deploy", value: "mobile-hardening-2026-08-08" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /projects → /portfolio (301)
      {
        source: "/projects",
        destination: "/portfolio",
        permanent: true,
      },
      // /projects/* → /portfolio/* (pattern — catch any sub-paths)
      {
        source: "/projects/:path*",
        destination: "/portfolio/:path*",
        permanent: true,
      },
      // /process → /portfolio (process merged into portfolio)
      {
        source: "/process",
        destination: "/portfolio",
        permanent: true,
      },
    ];
  },
};

export default withBotId(nextConfig);
