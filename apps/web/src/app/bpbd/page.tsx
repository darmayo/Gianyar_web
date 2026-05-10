import type { Metadata } from 'next'
import { AlertTriangle, MapPin, Phone, Radio, Cloud, Flame, Waves, Wind, Mountain, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Peta Bencana & Darurat — BPBD Gianyar',
  description: 'Status kejadian bencana, peringatan dini, dan kontak darurat BPBD Kabupaten Gianyar',
}

const KEJADIAN_AKTIF = [
  {
    id: 1,
    judul: 'Siaga Kekeringan — Wilayah Payangan',
    jenis: 'KEKERINGAN',
    kecamatan: 'Payangan',
    lokasi: 'Desa Buahan Kaja, Ds. Buahan',
    level: 'SIAGA',
    deskripsi: 'Beberapa sumber mata air mulai mengering. Warga diminta berhemat air. Distribusi air bersih sedang diatur.',
    dilaporkan: '1 Apr 2026, 09.00 WITA',
    petugas: 'Tim BPBD Gianyar',
  },
  {
    id: 2,
    judul: 'Longsor Tebing Jalan Kintamani',
    jenis: 'LONGSOR',
    kecamatan: 'Tampaksiring',
    lokasi: 'Jl. Raya Tampaksiring–Kintamani Km 12',
    level: 'BAHAYA',
    deskripsi: 'Material longsor menutup sebagian badan jalan. Pengguna jalan diminta menggunakan jalur alternatif via Payangan.',
    dilaporkan: '31 Mar 2026, 16.30 WITA',
    petugas: 'PU + BPBD Gianyar',
  },
]

const RIWAYAT = [
  { judul:'Kebakaran Lahan Tegallalang', kecamatan:'Tegallalang', tanggal:'25 Mar 2026', level:'BAHAYA', selesai: true },
  { judul:'Angin Kencang merusak Atap Rumah', kecamatan:'Sukawati', tanggal:'20 Mar 2026', level:'INFO', selesai: true },
  { judul:'Banjir Sungai Wos (surut)', kecamatan:'Ubud', tanggal:'15 Mar 2026', level:'SIAGA', selesai: true },
]

const LEVEL_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  INFO: { color:'text-blue-700', bg:'bg-blue-50 border-blue-200', icon:<Info size={16} />, label:'Informasi' },
  SIAGA: { color:'text-amber-700', bg:'bg-amber-50 border-amber-200', icon:<AlertTriangle size={16} />, label:'Siaga' },
  BAHAYA: { color:'text-red-700', bg:'bg-red-50 border-red-200', icon:<AlertTriangle size={16} />, label:'Bahaya' },
}

const JENIS_ICON: Record<string, React.ReactNode> = {
  BANJIR: <Waves size={20} className="text-blue-600" />,
  KEBAKARAN: <Flame size={20} className="text-red-600" />,
  LONGSOR: <Mountain size={20} className="text-brown-600 text-amber-800" />,
  ANGIN_KENCANG: <Wind size={20} className="text-gray-600" />,
  KEKERINGAN: <Cloud size={20} className="text-orange-600" />,
  GEMPA: <Radio size={20} className="text-purple-600" />,
}

const KONTAK_DARURAT = [
  { label:'BPBD Gianyar', telp:'(0361) 943012', kategori:'bpbd' },
  { label:'Pemadam Kebakaran', telp:'(0361) 943113', kategori:'damkar' },
  { label:'RSUD Sanjiwani', telp:'(0361) 943354', kategori:'medis' },
  { label:'Polres Gianyar', telp:'(0361) 943110', kategori:'polisi' },
  { label:'SAR Denpasar', telp:'(0361) 704111', kategori:'sar' },
  { label:'Basarnas (Nasional)', telp:'115', kategori:'sar' },
]

const PRAKIRAAN_CUACA = [
  { hari:'Hari ini', kondisi:'Berawan + Hujan Sore', suhu:'24–31°C', icon:'⛅' },
  { hari:'Besok', kondisi:'Cerah Berawan', suhu:'25–32°C', icon:'🌤' },
  { hari:'Lusa', kondisi:'Hujan Sedang', suhu:'23–29°C', icon:'🌧' },
]

