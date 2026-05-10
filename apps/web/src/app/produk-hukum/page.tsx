'use client'
import { useState } from 'react'
import { Search, Download, FileText, BookOpen, Gavel, ChevronRight } from 'lucide-react'

const PRODUK_HUKUM = [
  { id:1, nomor:'Perda No. 3/2024', judul:'Rencana Tata Ruang Wilayah Kabupaten Gianyar 2024–2044', jenis:'PERDA', tahun:2024, status:'BERLAKU', ukuran:'8.2 MB' },
  { id:2, nomor:'Perda No. 7/2023', judul:'Pengelolaan Sampah dan Kebersihan Lingkungan', jenis:'PERDA', tahun:2023, status:'BERLAKU', ukuran:'2.1 MB' },
  { id:3, nomor:'Perda No. 2/2023', judul:'Pajak Daerah dan Retribusi Daerah Kabupaten Gianyar', jenis:'PERDA', tahun:2023, status:'BERLAKU', ukuran:'3.4 MB' },
  { id:4, nomor:'Perda No. 5/2022', judul:'Perlindungan dan Pemberdayaan Masyarakat Adat', jenis:'PERDA', tahun:2022, status:'BERLAKU', ukuran:'1.9 MB' },
  { id:5, nomor:'Perda No. 1/2022', judul:'APBD Kabupaten Gianyar Tahun Anggaran 2022', jenis:'PERDA', tahun:2022, status:'SELESAI', ukuran:'5.7 MB' },
  { id:6, nomor:'Perbup No. 12/2025', judul:'Standar Biaya Masukan Tahun Anggaran 2026', jenis:'PERBUP', tahun:2025, status:'BERLAKU', ukuran:'1.2 MB' },
  { id:7, nomor:'Perbup No. 8/2025', judul:'Pedoman Penyelenggaraan Pelayanan Publik Digital', jenis:'PERBUP', tahun:2025, status:'BERLAKU', ukuran:'0.9 MB' },
  { id:8, nomor:'Perbup No. 3/2025', judul:'Tata Cara Pengadaan Barang/Jasa Pemerintah Daerah', jenis:'PERBUP', tahun:2025, status:'BERLAKU', ukuran:'2.3 MB' },
  { id:9, nomor:'Perbup No. 19/2024', judul:'Pedoman Musyawarah Perencanaan Pembangunan 2025', jenis:'PERBUP', tahun:2024, status:'BERLAKU', ukuran:'1.5 MB' },
  { id:10, nomor:'SK Bupati No. 45/2025', judul:'Penetapan Tim Percepatan Digitalisasi Layanan Publik', jenis:'SK BUPATI', tahun:2025, status:'BERLAKU', ukuran:'0.4 MB' },
  { id:11, nomor:'SK Bupati No. 12/2025', judul:'Penetapan Desa Wisata Unggulan Kabupaten Gianyar 2025', jenis:'SK BUPATI', tahun:2025, status:'BERLAKU', ukuran:'0.3 MB' },
  { id:12, nomor:'SK Bupati No. 78/2024', judul:'Pengangkatan dan Pemberhentian Kepala Dinas', jenis:'SK BUPATI', tahun:2024, status:'BERLAKU', ukuran:'0.2 MB' },
]

const JENIS_COLOR: Record<string,string> = {
  'PERDA': 'bg-blue-100 text-blue-800',
  'PERBUP': 'bg-green-100 text-green-700',
  'SK BUPATI': 'bg-amber-100 text-amber-700',
}
const STATUS_COLOR: Record<string,string> = {
  'BERLAKU': 'bg-green-100 text-green-700',
  'SELESAI': 'bg-gray-100 text-gray-500',
}
const JENIS_ICON: Record<string, React.ElementType> = {
  'PERDA': Gavel,
  'PERBUP': BookOpen,
  'SK BUPATI': FileText,
}

export default function ProdukHukumPage() {
  const [cari, setCari] = useState('')
  const [filterJenis, setFilterJenis] = useState('SEMUA')
  const [filterTahun, setFilterTahun] = useState('SEMUA')

  const TAHUN_LIST = [...new Set(PRODUK_HUKUM.map(p => p.tahun))].sort((a,b) => b-a)

  const filtered = PRODUK_HUKUM.filter(p => {
    const matchCari = !cari || p.judul.toLowerCase().includes(cari.toLowerCase()) || p.nomor.toLowerCase().includes(cari.toLowerCase())
    const matchJenis = filterJenis === 'SEMUA' || p.jenis === filterJenis
    const matchTahun = filterTahun === 'SEMUA' || p.tahun === Number(filterTahun)
    return matchCari && matchJenis && matchTahun
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Gavel size={24} className="text-blue-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produk Hukum Daerah</h1>
          <p className="text-sm text-gray-500">Jaringan Dokumentasi & Informasi Hukum (JDIH) Kabupaten Gianyar</p>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-3 my-6">
        {[
          { label:'Peraturan Daerah', count: PRODUK_HUKUM.filter(p=>p.jenis==='PERDA').length, icon: Gavel },
          { label:'Peraturan Bupati', count: PRODUK_HUKUM.filter(p=>p.jenis==='PERBUP').length, icon: BookOpen },
          { label:'SK Bupati', count: PRODUK_HUKUM.filter(p=>p.jenis==='SK BUPATI').length, icon: FileText },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <s.icon size={20} className="text-blue-700 flex-shrink-0" />
            <div>
              <p className="text-xl font-bold text-gray-800">{s.count}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Cari */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" value={cari} onChange={e=>setCari(e.target.value)}
            placeholder="Cari judul atau nomor..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filterJenis} onChange={e=>setFilterJenis(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="SEMUA">Semua Jenis</option>
          <option value="PERDA">Perda</option>
          <option value="PERBUP">Perbup</option>
          <option value="SK BUPATI">SK Bupati</option>
        </select>
        <select value={filterTahun} onChange={e=>setFilterTahun(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="SEMUA">Semua Tahun</option>
          {TAHUN_LIST.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Daftar */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Search size={36} className="mx-auto mb-2 opacity-30" />
            <p>Tidak ada produk hukum yang ditemukan</p>
          </div>
        ) : filtered.map(p => {
          const Icon = JENIS_ICON[p.jenis] ?? FileText
          return (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition">
                <Icon size={18} className="text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${JENIS_COLOR[p.jenis]}`}>{p.jenis}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status]}`}>{p.status}</span>
                  <span className="text-xs text-gray-400">{p.tahun}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">{p.judul}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{p.nomor} · {p.ukuran}</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs bg-blue-900 text-white px-3 py-2 rounded-xl hover:bg-blue-800 transition flex-shrink-0">
                <Download size={13} /> PDF
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Untuk produk hukum lainnya, kunjungi{' '}
        <a href="https://jdih.gianyarkab.go.id" target="_blank" rel="noopener noreferrer"
          className="text-blue-600 hover:underline inline-flex items-center gap-1">
          jdih.gianyarkab.go.id <ChevronRight size={12} />
        </a>
      </p>
    </div>
  )
}
