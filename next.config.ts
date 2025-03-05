import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "drive.google.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase upload limit to 10 MB (adjust as needed)
    },
  },
};

export default nextConfig;
