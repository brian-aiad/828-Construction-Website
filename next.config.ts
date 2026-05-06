import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