export default function BPBDPage() {
  const aktifCount = KEJADIAN_AKTIF.length

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} className="text-red-700" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Peta Bencana & Darurat</h1>
            <p className="text-sm text-gray-500">BPBD Kabupaten Gianyar — Diperbarui real-time</p>
          </div>
        </div>
        {aktifCount > 0 && (
          <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            {aktifCount} Kejadian Aktif
          </div>
        )}
      </div>

      {/* Kejadian Aktif */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse inline-block" />
          Kejadian Aktif
        </h2>
        {aktifCount === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center text-green-700">
            <p className="font-semibold">Tidak ada kejadian bencana aktif saat ini.</p>
            <p className="text-sm mt-1">Kondisi wilayah Kabupaten Gianyar dalam keadaan aman.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {KEJADIAN_AKTIF.map(k => {
              const lc = LEVEL_CONFIG[k.level]
              return (
                <article key={k.id} className={`border rounded-2xl p-5 ${lc.bg}`}>
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      {JENIS_ICON[k.jenis] ?? <AlertTriangle size={20} />}
                      <h3 className="font-bold text-gray-800">{k.judul}</h3>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${lc.bg} ${lc.color}`}>
                      {lc.icon} {lc.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {k.lokasi}</span>
                    <span>Kec. {k.kecamatan}</span>
                    <span>Dilaporkan: {k.dilaporkan}</span>
                  </div>
                  <p className="text-sm text-gray-700">{k.deskripsi}</p>
                  <p className="text-xs text-gray-500 mt-2">Petugas: {k.petugas}</p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Prakiraan Cuaca */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Prakiraan Cuaca Gianyar</h2>
        <div className="grid grid-cols-3 gap-3">
          {PRAKIRAAN_CUACA.map(c => (
            <div key={c.hari} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl mb-1">{c.icon}</div>
              <p className="font-semibold text-sm text-gray-800">{c.hari}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.kondisi}</p>
              <p className="text-xs font-medium text-blue-700 mt-1">{c.suhu}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Sumber: BMKG Wilayah III Denpasar</p>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Kontak Darurat */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Phone size={18} className="text-red-600" /> Kontak Darurat
          </h2>
          <ul className="space-y-2">
            {KONTAK_DARURAT.map(k => (
              <li key={k.label}>
                <a href={`tel:${k.telp.replace(/[^+\d]/g, '')}`}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 hover:bg-red-50 hover:border-red-200 transition group shadow-sm">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">{k.label}</span>
                  <span className="text-sm font-bold text-red-700 font-mono">{k.telp}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Riwayat Kejadian */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Riwayat Kejadian (30 Hari)</h2>
          <ul className="space-y-2">
            {RIWAYAT.map((r, i) => {
              const lc = LEVEL_CONFIG[r.level]
              return (
                <li key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                  <span className={`flex-shrink-0 ${lc.color}`}>{lc.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{r.judul}</p>
                    <p className="text-xs text-gray-400">{r.tanggal} · Kec. {r.kecamatan}</p>
                  </div>
                  {r.selesai && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Selesai</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {/* Peta Placeholder */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Peta Risiko Bencana Gianyar</h2>
        <div className="bg-gray-100 border border-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
          <MapPin size={40} className="opacity-40" />
          <p className="text-sm font-medium">Peta interaktif BPBD</p>
          <p className="text-xs">Integrasi dengan GIS Kabupaten Gianyar (dalam pengembangan)</p>
          <a href="https://gis.gianyarkab.go.id" target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-1">
            Buka di GIS Portal →
          </a>
        </div>
      </section>

      {/* Tips Siaga */}
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h2 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          <Info size={18} /> Tips Siaga Bencana
        </h2>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-amber-800">
          <li className="flex gap-2"><span>•</span>Simpan nomor darurat di ponsel Anda</li>
          <li className="flex gap-2"><span>•</span>Siapkan tas siaga dengan dokumen penting</li>
          <li className="flex gap-2"><span>•</span>Kenali jalur evakuasi dari rumah Anda</li>
          <li className="flex gap-2"><span>•</span>Ikuti arahan petugas BPBD setempat</li>
          <li className="flex gap-2"><span>•</span>Jangan sebar hoax saat bencana</li>
          <li className="flex gap-2"><span>•</span>Laporkan kejadian ke 112 atau BPBD</li>
        </ul>
      </section>
    </div>
  )
}
