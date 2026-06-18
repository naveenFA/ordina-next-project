import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.flowautomate.io",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
