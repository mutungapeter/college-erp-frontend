import type { NextConfig } from "next";
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: isDev ? 'http' : 'https',
        hostname: isDev ? '127.0.0.1' : process.env.NEXT_PUBLIC_SERVER_URI || 'localhost',
        port: isDev ? '8000' : '',
        pathname: '/media/**',
      },
    ],
  },
  

  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: `${isDev ? 'http://127.0.0.1:8000' : process.env.NEXT_PUBLIC_SERVER_URI}/media/:path*`,
      },
    ];
  },
};



export default nextConfig;
