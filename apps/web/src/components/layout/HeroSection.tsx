'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { FileText, MessageSquare, Search, MapPin } from 'lucide-react'

const QUICK_STATS = [
  { nilai: '12.847', label: 'Layanan Selesai' },
  { nilai: '94%', label: 'Kepuasan Warga' },
  { nilai: '3.291', label: 'Pengaduan Ditangani' },
]

export function HeroSection() {
  const { t } = useLang()

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-48 md:w-80 lg:w-96 h-48 md:h-80 lg:h-96 bg-yellow-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 md:w-56 lg:w-64 h-32 md:h-56 lg:h-64 bg-orange-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500 opacity-5 rounded-full -translate-y-1/2" />
        {/* Batik-inspired pattern dots */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Kiri: Teks utama */}
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
              <MapPin size={12} aria-hidden="true" />
              {t('Portal Resmi Pemerintah Kabupaten Gianyar', 'Official Government Portal of Gianyar Regency')}
            </div>

            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5"
            >
              {t('Layanan Publik', 'Public Services')}{' '}
              <span className="text-yellow-300">{t('Digital', 'Digital')}</span>{' '}
              {t('Kabupaten', 'of')}{' '}
              <span className="text-yellow-300">{t('Gianyar', 'Gianyar')}</span>
            </h1>

            <p className="text-base md:text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
              {t(
                'Urus KTP, ajukan pengaduan, cek pajak, dan temukan wisata budaya Bali — semuanya dalam satu portal resmi yang mudah diakses.',
                'Manage ID cards, file complaints, check taxes, and discover Bali cultural tourism — all in one easy-to-access official portal.'
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/layanan"
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-semibold px-7 py-3 rounded-xl hover:bg-yellow-300 transition-all hover:shadow-lg hover:shadow-yellow-400/20 text-center focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-blue-900"
              >
                <FileText size={18} aria-hidden="true" />
                {t('Akses Layanan', 'Access Services')}
              </Link>
              <Link
                href="/pengaduan/buat"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-7 py-3 rounded-xl hover:bg-white/20 transition-all text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
              >
                <MessageSquare size={18} aria-hidden="true" />
                {t('Buat Pengaduan', 'Submit Complaint')}
              </Link>
              <Link
                href="/cari"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-5 py-3 rounded-xl hover:bg-white/20 transition-all text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                aria-label={t('Cari layanan', 'Search services')}
              >
                <Search size={18} aria-hidden="true" />
                <span className="sm:hidden">{t('Cari', 'Search')}</span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 border-t border-white/10 pt-6">
              {QUICK_STATS.map(({ nilai, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-yellow-300">{nilai}</p>
                  <p className="text-xs text-blue-300 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kanan: Quick Action Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-3" aria-label={t('Aksi cepat', 'Quick actions')}>
            {[
              { href: '/layanan/ktp', icon: '🪪', label: 'Permohonan KTP', sub: 'e-KTP Dukcapil' },
              { href: '/cek-pajak', icon: '🏛️', label: 'Cek Pajak PBB', sub: 'Tagihan & pembayaran' },
              { href: '/layanan/antrian', icon: '📋', label: 'Antrian Digital', sub: 'Ambil nomor antrian' },
              { href: '/pengaduan/cek', icon: '🔍', label: 'Cek Pengaduan', sub: 'Status laporan Anda' },
              { href: '/pariwisata', icon: '🌴', label: 'Info Wisata', sub: 'Destinasi Gianyar' },
              { href: '/berita', icon: '📰', label: 'Berita Terkini', sub: 'Pengumuman resmi' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-yellow-400/40 rounded-xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300">
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors">{item.label}</p>
                  <p className="text-xs text-blue-300">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
