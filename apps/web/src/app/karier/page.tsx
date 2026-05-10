import type { Metadata } from 'next'
import { Briefcase, GraduationCap, Heart, Calendar, ExternalLink, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Karier & Relawan — Portal Gianyar',
  description: 'Informasi CPNS, PPPK, magang, dan pendaftaran relawan Kabupaten Gianyar',
}

const CPNS_PPPK = [
  { status:'MENDATANG', jenis:'CPNS 2025', formasi:'Guru, Tenaga Kesehatan, Teknis IT', kuota:247, pendaftaran:'1–30 Sept 2025', pengumuman:'15 Okt 2025', link:'https://sscasn.bkn.go.id' },
  { status:'MENDATANG', jenis:'PPPK 2025', formasi:'Tenaga Teknis, Tenaga Kesehatan', kuota:312, pendaftaran:'1–31 Okt 2025', pengumuman:'15 Nov 2025', link:'https://sscasn.bkn.go.id' },
  { status:'SELESAI', jenis:'CPNS 2024', formasi:'Guru, Tenaga Kesehatan, Umum', kuota:198, pendaftaran:'20 Agt–6 Sep 2024', pengumuman:'Selesai', link:'#' },
]

const MAGANG = [
  { instansi:'Dinas Kominfo', bidang:'Pengembangan Web & Aplikasi Mobile', kuota:4, syarat:['Mahasiswa S1/D4 Informatika/TI'], pendaftaran:'Rolling — hub. diskominfo@gianyarkab.go.id' },
  { instansi:'Dinas Pariwisata', bidang:'Pemasaran Digital & Konten Kreatif', kuota:3, syarat:['Mahasiswa Pariwisata/DKV/Komunikasi'], pendaftaran:'Rolling — hub. disparda@gianyarkab.go.id' },
  { instansi:'BPBD', bidang:'Manajemen Kebencanaan & GIS', kuota:2, syarat:['Mahasiswa Geografi/Teknik Lingkungan'], pendaftaran:'Rolling — hub. bpbd@gianyarkab.go.id' },
  { instansi:'Dinas Kesehatan', bidang:'Administrasi Kesehatan & SIMRS', kuota:3, syarat:['Mahasiswa Kesehatan Masyarakat/D3 Keperawatan'], pendaftaran:'Rolling — hub. dinkes@gianyarkab.go.id' },
]

const RELAWAN = [
  { nama:'Relawan Pesta Kesenian Bali 2026', deskripsi:'Pemandu wisata, dokumentasi, logistik untuk PKB ke-48 di Bali', periode:'Jun–Jul 2026', slot:80, bidang:'Seni & Budaya' },
  { nama:'Relawan Bencana BPBD', deskripsi:'Tim siaga bencana, evakuasi, dan distribusi bantuan darurat', periode:'Sepanjang tahun', slot:50, bidang:'Kebencanaan' },
  { nama:'Relawan Digital Dukcapil', deskripsi:'Membantu warga lansia mengurus dokumen kependudukan secara digital', periode:'Sepanjang tahun', slot:30, bidang:'Sosial Digital' },
  { nama:'Relawan Festival Ubud 2026', deskripsi:'Registrasi peserta, hosting tamu, dan panduan acara Ubud Writers & Readers Festival', periode:'Okt 2026', slot:40, bidang:'Pariwisata & Budaya' },
]

export default function KarierPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Briefcase size={24} className="text-indigo-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Karier & Relawan</h1>
          <p className="text-sm text-gray-500">CPNS · PPPK · Magang · Relawan Kegiatan</p>
        </div>
      </div>

      {/* CPNS / PPPK */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Briefcase size={18} className="text-indigo-600" /> Seleksi ASN (CPNS & PPPK)
        </h2>
        <p className="text-sm text-gray-400 mb-4">Rekrutmen ASN dikelola oleh BKN melalui SSCASN. Portal ini menampilkan informasi formasi untuk Kab. Gianyar.</p>
        <div className="space-y-3">
          {CPNS_PPPK.map(c => (
            <div key={c.jenis} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.status==='MENDATANG'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                    <h3 className="font-bold text-gray-800">{c.jenis}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{c.formasi}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-indigo-700">{c.kuota}</p>
                  <p className="text-xs text-gray-400">formasi</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                <span><Calendar size={11} className="inline mr-1" />Daftar: {c.pendaftaran}</span>
                <span>Pengumuman: {c.pengumuman}</span>
              </div>
              {c.status === 'MENDATANG' && (
                <a href={c.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-indigo-700 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition">
                  <ExternalLink size={12} /> Daftar via SSCASN
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Magang */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <GraduationCap size={18} className="text-green-600" /> Program Magang Mahasiswa
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {MAGANG.map(m => (
            <div key={m.instansi} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{m.instansi}</span>
                <span className="text-xs text-gray-400">{m.kuota} slot</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{m.bidang}</h3>
              <ul className="mb-3">
                {m.syarat.map(s => (
                  <li key={s} className="text-xs text-gray-500 flex items-start gap-1.5">
                    <ChevronRight size={11} className="text-green-400 mt-0.5 flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400">{m.pendaftaran}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Relawan */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Heart size={18} className="text-red-500" /> Pendaftaran Relawan
        </h2>
        <div className="space-y-3">
          {RELAWAN.map(r => (
            <div key={r.nama} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart size={18} className="text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-gray-800">{r.nama}</h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex-shrink-0">{r.bidang}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{r.deskripsi}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span><Calendar size={11} className="inline mr-1" />{r.periode}</span>
                  <span>{r.slot} slot tersedia</span>
                </div>
              </div>
              <button className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-100 transition flex-shrink-0 font-medium">
                Daftar
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
