import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    }
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
