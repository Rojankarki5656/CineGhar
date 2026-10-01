// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;