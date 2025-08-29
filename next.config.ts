import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Common image hosting services
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'img.freepik.com' },
      
      // News and media domains
      { protocol: 'https', hostname: 'static.thairath.co.th' },
      { protocol: 'https', hostname: 'cdn.khaosod.co.th' },
      { protocol: 'https', hostname: 'www.matichon.co.th' },
      { protocol: 'https', hostname: 'static.posttoday.com' },
      { protocol: 'https', hostname: 'www.dailynews.co.th' },
      { protocol: 'https', hostname: 'media.workpointnews.com' },
      { protocol: 'https', hostname: 'static.sanook.com' },
      { protocol: 'https', hostname: 'f.ptcdn.info' },
      { protocol: 'https', hostname: 'static.mgronline.com' },
      { protocol: 'https', hostname: 'cdn.bangkokpost.com' },
      { protocol: 'https', hostname: 'www.nationthailand.com' },
      
      // Generic domains for RSS feeds
      { protocol: 'https', hostname: '**.com' },
      { protocol: 'https', hostname: '**.co.th' },
      { protocol: 'https', hostname: '**.net' },
      { protocol: 'https', hostname: '**.org' },
      { protocol: 'https', hostname: '**.io' },
      
      // CDN and image services
      { protocol: 'https', hostname: '**.googleapis.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.imgix.net' },
      
      // API domain
      { protocol: 'https', hostname: 'onefeed-th-api.artzakub.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add unoptimized as fallback for problematic images
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;