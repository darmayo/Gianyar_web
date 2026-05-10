import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Peta Situs — Portal Gianyar',
  description: 'Peta situs lengkap Portal Resmi Pemerintah Kabupaten Gianyar',
}

const PETA = [
  {
    kategori: 'Informasi Daerah',
    warna: 'blue',
    halaman: [
      { label: 'Beranda', href: '/' },
      { label: 'Profil Daerah', href: '/profil' },
      { label: 'Struktur Organisasi', href: '/organisasi' },
      { label: 'Berita & Pengumuman', href: '/berita' },
      { label: 'Statistik Publik', href: '/statistik' },
      { label: 'Pariwisata Gianyar', href: '/pariwisata' },
    ],
  },
  {
    kategori: 'Layanan Publik',
    warna: 'green',
    halaman: [
      { label: 'Dashboard Layanan', href: '/layanan' },
      { label: 'Formulir Pintar (Multi-Layanan)', href: '/layanan/formulir' },
      { label: 'Permohonan KTP Elektronik', href: '/layanan/ktp' },
      { label: 'Permohonan Kartu Keluarga', href: '/layanan/kk' },
      { label: 'Antrian Digital Dukcapil', href: '/layanan/antrian' },
      { label: 'Jadwal Pelayanan', href: '/layanan/jadwal' },
    ],
  },
  {
    kategori: 'Pengaduan & Aspirasi',
    warna: 'orange',
    halaman: [
      { label: 'Buat Pengaduan', href: '/pengaduan/buat' },
      { label: 'Cek Status Pengaduan', href: '/pengaduan/cek' },
      { label: 'Musrenbang Digital', href: '/musrenbang' },
    ],
  },
  {
    kategori: 'Cek & Verifikasi',
    warna: 'teal',
    halaman: [
      { label: 'Cek Pajak PBB', href: '/cek-pajak' },
      { label: 'Verifikasi Dokumen', href: '/verifikasi' },
      { label: 'Pencarian Portal', href: '/cari' },
    ],
  },
  {
    kategori: 'Darurat & Kebencanaan',
    warna: 'red',
    halaman: [
      { label: 'Kontak Darurat', href: '/darurat' },
      { label: 'BPBD & Peta Bencana', href: '/bpbd' },
    ],
  },
  {
    kategori: 'Ekonomi & Sosial',
    warna: 'amber',
    halaman: [
      { label: 'Lowongan Kerja Lokal', href: '/lowongan' },
      { label: 'Direktori UMKM', href: '/umkm' },
    ],
  },
  {
    kategori: 'Akun & Pengaturan',
    warna: 'purple',
    halaman: [
      { label: 'Akun Saya', href: '/akun/profil' },
    ],
  },
  {
    kategori: 'Informasi Legal',
    warna: 'gray',
    halaman: [
      { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
      { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
      { label: 'Pernyataan Aksesibilitas', href: '/aksesibilitas' },
      { label: 'Bug Bounty Program', href: '/bug-bounty' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Peta Situs', href: '/sitemap' },
    ],
  },
]

const WARNA_MAP: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  orange: 'bg-orange-100 text-orange-800',
  teal: 'bg-teal-100 text-teal-800',
  red: 'bg-red-100 text-red-800',
  amber: 'bg-amber-100 text-amber-800',
  purple: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-700',
}

export default function SitemapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Peta Situs</h1>
      <p className="text-gray-500 mb-8">Daftar lengkap seluruh halaman Portal Kabupaten Gianyar</p>

      <div className="grid sm:grid-cols-2 gap-6">
        {PETA.map(k => (
          <div key={k.kategori} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className={`px-5 py-3 ${WARNA_MAP[k.warna]}`}>
              <h2 className="font-bold text-sm">{k.kategori}</h2>
            </div>
            <ul className="divide-y divide-gray-50">
              {k.halaman.map(h => (
                <li key={h.href}>
                  <Link href={h.href}
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition group">
                    <span className="text-sm text-gray-700 group-hover:text-blue-700">{h.label}</span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        Portal Resmi Pemerintah Kabupaten Gianyar · Dikelola Dinas Kominfo Gianyar
      </div>
    </div>
  )
}
