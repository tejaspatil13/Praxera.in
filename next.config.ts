import path from "node:path";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    root: path.resolve("."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Without this, a return visitor's browser asks again for every reel and poster.
      {
        source: "/portfolio/:file([\\w.-]+\\.(?:jpg|webp|png|mp4))",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=2592000" }],
      },
      // Voice typing on the requirements form is the only use of the microphone.
      {
        source: "/requirements",
        headers: [{ key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()" }],
      },
    ];
  },
};

export default nextConfig;
