// ============================================================
// 404 Not Found — Halaman tidak ditemukan
// Server Component — tidak butuh 'use client'
// ============================================================
import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, FileText, AlertCircle, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan — Portal Gianyar',
  description: 'Halaman yang Anda cari tidak ditemukan.',
  robots: { index: false },
}

const SARAN_LINK = [
  { href: '/layanan/ktp',    label: 'Layanan KTP',       icon: FileText },
  { href: '/cek-pajak',      label: 'Cek Pajak PBB',     icon: FileText },
  { href: '/pengaduan/buat', label: 'Buat Pengaduan',    icon: FileText },
  { href: '/berita',         label: 'Berita Terkini',    icon: FileText },
  { href: '/pariwisata',     label: 'Info Pariwisata',   icon: FileText },
  { href: '/faq',            label: 'FAQ',               icon: FileText },
]

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Ilustrasi */}
        <div className="relative mb-8 mx-auto w-40 h-40">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full" />
          <div className="absolute inset-4 bg-blue-200 dark:bg-blue-800/40 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle
              size={64}
              className="text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Kode & judul */}
        <p className="text-6xl font-black text-blue-200 dark:text-blue-900 mb-2 select-none" aria-hidden="true">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">
          Halaman yang Anda cari tidak ada, telah dipindahkan, atau URL yang dimasukkan salah.
          Coba gunakan pencarian atau kembali ke beranda.
        </p>

        {/* CTA utama */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Home size={18} aria-hidden="true" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/cari"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <Search size={18} aria-hidden="true" />
            Cari Layanan
          </Link>
        </div>

        {/* Saran halaman */}
        <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 text-left border border-gray-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <ArrowLeft size={14} aria-hidden="true" />
            Mungkin Anda mencari:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SARAN_LINK.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 hover:underline focus:outline-none focus:underline py-1 px-2 rounded hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              >
                → {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
