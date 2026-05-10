'use client'
import Link from 'next/link'
import { Users, Baby, Building2, AlertCircle, Heart, CreditCard } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

export function LayananCepat() {
  const { t } = useLang()

  const LAYANAN = [
    {
      icon: CreditCard,
      label: t('KTP', 'ID Card'),
      sub: t('e-KTP Dukcapil', 'e-ID Dukcapil'),
      href: '/layanan/ktp',
      color: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      icon: Users,
      label: t('Kartu Keluarga', 'Family Card'),
      sub: t('Buat/update KK', 'Create/update'),
      href: '/layanan/kk',
      color: 'from-green-500 to-green-700',
      bg: 'bg-green-50 dark:bg-green-950',
    },
    {
      icon: Baby,
      label: t('Akta Lahir', 'Birth Certificate'),
      sub: t('Kelahiran & kematian', 'Birth & death'),
      href: '/layanan/formulir?jenis=AKTA_LAHIR',
      color: 'from-purple-500 to-purple-700',
      bg: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      icon: Building2,
      label: t('Perizinan', 'Permits'),
      sub: t('Izin usaha & bangunan', 'Business & building'),
      href: '/layanan/perizinan',
      color: 'from-orange-500 to-orange-700',
      bg: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      icon: AlertCircle,
      label: t('Pengaduan', 'Complaint'),
      sub: t('SP4N-LAPOR Gianyar', 'SP4N-LAPOR'),
      href: '/pengaduan/buat',
      color: 'from-red-500 to-red-700',
      bg: 'bg-red-50 dark:bg-red-950',
    },
    {
      icon: Heart,
      label: t('Bantuan Sosial', 'Social Aid'),
      sub: t('PKH, BPNT & bansos', 'PKH, BPNT & aid'),
      href: '/layanan/formulir?jenis=BANSOS',
      color: 'from-pink-500 to-pink-700',
      bg: 'bg-pink-50 dark:bg-pink-950',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {LAYANAN.map(({ icon: Icon, label, sub, href, color, bg }) => (
        <Link
          key={href}
          href={href}
          className={`group flex flex-col items-center gap-3 p-4 md:p-5 ${bg} rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <div className={`w-13 h-13 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}
            style={{ width: '3.25rem', height: '3.25rem' }}>
            <Icon size={22} aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 leading-tight">{label}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-tight">{sub}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
