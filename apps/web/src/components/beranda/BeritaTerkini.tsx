'use client'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const KATEGORI_WARNA: Record<string, string> = {
  Pengumuman: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  Announcement: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  Budaya: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
  Culture: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
  Infrastruktur: 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300',
  Infrastructure: 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300',
}

const GRADIENT: Record<number, string> = {
  1: 'from-blue-600 to-indigo-700',
  2: 'from-purple-600 to-pink-700',
  3: 'from-orange-500 to-red-600',
}

export function BeritaTerkini() {
  const { t } = useLang()

  const BERITA = [
    {
      id: 1,
      judul: t('Pemkab Gianyar Luncurkan Program Digitalisasi Layanan Publik', 'Gianyar Regency Launches Public Service Digitalization Program'),
      ringkasan: t('Program ini mencakup digitalisasi 12 jenis layanan kependudukan yang dapat diakses dari rumah.', 'This program covers digitalization of 12 civil service types accessible from home.'),
      tanggal: '2 April 2026',
      kategori: t('Pengumuman', 'Announcement'),
      href: '/berita/1',
    },
    {
      id: 2,
      judul: t('Festival Seni Ubud 2026 Resmi Dibuka, Dihadiri Ribuan Wisatawan', 'Ubud Arts Festival 2026 Officially Opened, Attended by Thousands of Tourists'),
      ringkasan: t('Festival selama 5 hari menampilkan 120 penampilan seni dari seluruh Indonesia dan mancanegara.', '5-day festival featuring 120 art performances from across Indonesia and abroad.'),
      tanggal: '1 April 2026',
      kategori: t('Budaya', 'Culture'),
      href: '/berita/2',
    },
    {
      id: 3,
      judul: t('Pembangunan Jalan Raya Tegallalang Selesai Tepat Waktu', 'Tegallalang Highway Construction Completed on Schedule'),
      ringkasan: t('Proyek senilai Rp 4,2 miliar ini meningkatkan konektivitas wilayah wisata Tegallalang.', 'The Rp 4.2 billion project improves connectivity for the Tegallalang tourist area.'),
      tanggal: '30 Maret 2026',
      kategori: t('Infrastruktur', 'Infrastructure'),
      href: '/berita/3',
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {BERITA.map((b) => (
        <article key={b.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          {/* Gambar/Header */}
          <div className={`h-44 bg-gradient-to-br ${GRADIENT[b.id]} relative flex items-end p-4`}>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              aria-hidden="true" />
            <span className={`relative text-xs font-semibold px-2.5 py-1 rounded-full ${KATEGORI_WARNA[b.kategori] ?? 'bg-white/20 text-white'}`}>
              {b.kategori}
            </span>
          </div>

          <div className="p-5">
            <h2 className="font-bold text-gray-900 dark:text-slate-100 leading-snug line-clamp-2 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              <Link href={b.href} className="focus:outline-none focus:underline">{b.judul}</Link>
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4">{b.ringkasan}</p>
            <div className="flex items-center justify-between">
              <time className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                <Calendar size={12} aria-hidden="true" />
                {b.tanggal}
              </time>
              <Link href={b.href}
                className="flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline focus:outline-none focus:underline"
                aria-label={`Baca selengkapnya: ${b.judul}`}>
                {t('Selengkapnya', 'Read more')}
                <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
