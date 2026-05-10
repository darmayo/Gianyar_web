import { Suspense } from 'react'
import type { Metadata } from 'next'
import { HeroSection } from '@/components/layout/HeroSection'
import { LayananCepat } from '@/components/beranda/LayananCepat'
import { StatistikPublik } from '@/components/beranda/StatistikPublik'
import { BeritaTerkini } from '@/components/beranda/BeritaTerkini'
import { PengumumanBanner } from '@/components/beranda/PengumumanBanner'
import { PariwisataHighlight } from '@/components/beranda/PariwisataHighlight'
import { KalenderEvent } from '@/components/beranda/KalenderEvent'
import { StatusLayanan } from '@/components/beranda/StatusLayanan'
import { LayananSection, PariwisataSection, BeritaSection, PengaduanCTA } from '@/components/beranda/BerandaSections'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Beranda',
  description:
    'Selamat datang di Portal Resmi Pemerintah Kabupaten Gianyar. Akses layanan publik, ajukan pengaduan, dan temukan informasi wisata budaya Gianyar.',
}

export default function BerandaPage() {
  return (
    <>
      <HeroSection />

      <Suspense fallback={null}>
        <PengumumanBanner />
      </Suspense>

      {/* Layanan Publik */}
      <LayananSection>
        <LayananCepat />
      </LayananSection>

      {/* Statistik Transparansi */}
      <section aria-labelledby="statistik-heading" className="py-12 px-4 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 id="statistik-heading" className="text-xl font-semibold text-center mb-8 opacity-90">
            Transparansi Layanan
          </h2>
          <Suspense fallback={<div className="h-24 animate-pulse" aria-hidden="true" />}>
            <StatistikPublik />
          </Suspense>
        </div>
      </section>

      {/* Pariwisata */}
      <PariwisataSection>
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 dark:bg-slate-800 rounded-xl" aria-hidden="true" />}>
          <PariwisataHighlight />
        </Suspense>
      </PariwisataSection>

      {/* Kalender Event Budaya */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-amber-50 dark:bg-slate-900" aria-hidden="true" />}>
        <KalenderEvent />
      </Suspense>

      {/* Berita & Pengumuman */}
      <BeritaSection>
        <Suspense fallback={<div className="h-64 animate-pulse" aria-hidden="true" />}>
          <BeritaTerkini />
        </Suspense>
      </BeritaSection>

      {/* Status Layanan Digital */}
      <StatusLayanan />

      {/* CTA Pengaduan */}
      <PengaduanCTA />
    </>
  )
}
