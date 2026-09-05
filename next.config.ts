import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/daklekkage", destination: "/dak-lekkage", permanent: true },
      { source: "/dakisolatie", destination: "/dak-isolatie", permanent: true },
      { source: "/bitumen-daken", destination: "/betumendaken", permanent: true },
      { source: "/blog", destination: "/blog-s", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/offerte/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, noimageindex" },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" }
        ]
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  }
};

export default nextConfig;
