import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{source:"/images/krone/:path*",headers:[{key:"Cache-Control",value:"public, max-age=31536000, immutable"}]}, { source: "/images/optimized/:path*", headers: [{key:"Cache-Control",value:"public, max-age=31536000, immutable"}] }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 480, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 96, 256, 384]
  }
};

export default nextConfig;
