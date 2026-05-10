'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const PATH_LABELS: Record<string, string> = {
  profil: 'Profil Daerah',
  pimpinan: 'Pimpinan Daerah',
  organisasi: 'Struktur Organisasi',
  'produk-hukum': 'Produk Hukum',
  layanan: 'Layanan Publik',
  formulir: 'Formulir Pintar',
  ktp: 'Permohonan KTP',
  kk: 'Kartu Keluarga',
  antrian: 'Antrian Digital',
  jadwal: 'Jadwal Layanan',
  pengaduan: 'Pengaduan',
  buat: 'Buat Pengaduan',
  cek: 'Cek Status',
  'cek-pajak': 'Cek Pajak PBB',
  berita: 'Berita & Pengumuman',
  pariwisata: 'Pariwisata',
  statistik: 'Statistik Publik',
  transparansi: 'Transparansi APBD',
  'satu-data': 'Satu Data',
  peta: 'Peta Digital',
  partisipasi: 'Partisipasi Publik',
  musrenbang: 'Musrenbang',
  umkm: 'Direktori UMKM',
  lowongan: 'Lowongan Kerja',
  karier: 'Karier & Relawan',
  bpbd: 'BPBD',
  darurat: 'Layanan Darurat',
  verifikasi: 'Verifikasi Dokumen',
  faq: 'FAQ',
  'bug-bounty': 'Bug Bounty',
  aksesibilitas: 'Aksesibilitas',
  'kebijakan-privasi': 'Kebijakan Privasi',
  'syarat-ketentuan': 'Syarat & Ketentuan',
  sitemap: 'Peta Situs',
  akun: 'Akun',
  profil_akun: 'Profil Saya',
  investasi: 'Investasi & Bisnis',
  'smart-city': 'Smart City',
  kesehatan: 'Kesehatan Publik',
}

export function Breadcrumb() {
  const pathname = usePathname()
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    const label = PATH_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
    return { href, label }
  })

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <ol className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 flex-wrap">
          <li>
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <Home size={12} aria-hidden /> <span className="sr-only">Beranda</span>
            </Link>
          </li>
          {crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-1">
              <ChevronRight size={11} className="text-gray-300 dark:text-slate-600 flex-shrink-0" aria-hidden />
              {i === crumbs.length - 1 ? (
                <span className="text-gray-700 dark:text-slate-200 font-medium" aria-current="page">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition">{crumb.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
