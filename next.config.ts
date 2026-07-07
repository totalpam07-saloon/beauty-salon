import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ["192.168.161.35", "nine-webs-shout.loca.lt", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // unoptimized: true, // Let Next.js optimize images to prevent client-side Unsplash rate limits
  },
};

export default nextConfig;
