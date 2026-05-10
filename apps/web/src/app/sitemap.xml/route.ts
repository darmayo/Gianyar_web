// GET /sitemap.xml — XML sitemap untuk mesin pencari
// Turbopack: Next.js 15+ mendukung route handlers untuk sitemap

import { NextResponse } from 'next/server'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://gianyarkab.go.id'

const PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/profil', priority: '0.8', changefreq: 'monthly' },
  { url: '/pimpinan', priority: '0.8', changefreq: 'monthly' },
  { url: '/organisasi', priority: '0.7', changefreq: 'monthly' },
  { url: '/produk-hukum', priority: '0.8', changefreq: 'weekly' },
  { url: '/layanan', priority: '0.9', changefreq: 'weekly' },
  { url: '/layanan/formulir', priority: '0.8', changefreq: 'monthly' },
  { url: '/layanan/ktp', priority: '0.8', changefreq: 'monthly' },
  { url: '/layanan/kk', priority: '0.8', changefreq: 'monthly' },
  { url: '/layanan/antrian', priority: '0.9', changefreq: 'daily' },
  { url: '/layanan/jadwal', priority: '0.7', changefreq: 'weekly' },
  { url: '/pengaduan/buat', priority: '0.9', changefreq: 'monthly' },
  { url: '/pengaduan/cek', priority: '0.7', changefreq: 'monthly' },
  { url: '/cek-pajak', priority: '0.8', changefreq: 'monthly' },
  { url: '/berita', priority: '0.9', changefreq: 'daily' },
  { url: '/pariwisata', priority: '0.8', changefreq: 'monthly' },
  { url: '/statistik', priority: '0.7', changefreq: 'monthly' },
  { url: '/transparansi', priority: '0.8', changefreq: 'monthly' },
  { url: '/satu-data', priority: '0.7', changefreq: 'monthly' },
  { url: '/peta', priority: '0.7', changefreq: 'weekly' },
  { url: '/partisipasi', priority: '0.8', changefreq: 'weekly' },
  { url: '/musrenbang', priority: '0.7', changefreq: 'weekly' },
  { url: '/umkm', priority: '0.7', changefreq: 'weekly' },
  { url: '/lowongan', priority: '0.8', changefreq: 'daily' },
  { url: '/karier', priority: '0.8', changefreq: 'weekly' },
  { url: '/bpbd', priority: '0.8', changefreq: 'daily' },
  { url: '/darurat', priority: '0.9', changefreq: 'monthly' },
  { url: '/verifikasi', priority: '0.6', changefreq: 'monthly' },
  { url: '/faq', priority: '0.6', changefreq: 'monthly' },
  { url: '/keamanan-digital', priority: '0.7', changefreq: 'monthly' },
  { url: '/investasi', priority: '0.8', changefreq: 'weekly' },
  { url: '/smart-city', priority: '0.7', changefreq: 'daily' },
  { url: '/kesehatan', priority: '0.8', changefreq: 'daily' },
  { url: '/akun/profil', priority: '0.6', changefreq: 'monthly' },
  { url: '/bug-bounty', priority: '0.5', changefreq: 'monthly' },
  { url: '/kebijakan-privasi', priority: '0.4', changefreq: 'yearly' },
  { url: '/syarat-ketentuan', priority: '0.4', changefreq: 'yearly' },
  { url: '/aksesibilitas', priority: '0.4', changefreq: 'yearly' },
  { url: '/sitemap', priority: '0.3', changefreq: 'monthly' },
]

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url>
    <loc>${BASE}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
