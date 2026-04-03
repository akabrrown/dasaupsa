import type { NextConfig } from "next";

// Build CSP as readable parts joined into one line
const cspDirectives = [
  "default-src 'self'",
  // Scripts: self + GTM + Vercel toolbar + inline/eval for Next.js
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live",
  // Explicit script-src-elem to avoid fallback warning
  "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://res.cloudinary.com https://dpbdoikeyikqhojgctks.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://vercel.com https://vercel.live",
  "font-src 'self' data: https://fonts.gstatic.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Connections: Supabase, Cloudinary, GA4 Measurement Protocol, Vercel, GTM
  "connect-src 'self' https://dpbdoikeyikqhojgctks.supabase.co wss://dpbdoikeyikqhojgctks.supabase.co https://api.cloudinary.com https://res.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://vercel.live https://vitals.vercel-insights.com ws://localhost:3000 wss://localhost:3000",
  "frame-src 'self' https://www.youtube.com https://vercel.live",
].join('; ');

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dpbdoikeyikqhojgctks.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;




