import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export if explicitly requested (e.g. GitHub Pages build)
  ...(process.env.IS_STATIC_EXPORT ? { output: "export" } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
