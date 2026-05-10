import type { NextConfig } from 'next'
import crypto from 'crypto'

// ============================================================
// Next.js Config — Performa + Keamanan + Anti-Fingerprinting
// ============================================================

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ── Anti-fingerprinting (1): Hapus X-Powered-By header ───
  poweredByHeader: false,

  // ── Anti-fingerprinting (2): Custom Build ID ─────────────
  // Hapus pola hash git yang bisa dikorelasikan ke versi Next.js
  generateBuildId: async () => {
    const ts = Date.now().toString()
    return crypto.createHash('sha256').update(ts).digest('hex').slice(0, 16)
  },

  // ── Anti-fingerprinting (3): Webpack string replacement ──
  // Ganti string versi di webpack bundle saat build production
  // Ini berlapis dengan scripts/strip-fingerprint.mjs
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        // Override versi yang diinjek ke bundle
        'process.env.__NEXT_VERSION': JSON.stringify(''),
      })
    )
    return config
  },

  // ── Anti-fingerprinting (3): Ganti distDir ───────────────
  // Ubah folder build dari default '.next' ke nama lain.
  // Di production dengan Nginx, path /_next/ bisa di-rewrite
  // ke /_s/ untuk mempersulit deteksi otomatis.
  // distDir: '.next', // Biarkan default; perubahan URL butuh Nginx

  // Optimasi gambar
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.gianyarkab.go.id',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
  },

  // Security + anti-fingerprinting headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ── Anti-fingerprinting headers ──
          { key: 'X-Powered-By', value: '' },
          // Timpa Server header dengan nilai yang tidak mengungkap stack
          { key: 'Server', value: 'GianyarWebServer' },

          // ── Security headers standar ──
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              // img-src: tambah tile server OSM & CDN leaflet
              "img-src 'self' data: blob: https: https://*.tile.openstreetmap.org https://unpkg.com",
              "frame-src 'self' https://maps.google.com https://www.google.com https://www.youtube.com https://www.openstreetmap.org",
              // connect-src: OSM tiles & nominatim geocoding
              "connect-src 'self' https://*.tile.openstreetmap.org https://nominatim.openstreetmap.org",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          { key: 'X-Download-Options', value: 'noopen' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
      ...(process.env.NODE_ENV === 'production' ? [{
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      }] : []),
      {
        source: '/assets/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      { source: '/layanan/kependudukan', destination: '/layanan', permanent: true },
    ]
  },

  compress: true,
  output: 'standalone',
}

export default nextConfig
