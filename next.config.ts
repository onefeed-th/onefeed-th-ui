import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*' },
      { protocol: 'http', hostname: '*' },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 75, 85, 90, 95, 100],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable optimization for production to avoid RSS feed image issues
    unoptimized: true,
  },
};

export default nextConfig;