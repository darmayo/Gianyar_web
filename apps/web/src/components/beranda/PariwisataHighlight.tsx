'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

// Data statis (slug, emoji, warna) — teks diterjemahkan via kamus
const DEST_DEFS = [
  {
    id: 'ubud',
    slug: 'ubud',
    tKey: 'ubud',
    emoji: '🎭',
    gradient: 'from-emerald-400 to-teal-600',
    tag: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  },
  {
    id: 'tegallalang',
    slug: 'tegallalang',
    tKey: 'tegallalang',
    emoji: '🌾',
    gradient: 'from-lime-400 to-green-600',
    tag: 'bg-lime-100 text-lime-700 dark:bg-lime-900/60 dark:text-lime-300',
  },
  {
    id: 'goa-gajah',
    slug: 'goa-gajah',
    tKey: 'goa_gajah',
    emoji: '🐘',
    gradient: 'from-amber-400 to-orange-600',
    tag: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  },
  {
    id: 'tirta-empul',
    slug: 'tirta-empul',
    tKey: 'tirta_empul',
    emoji: '💧',
    gradient: 'from-blue-400 to-cyan-600',
    tag: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  },
]

export function PariwisataHighlight() {
  const { t } = useLang()

  const destinasi = DEST_DEFS.map(d => ({
    ...d,
    nama:     t(`pariwisata.${d.tKey}_nama`),
    kategori: t(`pariwisata.${d.tKey}_kategori`),
    deskripsi:t(`pariwisata.${d.tKey}_deskripsi`),
  }))

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {destinasi.map((d) => (
        <Link
          key={d.id}
          href={`/pariwisata/${d.slug}`}
          className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {/* Hero image placeholder */}
          <div className={`h-40 bg-gradient-to-br ${d.gradient} flex flex-col items-center justify-center relative overflow-hidden`}
            aria-label={`${d.nama}`}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}
              aria-hidden="true" />
            <span className="text-5xl mb-1 group-hover:scale-110 transition-transform duration-300 relative z-10"
              aria-hidden="true">
              {d.emoji}
            </span>
            <span className="text-white/80 text-xs font-medium relative z-10">{d.nama}</span>
          </div>

          <div className="p-4">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${d.tag}`}>
              {d.kategori}
            </span>
            <h3 className="font-bold text-gray-800 dark:text-slate-100 mt-2 mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {d.nama}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{d.deskripsi}</p>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3 group-hover:underline">
              {t('pariwisata.jelajahi')}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
