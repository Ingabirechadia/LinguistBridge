import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode for React — highlights potential issues
  reactStrictMode: true,
  // Allow cross-origin images from trusted domains (extend as needed)
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
