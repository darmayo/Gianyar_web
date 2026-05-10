import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CreditCard, Users, BookOpen, Landmark, Heart,
  FileText, Briefcase, MapPin, Zap, ClipboardList,
  ArrowRight, Phone, Building2, Search
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Layanan Publik — Portal Gianyar',
  description: 'Dashboard layanan terpadu Pemerintah Kabupaten Gianyar: KTP, KK, Akta, Bansos, Perizinan, Pajak, dan lebih.',
}

// ── Konfigurasi kartu layanan utama ──────────────────────────

const LAYANAN_UTAMA = [
  {
    href: '/layanan/ktp',
    label: 'KTP Elektronik',
    sub: 'Perekaman & penggantian e-KTP',
    icon: <CreditCard size={28} />,
    bg: 'bg-blue-50', border: 'border-blue-200',
    text: 'text-blue-900', badge: 'bg-blue-100 text-blue-700',
    badgeLabel: '5 hari kerja',
    cta: 'Ajukan KTP',
  },
  {
    href: '/layanan/kk',
    label: 'Kartu Keluarga',
    sub: 'Buat, ubah, atau ganti KK',
    icon: <Users size={28} />,
    bg: 'bg-green-50', border: 'border-green-200',
    text: 'text-green-900', badge: 'bg-green-100 text-green-700',
    badgeLabel: '5 hari kerja',
    cta: 'Ajukan KK',
  },
  {
    href: '/layanan/formulir?jenis=AKTA_LAHIR',
    label: 'Akta Kelahiran',
    sub: 'Pendaftaran dan penerbitan akta',
    icon: <BookOpen size={28} />,
    bg: 'bg-purple-50', border: 'border-purple-200',
    text: 'text-purple-900', badge: 'bg-purple-100 text-purple-700',
    badgeLabel: '3 hari kerja',
    cta: 'Daftarkan',
  },
  {
    href: '/layanan/formulir?jenis=PERIZINAN',
    label: 'Perizinan & IMB',
    sub: 'IMB, izin usaha, izin pariwisata',
    icon: <Landmark size={28} />,
    bg: 'bg-slate-50', border: 'border-slate-200',
    text: 'text-slate-900', badge: 'bg-slate-100 text-slate-700',
    badgeLabel: '7 hari kerja',
    cta: 'Ajukan Izin',
  },
  {
    href: '/pengaduan/buat',
    label: 'Pengaduan Masyarakat',
    sub: 'Laporkan masalah & keluhan',
    icon: <ClipboardList size={28} />,
    bg: 'bg-orange-50', border: 'border-orange-200',
    text: 'text-orange-900', badge: 'bg-orange-100 text-orange-700',
    badgeLabel: '3–7 hari kerja',
    cta: 'Buat Laporan',
  },
  {
    href: '/layanan/formulir?jenis=BANSOS',
    label: 'Bantuan Sosial',
    sub: 'Cek status & daftar bansos',
    icon: <Heart size={28} />,
    bg: 'bg-rose-50', border: 'border-rose-200',
    text: 'text-rose-900', badge: 'bg-rose-100 text-rose-700',
    badgeLabel: '7 hari kerja',
    cta: 'Cek Bansos',
  },
]

const LAYANAN_TAMBAHAN = [
  {
    href: '/cek-pajak',
    label: 'Cek Pajak Daerah (PBB)',
    sub: 'Cek tagihan & unduh SPPT',
    icon: <FileText size={22} />,
    accent: 'text-teal-700', bg: 'bg-teal-50 border-teal-100',
    badge: 'Instan',
  },
  {
    href: '/lowongan',
    label: 'Lowongan Kerja Lokal',
    sub: 'Info kerja dari perusahaan di Gianyar',
    icon: <Briefcase size={22} />,
    accent: 'text-amber-700', bg: 'bg-amber-50 border-amber-100',
    badge: 'Terkini',
  },
  {
    href: '/bpbd',
    label: 'Peta Bencana & Darurat (BPBD)',
    sub: 'Status kejadian bencana real-time',
    icon: <MapPin size={22} />,
    accent: 'text-red-700', bg: 'bg-red-50 border-red-100',
    badge: 'Live',
  },
  {
    href: '/umkm',
    label: 'Direktori Vendor / UMKM',
    sub: 'Pengrajin & UMKM asli Gianyar',
    icon: <Building2 size={22} />,
    accent: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-100',
    badge: '6 UMKM',
  },
  {
    href: '/layanan/antrian',
    label: 'Antrian Digital',
    sub: 'Ambil nomor antre dari rumah',
    icon: <Zap size={22} />,
    accent: 'text-blue-700', bg: 'bg-blue-50 border-blue-100',
    badge: 'Online',
  },
  {
    href: '/layanan/jadwal',
    label: 'Jadwal Pelayanan',
    sub: 'Jam buka semua unit layanan',
    icon: <Phone size={22} />,
    accent: 'text-gray-700', bg: 'bg-gray-50 border-gray-100',
    badge: 'Info',
  },
]

