'use client'
import { useLang } from '@/contexts/LanguageContext'

export function StatistikPublik() {
  const { t } = useLang()

  const STATS = [
    { id: 'ls', nilai: '12.847', label: t('statistik.layanan_selesai'), sublabel: t('statistik.layanan_selesai_sub'), icon: '✅' },
    { id: 'pd', nilai: '3.291', label: t('statistik.pengaduan_ditangani'), sublabel: t('statistik.pengaduan_ditangani_sub'), icon: '📢' },
    { id: 'kp', nilai: '94%', label: t('statistik.kepuasan'), sublabel: t('statistik.kepuasan_sub'), icon: '⭐' },
    { id: 'rp', nilai: '5,2 Hari', label: t('statistik.penyelesaian'), sublabel: t('statistik.penyelesaian_sub'), icon: '⏱️' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {STATS.map(({ id, nilai, label, sublabel, icon }) => (
        <div key={id}
          className="text-center p-4 md:p-5 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors">
          <p className="text-2xl mb-2" aria-hidden="true">{icon}</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-300">{nilai}</p>
          <p className="font-semibold text-white mt-1 text-sm md:text-base">{label}</p>
          <p className="text-xs text-blue-300 mt-0.5">{sublabel}</p>
        </div>
      ))}
    </div>
  )
}
