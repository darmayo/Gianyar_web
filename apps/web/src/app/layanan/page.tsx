'use client'

import Link from 'next/link'
import {
  CreditCard, Users, BookOpen, Landmark, Heart,
  FileText, Briefcase, MapPin, Zap, ClipboardList,
  ArrowRight, Phone, Building2, Search
} from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

// ── Konfigurasi kartu layanan utama ──────────────────────────

const LAYANAN_UTAMA = [
  {
    href: '/layanan/ktp',
    label: 'KTP Elektronik',
    labelEn: 'Electronic ID Card',
    sub: 'Perekaman & penggantian e-KTP',
    subEn: 'e-ID recording & replacement',
    icon: <CreditCard size={28} />,
    bg: 'bg-blue-50', border: 'border-blue-200',
    text: 'text-blue-900', badge: 'bg-blue-100 text-blue-700',
    badgeLabel: '5 hari kerja',
    badgeLabelEn: '5 working days',
    cta: 'Ajukan KTP',
    ctaEn: 'Apply for ID',
  },
  {
    href: '/layanan/kk',
    label: 'Kartu Keluarga',
    labelEn: 'Family Card',
    sub: 'Buat, ubah, atau ganti KK',
    subEn: 'Create, update, or replace family card',
    icon: <Users size={28} />,
    bg: 'bg-green-50', border: 'border-green-200',
    text: 'text-green-900', badge: 'bg-green-100 text-green-700',
    badgeLabel: '5 hari kerja',
    badgeLabelEn: '5 working days',
    cta: 'Ajukan KK',
    ctaEn: 'Apply for Family Card',
  },
  {
    href: '/layanan/formulir?jenis=AKTA_LAHIR',
    label: 'Akta Kelahiran',
    labelEn: 'Birth Certificate',
    sub: 'Pendaftaran dan penerbitan akta',
    subEn: 'Registration and certificate issuance',
    icon: <BookOpen size={28} />,
    bg: 'bg-purple-50', border: 'border-purple-200',
    text: 'text-purple-900', badge: 'bg-purple-100 text-purple-700',
    badgeLabel: '3 hari kerja',
    badgeLabelEn: '3 working days',
    cta: 'Daftarkan',
    ctaEn: 'Register',
  },
  {
    href: '/layanan/formulir?jenis=PERIZINAN',
    label: 'Perizinan & IMB',
    labelEn: 'Permits & Building Permit',
    sub: 'IMB, izin usaha, izin pariwisata',
    subEn: 'Building, business, and tourism permits',
    icon: <Landmark size={28} />,
    bg: 'bg-slate-50', border: 'border-slate-200',
    text: 'text-slate-900', badge: 'bg-slate-100 text-slate-700',
    badgeLabel: '7 hari kerja',
    badgeLabelEn: '7 working days',
    cta: 'Ajukan Izin',
    ctaEn: 'Apply for Permit',
  },
  {
    href: '/pengaduan/buat',
    label: 'Pengaduan Masyarakat',
    labelEn: 'Public Complaint',
    sub: 'Laporkan masalah & keluhan',
    subEn: 'Report issues and complaints',
    icon: <ClipboardList size={28} />,
    bg: 'bg-orange-50', border: 'border-orange-200',
    text: 'text-orange-900', badge: 'bg-orange-100 text-orange-700',
    badgeLabel: '3–7 hari kerja',
    badgeLabelEn: '3-7 working days',
    cta: 'Buat Laporan',
    ctaEn: 'Submit Report',
  },
  {
    href: '/layanan/formulir?jenis=BANSOS',
    label: 'Bantuan Sosial',
    labelEn: 'Social Assistance',
    sub: 'Cek status & daftar bansos',
    subEn: 'Check status and apply for aid',
    icon: <Heart size={28} />,
    bg: 'bg-rose-50', border: 'border-rose-200',
    text: 'text-rose-900', badge: 'bg-rose-100 text-rose-700',
    badgeLabel: '7 hari kerja',
    badgeLabelEn: '7 working days',
    cta: 'Cek Bansos',
    ctaEn: 'Check Aid',
  },
]

const LAYANAN_TAMBAHAN = [
  {
    href: '/cek-pajak',
    label: 'Cek Pajak Daerah (PBB)',
    labelEn: 'Property Tax Check',
    sub: 'Cek tagihan & unduh SPPT',
    subEn: 'Check bills and download SPPT',
    icon: <FileText size={22} />,
    accent: 'text-teal-700', bg: 'bg-teal-50 border-teal-100',
    badge: 'Instan',
    badgeEn: 'Instant',
  },
  {
    href: '/lowongan',
    label: 'Lowongan Kerja Lokal',
    labelEn: 'Local Job Vacancies',
    sub: 'Info kerja dari perusahaan di Gianyar',
    subEn: 'Jobs from companies in Gianyar',
    icon: <Briefcase size={22} />,
    accent: 'text-amber-700', bg: 'bg-amber-50 border-amber-100',
    badge: 'Terkini',
    badgeEn: 'Latest',
  },
  {
    href: '/bpbd',
    label: 'Peta Bencana & Darurat (BPBD)',
    labelEn: 'Disaster & Emergency Map (BPBD)',
    sub: 'Status kejadian bencana real-time',
    subEn: 'Real-time disaster status',
    icon: <MapPin size={22} />,
    accent: 'text-red-700', bg: 'bg-red-50 border-red-100',
    badge: 'Live',
    badgeEn: 'Live',
  },
  {
    href: '/umkm',
    label: 'Direktori Vendor / UMKM',
    labelEn: 'SME / Vendor Directory',
    sub: 'Pengrajin & UMKM asli Gianyar',
    subEn: 'Local Gianyar craftsmen and SMEs',
    icon: <Building2 size={22} />,
    accent: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-100',
    badge: '6 UMKM',
    badgeEn: '6 SMEs',
  },
  {
    href: '/layanan/antrian',
    label: 'Antrian Digital',
    labelEn: 'Digital Queue',
    sub: 'Ambil nomor antre dari rumah',
    subEn: 'Get queue number from home',
    icon: <Zap size={22} />,
    accent: 'text-blue-700', bg: 'bg-blue-50 border-blue-100',
    badge: 'Online',
    badgeEn: 'Online',
  },
  {
    href: '/layanan/jadwal',
    label: 'Jadwal Pelayanan',
    labelEn: 'Service Schedule',
    sub: 'Jam buka semua unit layanan',
    subEn: 'Opening hours for all service units',
    icon: <Phone size={22} />,
    accent: 'text-gray-700', bg: 'bg-gray-50 border-gray-100',
    badge: 'Info',
    badgeEn: 'Info',
  },
]

