'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

export function LayananSection({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  return (
    <section aria-labelledby="layanan-heading" className="py-16 px-4 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <h2 id="layanan-heading" className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100 mb-2">
          {t('Layanan Publik Digital', 'Digital Public Services')}
        </h2>
        <p className="text-center text-gray-500 dark:text-slate-400 mb-10">
          {t('Akses layanan pemerintah dari mana saja, kapan saja', 'Access government services anywhere, anytime')}
        </p>
        {children}
        <div className="text-center mt-8">
          <Link
            href="/layanan/antrian"
            className="inline-flex items-center gap-2 border border-blue-900 dark:border-blue-400 text-blue-900 dark:text-blue-400 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            📋 {t('Ambil Nomor Antrian Digital', 'Get Digital Queue Number')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export function PariwisataSection({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  return (
    <section aria-labelledby="wisata-heading" className="py-16 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <h2 id="wisata-heading" className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100 mb-2">
          {t('Destinasi Wisata Gianyar', 'Gianyar Tourist Destinations')}
        </h2>
        <p className="text-center text-gray-500 dark:text-slate-400 mb-10">
          {t('Seni, budaya, dan alam yang memukau di jantung Bali', 'Stunning arts, culture, and nature at the heart of Bali')}
        </p>
        {children}
        <div className="text-center mt-8">
          <Link
            href="/pariwisata"
            className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            {t('Jelajahi Semua Destinasi', 'Explore All Destinations')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function BeritaSection({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  return (
    <section aria-labelledby="berita-heading" className="py-16 px-4 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <h2 id="berita-heading" className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100 mb-10">
          {t('Berita & Pengumuman', 'News & Announcements')}
        </h2>
        {children}
        <div className="text-center mt-8">
          <Link href="/berita" className="text-sm text-blue-700 dark:text-blue-400 hover:underline font-medium">
            {t('Lihat semua berita →', 'View all news →')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export function PengaduanCTA() {
  const { t } = useLang()
  return (
    <section aria-labelledby="pengaduan-cta" className="py-20 px-4 bg-gradient-to-br from-orange-500 to-red-600 text-white relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative">
        <p className="text-4xl mb-4" aria-hidden="true">📢</p>
        <h2 id="pengaduan-cta" className="text-2xl md:text-3xl font-bold mb-4">
          {t('Ada yang ingin dilaporkan?', 'Have something to report?')}
        </h2>
        <p className="text-orange-100 mb-8 max-w-xl mx-auto">
          {t(
            'Setiap laporan ditangani transparan dengan nomor tiket terlacak, notifikasi otomatis, dan respons dalam 3 hari kerja.',
            'Every report is handled transparently with a tracked ticket, auto notifications, and response within 3 business days.'
          )}
        </p>

        {/* Fitur highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-orange-100">
          {[
            t('✓ Nomor tiket terlacak', '✓ Tracked ticket number'),
            t('✓ Notifikasi otomatis', '✓ Automatic notifications'),
            t('✓ Respons dalam 3 hari', '✓ Response in 3 days'),
          ].map(f => <span key={f} className="bg-white/10 px-3 py-1 rounded-full">{f}</span>)}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pengaduan/buat"
            className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-7 py-3.5 rounded-xl font-bold hover:bg-orange-50 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
          >
            {t('Buat Pengaduan', 'Submit Complaint')}
          </Link>
          <Link
            href="/pengaduan/cek"
            className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/25 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
          >
            {t('Cek Status', 'Check Status')}
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white/80 px-7 py-3.5 rounded-xl font-medium hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
          >
            FAQ
          </Link>
        </div>
      </div>
    </section>
  )
}
