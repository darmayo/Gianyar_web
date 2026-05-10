'use client'
import { useState } from 'react'
import { Calendar, Tag, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const kategoriColor: Record<string, string> = {
  Pemerintahan:'bg-blue-100 text-blue-700', Prestasi:'bg-yellow-100 text-yellow-700',
  Pengumuman:'bg-red-100 text-red-700', Budaya:'bg-purple-100 text-purple-700',
  UMKM:'bg-green-100 text-green-700', Infrastruktur:'bg-gray-100 text-gray-700',
}

const ctaColor: Record<string, string> = {
  yellow:'bg-yellow-400 text-blue-900 hover:bg-yellow-300',
  blue:'bg-blue-700 text-white hover:bg-blue-600',
  green:'bg-green-700 text-white hover:bg-green-600',
  purple:'bg-purple-700 text-white hover:bg-purple-600',
}

function ArticleRating(_: { id: number }) {
  const { t } = useLang()
  const [vote, setVote] = useState<'up'|'down'|null>(null)
  if (vote) return (
    <p className="text-xs text-green-600 font-medium mt-3">{t('Terima kasih atas masukan Anda!', 'Thank you for your feedback!')}</p>
  )
  return (
    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
      <span className="text-xs text-gray-400 dark:text-slate-400">{t('Apakah informasi ini membantu?', 'Was this information helpful?')}</span>
      <button onClick={() => setVote('up')} aria-label={t('Ya, membantu', 'Yes, helpful')}
        className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 hover:text-green-600 transition px-2 py-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30">
        <ThumbsUp size={13} /> {t('Ya', 'Yes')}
      </button>
      <button onClick={() => setVote('down')} aria-label={t('Tidak membantu', 'Not helpful')}
        className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
        <ThumbsDown size={13} /> {t('Tidak', 'No')}
      </button>
    </div>
  )
}

export default function BeritaPage() {
  const { t } = useLang()

  const BERITA = [
    {
      id:1, judul: t('Bupati Gianyar Resmikan Sistem Antrian Digital Dukcapil', 'Gianyar Regent Inaugurates Digital Queue System for Civil Registry'),
      tanggal:'2 Apr 2026', kategori: t('Pemerintahan', 'Government'),
      ringkasan: t('Pemkab Gianyar resmi meluncurkan sistem antrian digital untuk pelayanan kependudukan, memungkinkan warga mendaftar dari rumah tanpa harus antre panjang di kantor.', 'Gianyar Regency officially launched a digital queue system for population services, allowing residents to register from home without long queues at the office.'),
      penulis: t('Humas Pemkab Gianyar', 'Gianyar Regency Public Relations'), highlight:true,
      cta: { label: t('Coba Antrian Digital Sekarang →', 'Try Digital Queue Now →'), href:'/layanan/antrian', color:'yellow' },
    },
    {
      id:2, judul: t('Gianyar Raih Penghargaan Kota Layak Anak Utama 2026', 'Gianyar Wins 2026 Prime Child-Friendly City Award'),
      tanggal:'30 Mar 2026', kategori: t('Prestasi', 'Achievement'),
      ringkasan: t('Kabupaten Gianyar menerima penghargaan Kota Layak Anak (KLA) kategori Utama dari Kementerian PPPA atas komitmen perlindungan dan pemenuhan hak anak.', 'Gianyar Regency received the Prime Child-Friendly City (KLA) award from the Ministry of Women Empowerment and Child Protection for its commitment to child protection and rights.'),
      penulis: t('Diskominfo Gianyar', 'Gianyar Diskominfo'), highlight:true,
      cta: null,
    },
    {
      id:3, judul: t('Jadwal Operasi Pasar Murah Ramadan 2026 di 7 Kecamatan', 'Ramadan 2026 Affordable Market Operation Schedule in 7 Districts'),
      tanggal:'25 Mar 2026', kategori: t('Pengumuman', 'Announcement'),
      ringkasan: t('Pemkab Gianyar menggelar operasi pasar murah selama Ramadan 2026 di seluruh kecamatan. Berikut jadwal dan lokasi lengkap operasi pasar murah.', 'Gianyar Regency is holding affordable market operations throughout Ramadan 2026 in all districts. Here is the full schedule and locations.'),
      penulis: t('Disperindag Gianyar', 'Gianyar Disperindag'), highlight:false,
      cta: null,
    },
    {
      id:4, judul: t('Festival Ubud Writers & Readers 2026 Dibuka Resmi', 'Ubud Writers & Readers Festival 2026 Officially Opened'),
      tanggal:'20 Mar 2026', kategori: t('Budaya', 'Culture'),
      ringkasan: t('Festival literatur internasional tahunan kembali digelar, menampilkan lebih dari 200 penulis dari 30 negara. Pendaftaran relawan masih dibuka.', 'The annual international literary festival returns, featuring over 200 writers from 30 countries. Volunteer registration is still open.'),
      penulis: t('Dinas Pariwisata', 'Tourism Office'), highlight:false,
      cta: { label: t('Daftar Jadi Relawan Festival →', 'Register as Festival Volunteer →'), href:'/karier', color:'purple' },
    },
    {
      id:5, judul: t('Pemkab Gianyar Luncurkan Program Beasiswa UMKM Digital 2026', 'Gianyar Regency Launches 2026 Digital UMKM Scholarship Program'),
      tanggal:'15 Mar 2026', kategori:'UMKM',
      ringkasan: t('Program pelatihan digital gratis untuk pelaku UMKM mencakup pemasaran online, e-commerce, dan literasi keuangan digital.', 'Free digital training program for UMKM actors covering online marketing, e-commerce, and digital financial literacy.'),
      penulis: t('Diskoperindag Gianyar', 'Gianyar Diskoperindag'), highlight:false,
      cta: { label: t('Lihat Direktori UMKM Gianyar →', 'View Gianyar UMKM Directory →'), href:'/umkm', color:'green' },
    },
    {
      id:6, judul: t('Perbaikan Jalan Raya Tampaksiring–Kintamani Dimulai April', 'Tampaksiring–Kintamani Highway Repair Begins in April'),
      tanggal:'10 Mar 2026', kategori: t('Infrastruktur', 'Infrastructure'),
      ringkasan: t('Proyek perbaikan jalan nasional sepanjang 12 km akan dimulai April 2026. Pengguna jalan diimbau menggunakan jalur alternatif.', 'The 12 km national road repair project will begin in April 2026. Road users are advised to use alternative routes.'),
      penulis: t('Dinas PUPR Gianyar', 'Gianyar PUPR Office'), highlight:false,
      cta: { label: t('Pantau di Peta Digital →', 'View on Digital Map →'), href:'/peta', color:'blue' },
    },
  ]

  const [head, ...rest] = BERITA.filter(b => b.highlight)
  const biasa = BERITA.filter(b => !b.highlight)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t('Berita & Pengumuman', 'News & Announcements')}</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">{t('Informasi terkini dari Pemerintah Kabupaten Gianyar', 'Latest information from the Gianyar Regency Government')}</p>

      {/* Highlight utama */}
      {head && (
        <article className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-6 mb-8 shadow-lg">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 mb-3 inline-block">{head.kategori}</span>
          <h2 className="text-xl font-bold mb-2">{head.judul}</h2>
          <p className="text-blue-200 text-sm mb-4">{head.ringkasan}</p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 text-xs text-blue-300">
              <span className="flex items-center gap-1"><Calendar size={11}/> {head.tanggal}</span>
              <span>{head.penulis}</span>
            </div>
            {head.cta && (
              <a href={head.cta.href}
                className="text-xs font-bold bg-yellow-400 text-blue-900 px-4 py-2 rounded-xl hover:bg-yellow-300 transition flex items-center gap-1.5">
                {head.cta.label} <ExternalLink size={11}/>
              </a>
            )}
          </div>
        </article>
      )}

      {/* Berita lainnya */}
      <div className="space-y-4">
        {[...rest, ...biasa].map(b => (
          <article key={b.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kategoriColor[b.kategori]}`}>{b.kategori}</span>
              <span className="text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1"><Calendar size={10}/> {b.tanggal}</span>
              <span className="text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1 ml-auto"><Tag size={10}/> {b.penulis}</span>
            </div>
            <h2 className="font-bold text-gray-800 dark:text-slate-100 mb-1 leading-snug">{b.judul}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">{b.ringkasan}</p>

            {/* CTA kontekstual */}
            {b.cta && (
              <a href={b.cta.href}
                className={`inline-flex items-center gap-1.5 mt-3 text-xs font-semibold px-4 py-2 rounded-xl transition ${ctaColor[b.cta.color] ?? ctaColor.blue}`}>
                {b.cta.label}
              </a>
            )}

            {/* Rating */}
            <ArticleRating id={b.id} />
          </article>
        ))}
      </div>
    </div>
  )
}
