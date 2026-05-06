import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript check is already verified via npx tsc --noEmit in CI.
  // Skipping the redundant build-time check avoids OOM crashes on Windows
  // when the build runs inside the git pre-push hook environment.
  typescript: { ignoreBuildErrors: true },
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