const AKSI_CEPAT = [
  { href:'/layanan/antrian', label:'Ambil Antrian', icon:<Zap size={16} />, color:'bg-blue-900 hover:bg-blue-800' },
  { href:'/pengaduan/cek', label:'Cek Status', icon:<Search size={16} />, color:'bg-green-700 hover:bg-green-800' },
  { href:'/layanan/jadwal', label:'Jadwal Buka', icon:<Phone size={16} />, color:'bg-slate-700 hover:bg-slate-800' },
  { href:'/layanan/formulir', label:'Formulir Pintar', icon:<FileText size={16} />, color:'bg-amber-600 hover:bg-amber-700' },
]

export default function LayananPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Layanan Terpadu</h1>
        <p className="text-gray-500">
          Semua layanan publik Pemerintah Kabupaten Gianyar dalam satu portal.
        </p>
      </div>

      {/* ── Aksi Cepat ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {AKSI_CEPAT.map((a) => (
          <Link key={a.href} href={a.href}
            className={`flex items-center gap-2 ${a.color} text-white px-4 py-2 rounded-full text-sm font-medium transition`}>
            {a.icon} {a.label}
          </Link>
        ))}
      </div>

      {/* ── Layanan Utama (Kependudukan & Sipil) ──────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <CreditCard size={20} className="text-blue-700" aria-hidden="true" />
          Layanan Kependudukan & Sipil
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LAYANAN_UTAMA.map((l) => (
            <Link key={l.href} href={l.href}
              className={`group block border rounded-2xl p-5 ${l.bg} ${l.border} hover:shadow-md transition`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`${l.text}`}>{l.icon}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${l.badge}`}>
                  {l.badgeLabel}
                </span>
              </div>
              <h3 className={`font-bold text-base ${l.text} mb-0.5`}>{l.label}</h3>
              <p className="text-xs text-gray-500 mb-4">{l.sub}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${l.text} group-hover:underline`}>
                {l.cta} <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Layanan Tambahan ───────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Zap size={20} className="text-amber-600" aria-hidden="true" />
          Layanan & Informasi Tambahan
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LAYANAN_TAMBAHAN.map((l) => (
            <Link key={l.href} href={l.href}
              className={`group flex items-center gap-4 border rounded-xl p-4 ${l.bg} hover:shadow-sm transition`}>
              <span className={`flex-shrink-0 ${l.accent}`}>{l.icon}</span>
              <div className="min-w-0">
                <p className={`font-semibold text-sm ${l.accent} truncate`}>{l.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{l.sub}</p>
              </div>
              <span className="ml-auto text-xs bg-white/70 text-gray-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                {l.badge}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Banner Formulir Pintar ─────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold mb-1">Formulir Pintar (Dynamic Form)</h2>
          <p className="text-blue-200 text-sm">
            Satu formulir untuk semua layanan. Pilih jenis layanan — kolom berubah otomatis.
          </p>
        </div>
        <Link href="/layanan/formulir"
          className="flex-shrink-0 flex items-center gap-2 bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition">
          Buka Formulir <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Info Kontak ────────────────────────────────────── */}
      <div className="mt-8 text-center text-sm text-gray-400">
        Butuh bantuan? Hubungi{' '}
        <a href="tel:03619430001" className="text-blue-700 font-medium hover:underline">(0361) 943001</a>
        {' '}atau WhatsApp{' '}
        <a href="https://wa.me/6236194300001" className="text-blue-700 font-medium hover:underline">chat langsung</a>
      </div>
    </div>
  )
}
