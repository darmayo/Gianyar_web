'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Search } from 'lucide-react'

const INDEX = [
  { judul:'Syarat Membuat KTP', href:'/layanan/ktp', kategori:'Layanan', kata:['ktp','kartu tanda penduduk','identitas','e-ktp'] },
  { judul:'Permohonan Kartu Keluarga', href:'/layanan/kk', kategori:'Layanan', kata:['kk','kartu keluarga','kepala keluarga'] },
  { judul:'Antrian Digital Dukcapil', href:'/layanan/antrian', kategori:'Layanan', kata:['antrian','antre','queue','nomor antrian'] },
  { judul:'Jadwal Pelayanan', href:'/layanan/jadwal', kategori:'Informasi', kata:['jadwal','jam buka','buka','tutup','operasional'] },
  { judul:'Buat Laporan Pengaduan', href:'/pengaduan/buat', kategori:'Pengaduan', kata:['pengaduan','laporan','aduan','keluhan'] },
  { judul:'Cek Status Pengaduan', href:'/pengaduan/cek', kategori:'Pengaduan', kata:['cek status','tiket','status pengaduan'] },
  { judul:'Cek Pajak PBB', href:'/cek-pajak', kategori:'Pajak', kata:['pajak','pbb','nop','sppt','tagihan pajak'] },
  { judul:'Cek Bansos', href:'/layanan/formulir?jenis=BANSOS', kategori:'Layanan', kata:['bansos','bantuan sosial','pkh','bpnt'] },
  { judul:'Lowongan Kerja Lokal', href:'/lowongan', kategori:'Informasi', kata:['lowongan','kerja','loker','karir','pekerjaan'] },
  { judul:'BPBD & Peta Bencana', href:'/bpbd', kategori:'Darurat', kata:['bpbd','bencana','darurat','longsor','banjir'] },
  { judul:'Kontak Darurat', href:'/darurat', kategori:'Darurat', kata:['darurat','ambulans','pemadam','polisi','112'] },
  { judul:'Destinasi Wisata Gianyar', href:'/pariwisata', kategori:'Pariwisata', kata:['wisata','pariwisata','ubud','tegalalang','destinasi'] },
  { judul:'Direktori UMKM Gianyar', href:'/umkm', kategori:'UMKM', kata:['umkm','vendor','kerajinan','kuliner','usaha'] },
  { judul:'Statistik Publik', href:'/statistik', kategori:'Informasi', kata:['statistik','data','grafik','apbd','chart'] },
  { judul:'Profil Daerah Gianyar', href:'/profil', kategori:'Informasi', kata:['profil','sejarah','visi misi','gianyar'] },
  { judul:'Struktur Organisasi', href:'/organisasi', kategori:'Informasi', kata:['organisasi','struktur','skpd','dinas','badan'] },
  { judul:'Verifikasi Dokumen', href:'/verifikasi', kategori:'Layanan', kata:['verifikasi','dokumen','kode qr','keaslian'] },
  { judul:'Kebijakan Privasi', href:'/kebijakan-privasi', kategori:'Informasi', kata:['privasi','uu pdp','data pribadi','gdpr'] },
  { judul:'Bug Bounty Program', href:'/bug-bounty', kategori:'Keamanan', kata:['bug','bounty','keamanan','celah','hacker'] },
  { judul:'FAQ / Pertanyaan Umum', href:'/faq', kategori:'Informasi', kata:['faq','pertanyaan','bantuan','help'] },
  { judul:'Transparansi Anggaran APBD', href:'/transparansi', kategori:'Transparansi', kata:['apbd','anggaran','transparansi','laporan keuangan','realisasi','wtp','bpkad'] },
  { judul:'Produk Hukum (JDIH)', href:'/produk-hukum', kategori:'Hukum', kata:['perda','perbup','jdih','peraturan','hukum','regulasi','sk bupati'] },
  { judul:'Partisipasi Publik & Polling', href:'/partisipasi', kategori:'Interaksi', kata:['polling','survei','ikm','aspirasi','e-voting','partisipasi'] },
  { judul:'Profil Pimpinan Daerah', href:'/pimpinan', kategori:'Informasi', kata:['bupati','wakil bupati','pimpinan','kepala dinas','sekda'] },
  { judul:'Satu Data Gianyar', href:'/satu-data', kategori:'Data', kata:['satu data','big data','statistik sektoral','penduduk','infografis'] },
  { judul:'Karier & Relawan', href:'/karier', kategori:'Karier', kata:['cpns','pppk','asn','magang','relawan','recruitment','seleksi'] },
  { judul:'Peta Digital GIS', href:'/peta', kategori:'Peta', kata:['peta','gis','maps','lokasi','umkm map','wisata map','infrastruktur'] },
  { judul:'Musrenbang Digital', href:'/musrenbang', kategori:'Interaksi', kata:['musrenbang','usulan','perencanaan','pembangunan','aspirasi warga'] },
  { judul:'Investasi & Bisnis Gianyar', href:'/investasi', kategori:'Investasi', kata:['investasi','bisnis','umkm unggulan','roi','sektor','oss','perizinan','modal'] },
  { judul:'Smart City — CCTV & Kualitas Udara', href:'/smart-city', kategori:'Smart City', kata:['smart city','cctv','iot','kualitas udara','aqi','pm25','sensor','lalu lintas'] },
  { judul:'Kesehatan & Fasilitas Publik', href:'/kesehatan', kategori:'Kesehatan', kata:['kesehatan','rs','rumah sakit','pmi','stok darah','puskesmas','rsud','tempat tidur','igd','icu'] },
  { judul:'Akun Saya — Tracking Layanan', href:'/akun/profil', kategori:'Layanan', kata:['akun','profil','notifikasi','pajak','layanan saya','tiket','permohonan'] },
  { judul:'Bug Bounty & Cek Kebocoran Data', href:'/bug-bounty', kategori:'Keamanan', kata:['bug bounty','keamanan','kebocoran data','breach','hacker','celah','cvss','hall of fame'] },
  { judul:'Asisten Virtual AI — Chatbot Gianyar', href:'/chatbot', kategori:'Layanan', kata:['chatbot','asisten','ai','virtual','tanya','bantuan ai','bot','chat'] },
  { judul:'Panduan Keamanan Digital', href:'/keamanan-digital', kategori:'Keamanan', kata:['keamanan digital','phishing','kata sandi','password','wifi','privasi','cyber','siber'] },
]