const AKSI_CEPAT = [
  { href:'/layanan/antrian', label:'Ambil Antrian', labelEn:'Get Queue', icon:<Zap size={16} />, color:'bg-blue-900 hover:bg-blue-800' },
  { href:'/pengaduan/cek', label:'Cek Status', labelEn:'Check Status', icon:<Search size={16} />, color:'bg-green-700 hover:bg-green-800' },
  { href:'/layanan/jadwal', label:'Jadwal Buka', labelEn:'Opening Hours', icon:<Phone size={16} />, color:'bg-slate-700 hover:bg-slate-800' },
  { href:'/layanan/formulir', label:'Formulir Pintar', labelEn:'Smart Forms', icon:<FileText size={16} />, color:'bg-amber-600 hover:bg-amber-700' },
]

export default function LayananPage() {
  const { t } = useLang()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t('Dashboard Layanan Terpadu', 'Integrated Services Dashboard')}</h1>
        <p className="text-gray-500 dark:text-slate-400">
          {t('Semua layanan publik Pemerintah Kabupaten Gianyar dalam satu portal.', 'All Gianyar Regency public services in one portal.')}
        </p>
      </div>

      {/* ── Aksi Cepat ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {AKSI_CEPAT.map((a) => (
          <Link key={a.href} href={a.href}
            className={`flex items-center gap-2 ${a.color} text-white px-4 py-2 rounded-full text-sm font-medium transition`}>
            {a.icon} {t(a.label, a.labelEn)}
          </Link>
        ))}
      </div>

      {/* ── Layanan Utama (Kependudukan & Sipil) ──────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-5 flex items-center gap-2">
          <CreditCard size={20} className="text-blue-700" aria-hidden="true" />
          {t('Layanan Kependudukan & Sipil', 'Civil Registry Services')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LAYANAN_UTAMA.map((l) => (
            <Link key={l.href} href={l.href}
              className={`group block border rounded-2xl p-5 ${l.bg} dark:bg-slate-800 ${l.border} dark:border-slate-700 hover:shadow-md transition`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`${l.text}`}>{l.icon}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${l.badge}`}>
                  {t(l.badgeLabel, l.badgeLabelEn)}
                </span>
              </div>
              <h3 className={`font-bold text-base ${l.text} dark:text-slate-100 mb-0.5`}>{t(l.label, l.labelEn)}</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">{t(l.sub, l.subEn)}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${l.text} group-hover:underline`}>
                {t(l.cta, l.ctaEn)} <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Layanan Tambahan ───────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-5 flex items-center gap-2">
          <Zap size={20} className="text-amber-600" aria-hidden="true" />
          {t('Layanan & Informasi Tambahan', 'Additional Services & Information')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LAYANAN_TAMBAHAN.map((l) => (
            <Link key={l.href} href={l.href}
              className={`group flex items-center gap-4 border rounded-xl p-4 ${l.bg} dark:bg-slate-800 dark:border-slate-700 hover:shadow-sm transition`}>
              <span className={`flex-shrink-0 ${l.accent}`}>{l.icon}</span>
              <div className="min-w-0">
                <p className={`font-semibold text-sm ${l.accent} dark:text-slate-100 truncate`}>{t(l.label, l.labelEn)}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">{t(l.sub, l.subEn)}</p>
              </div>
              <span className="ml-auto text-xs bg-white/70 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                {t(l.badge, l.badgeEn)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Banner Formulir Pintar ─────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold mb-1">{t('Formulir Pintar (Dynamic Form)', 'Smart Forms')}</h2>
          <p className="text-blue-200 text-sm">
            {t('Satu formulir untuk semua layanan. Pilih jenis layanan — kolom berubah otomatis.', 'One form for all services. Choose a service type and fields update automatically.')}
          </p>
        </div>
        <Link href="/layanan/formulir"
          className="flex-shrink-0 flex items-center gap-2 bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition">
          {t('Buka Formulir', 'Open Form')} <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Info Kontak ────────────────────────────────────── */}
      <div className="mt-8 text-center text-sm text-gray-400 dark:text-slate-500">
        {t('Butuh bantuan? Hubungi', 'Need help? Call')}{' '}
        <a href="tel:03619430001" className="text-blue-700 font-medium hover:underline">(0361) 943001</a>
        {' '}{t('atau WhatsApp', 'or WhatsApp')}{' '}
        <a href="https://wa.me/6236194300001" className="text-blue-700 font-medium hover:underline">{t('chat langsung', 'live chat')}</a>
      </div>
    </div>
  )
}
