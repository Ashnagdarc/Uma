import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.spoonacular.com',
      },
      {
        protocol: 'https',
        hostname: 'spoonacular.com',
      },
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
      },
    ],
  },
};

export default nextConfig;
