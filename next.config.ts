import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // TypeScript check is already verified via npx tsc --noEmit in CI.
  // Skipping the redundant build-time check avoids OOM crashes on Windows
  // when the build runs inside the git pre-push hook environment.
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
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
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

export default nextConfig;