const kategoriColor: Record<string, string> = {
  Layanan:'bg-blue-100 text-blue-700', Pengaduan:'bg-orange-100 text-orange-700',
  Informasi:'bg-gray-100 text-gray-600', Pajak:'bg-teal-100 text-teal-700',
  Darurat:'bg-red-100 text-red-700', Pariwisata:'bg-green-100 text-green-700',
  UMKM:'bg-amber-100 text-amber-700', Keamanan:'bg-purple-100 text-purple-700',
  Investasi:'bg-emerald-100 text-emerald-700', 'Smart City':'bg-cyan-100 text-cyan-700',
  Kesehatan:'bg-rose-100 text-rose-700', Transparansi:'bg-indigo-100 text-indigo-700',
  Hukum:'bg-slate-100 text-slate-700', Interaksi:'bg-violet-100 text-violet-700',
  Data:'bg-sky-100 text-sky-700', Peta:'bg-lime-100 text-lime-700',
  Karier:'bg-pink-100 text-pink-700',
}

function HasilCari() {
  const params = useSearchParams()
  const router = useRouter()
  const [q, setQ] = useState(params.get('q') ?? '')
  const query = (params.get('q') ?? '').toLowerCase().trim()

  const hasil = query.length >= 2
    ? INDEX.filter(i =>
        i.judul.toLowerCase().includes(query) ||
        i.kata.some(k => k.includes(query) || query.includes(k))
      )
    : []

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const safe = q.trim().replace(/[<>"'&]/g,'').substring(0,100)
    if (safe) router.push(`/cari?q=${encodeURIComponent(safe)}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pencarian Portal Gianyar</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input type="search" value={q} onChange={e => setQ(e.target.value)}
          placeholder="Cari layanan, informasi, pariwisata..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition">
          <Search size={16} /> Cari
        </button>
      </form>

      {query.length >= 2 ? (
        hasil.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{hasil.length} hasil untuk &quot;<strong>{query}</strong>&quot;</p>
            <ul className="space-y-2">
              {hasil.map(h => (
                <li key={h.href}>
                  <Link href={h.href} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-200 transition group">
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-blue-900">{h.judul}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${kategoriColor[h.kategori]}`}>{h.kategori}</span>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Tidak ada hasil untuk &quot;{query}&quot;</p>
            <p className="text-sm mt-1">Coba kata kunci lain atau <a href="/faq" className="text-blue-600 hover:underline">lihat FAQ</a></p>
          </div>
        )
      ) : (
        <div className="text-center py-12 text-gray-300">
          <Search size={40} className="mx-auto mb-3" />
          <p className="text-sm">Ketik minimal 2 karakter untuk mencari</p>
        </div>
      )}
    </div>
  )
}

export default function CariPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-10"><div className="animate-pulse h-10 bg-gray-100 rounded-xl" /></div>}>
      <HasilCari />
    </Suspense>
  )
}
