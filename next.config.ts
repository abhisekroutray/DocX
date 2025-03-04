import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch rendering issues in development
  experimental: {
    workerThreads: true, // Enables worker threads for better performance
    cpus: 4, // Utilizes multiple CPU cores
  },
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "s-maxage=5, stale-while-revalidate" }, // Optimize API caching
        ],
      },
    ];
  },
  images: {
    domains: ["lh3.googleusercontent.com", "drive.google.com"], // Google Drive image optimization
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console logs in production
  },
};

export default nextConfig;
