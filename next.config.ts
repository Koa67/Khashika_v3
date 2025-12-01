import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // KILL SWITCH : Désactive l'optimisation d'images pour éviter les crashes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.khashika.com',
      },
      {
        protocol: 'https',
        hostname: 'khashika.com',
      },
    ],
  },
};

export default nextConfig;
