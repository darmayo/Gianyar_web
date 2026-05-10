'use client'
// ============================================================
// Halaman Peta Digital — /peta
// ============================================================
import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin, Store, Camera, Heart, Wrench,
  AlertTriangle, Navigation, Building2, BookOpen,
  ChevronDown, ExternalLink, Layers, Info,
} from 'lucide-react'
import type { LokasiMarker } from '@/components/peta/GianyarMap'

// Dynamic import — Leaflet tidak bisa SSR (butuh window)
const GianyarMap = dynamic(() => import('@/components/peta/GianyarMap'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center gap-3"
      style={{ height: 520 }}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center animate-pulse">
          <MapPin size={32} className="text-teal-500" />
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-teal-300/50 animate-ping" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Memuat Peta Interaktif</p>
        <p className="text-xs text-gray-400 mt-0.5">Kabupaten Gianyar, Bali</p>
      </div>
      {/* Shimmer grid to suggest map tiles */}
      <div className="w-64 grid grid-cols-4 gap-1 mt-2 opacity-30">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 rounded bg-teal-200 dark:bg-teal-800 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    </div>
  ),
})

// ── Data Lokasi ──────────────────────────────────────────────
const SEMUA_LOKASI: LokasiMarker[] = [
  // ── Pemerintahan ─────────────────────────────────────────
  { nama: 'Kantor Bupati Gianyar',      kategori: 'Pemerintahan', lat: -8.5296, lng: 115.3319, deskripsi: 'Pusat pemerintahan Kabupaten Gianyar', mapsUrl: 'https://maps.google.com/?q=-8.5296,115.3319' },
  { nama: 'DPRD Kabupaten Gianyar',     kategori: 'Pemerintahan', lat: -8.5280, lng: 115.3280, deskripsi: 'Dewan Perwakilan Rakyat Daerah Kab. Gianyar', mapsUrl: 'https://maps.google.com/?q=-8.5280,115.3280' },
  { nama: 'Dinas Dukcapil Gianyar',     kategori: 'Pemerintahan', lat: -8.5305, lng: 115.3295, deskripsi: 'Layanan KTP, KK, dan kependudukan', mapsUrl: 'https://maps.google.com/?q=Dinas+Kependudukan+Catatan+Sipil+Gianyar' },
  { nama: 'Kantor Kecamatan Ubud',      kategori: 'Pemerintahan', lat: -8.5069, lng: 115.2625, deskripsi: 'Kantor kecamatan wilayah Ubud', mapsUrl: 'https://maps.google.com/?q=Kantor+Camat+Ubud+Bali' },
  { nama: 'Kantor Kecamatan Tampaksiring', kategori: 'Pemerintahan', lat: -8.4060, lng: 115.3142, deskripsi: 'Kantor kecamatan Tampaksiring', mapsUrl: 'https://maps.google.com/?q=Kantor+Kecamatan+Tampaksiring' },
  { nama: 'Kantor Kecamatan Sukawati',  kategori: 'Pemerintahan', lat: -8.5820, lng: 115.2923, deskripsi: 'Kantor kecamatan Sukawati', mapsUrl: 'https://maps.google.com/?q=Kantor+Kecamatan+Sukawati+Gianyar' },

  // ── Wisata ────────────────────────────────────────────────
  { nama: 'Tegallalang Rice Terrace',   kategori: 'Wisata', lat: -8.4290, lng: 115.2787, deskripsi: 'Sawah terasering ikonik UNESCO, subak tradisional Bali', mapsUrl: 'https://maps.google.com/?q=-8.4290,115.2787' },
  { nama: 'Pura Tirta Empul',           kategori: 'Wisata', lat: -8.4151, lng: 115.3151, deskripsi: 'Pura suci dengan mata air keramat, ritual melukat', mapsUrl: 'https://maps.google.com/?q=-8.4151,115.3151' },
  { nama: 'Goa Gajah',                  kategori: 'Wisata', lat: -8.5230, lng: 115.2855, deskripsi: 'Situs arkeologi abad ke-9, gua meditasi bersejarah', mapsUrl: 'https://maps.google.com/?q=-8.5230,115.2855' },
  { nama: 'Sacred Monkey Forest Ubud',  kategori: 'Wisata', lat: -8.5184, lng: 115.2580, deskripsi: 'Hutan suci monyet Ubud dengan 3 pura bersejarah', mapsUrl: 'https://maps.google.com/?q=-8.5184,115.2580' },
  { nama: 'Museum Blanco Renaissance',  kategori: 'Wisata', lat: -8.5072, lng: 115.2638, deskripsi: 'Museum seni milik pelukis Don Antonio Blanco', mapsUrl: 'https://maps.google.com/?q=Blanco+Renaissance+Museum+Ubud' },
  { nama: 'Puri Saren Ubud',            kategori: 'Wisata', lat: -8.5065, lng: 115.2628, deskripsi: 'Istana kerajaan Ubud, venue pertunjukan Tari Kecak', mapsUrl: 'https://maps.google.com/?q=Puri+Saren+Agung+Ubud' },
  { nama: 'Bukit Campuhan Ubud',        kategori: 'Wisata', lat: -8.4993, lng: 115.2496, deskripsi: 'Trekking di perbukitan hijau dengan panorama persawahan', mapsUrl: 'https://maps.google.com/?q=Campuhan+Ridge+Walk+Ubud' },
  { nama: 'Pasar Tradisional Ubud',     kategori: 'Wisata', lat: -8.5060, lng: 115.2628, deskripsi: 'Pasar seni dan souvenir khas Bali di pusat Ubud', mapsUrl: 'https://maps.google.com/?q=Ubud+Market+Bali' },
  { nama: 'Yeh Pulu Relief',            kategori: 'Wisata', lat: -8.5247, lng: 115.2892, deskripsi: 'Relief batu abad ke-14, situs arkeologi tersembunyi', mapsUrl: 'https://maps.google.com/?q=Yeh+Pulu+Bali' },

  // ── Kesehatan ─────────────────────────────────────────────
  { nama: 'RSUD Sanjiwani Gianyar',     kategori: 'Kesehatan', lat: -8.5285, lng: 115.3320, deskripsi: 'Rumah sakit umum daerah utama Kab. Gianyar', mapsUrl: 'https://maps.google.com/?q=RSUD+Sanjiwani+Gianyar' },
  { nama: 'Puskesmas Ubud I',           kategori: 'Kesehatan', lat: -8.5100, lng: 115.2650, deskripsi: 'Pusat kesehatan masyarakat wilayah Ubud', mapsUrl: 'https://maps.google.com/?q=Puskesmas+Ubud+1+Bali' },
  { nama: 'Puskesmas Gianyar I',        kategori: 'Kesehatan', lat: -8.5330, lng: 115.3340, deskripsi: 'Pusat kesehatan masyarakat wilayah Gianyar', mapsUrl: 'https://maps.google.com/?q=Puskesmas+Gianyar+1' },
  { nama: 'PMI Kabupaten Gianyar',      kategori: 'Kesehatan', lat: -8.5275, lng: 115.3290, deskripsi: 'Palang Merah Indonesia Kab. Gianyar — donor darah', mapsUrl: 'https://maps.google.com/?q=PMI+Gianyar+Bali' },

  // ── Ekonomi & UMKM ───────────────────────────────────────
  { nama: 'Pasar Seni Sukawati',        kategori: 'Ekonomi', lat: -8.5822, lng: 115.2895, deskripsi: 'Pusat grosir kerajinan Bali terbesar, open 06.00–18.00', mapsUrl: 'https://maps.google.com/?q=Pasar+Seni+Sukawati+Gianyar' },
  { nama: 'Pasar Gianyar',              kategori: 'Ekonomi', lat: -8.5312, lng: 115.3337, deskripsi: 'Pasar tradisional utama kota Gianyar', mapsUrl: 'https://maps.google.com/?q=Pasar+Gianyar+Bali' },
  { nama: 'Desa Tegalalang (UMKM)',     kategori: 'UMKM', lat: -8.4323, lng: 115.2809, deskripsi: 'Sentra kerajinan ukiran kayu dan bambu', mapsUrl: 'https://maps.google.com/?q=Tegallalang+Village+Ubud+Bali' },
  { nama: 'Desa Celuk (Pusat Perak)',   kategori: 'UMKM', lat: -8.5601, lng: 115.2979, deskripsi: 'Sentra kerajinan perhiasan perak dan emas', mapsUrl: 'https://maps.google.com/?q=Celuk+Silver+Village+Bali' },
  { nama: 'Desa Batuan (Seni Lukis)',   kategori: 'UMKM', lat: -8.5530, lng: 115.2860, deskripsi: 'Sentra seniman lukis tradisional Batuan', mapsUrl: 'https://maps.google.com/?q=Batuan+Village+Bali' },

  // ── Pendidikan ────────────────────────────────────────────
  { nama: 'SMAN 1 Gianyar',            kategori: 'Pendidikan', lat: -8.5320, lng: 115.3305, deskripsi: 'SMA Negeri 1 Gianyar — sekolah unggulan', mapsUrl: 'https://maps.google.com/?q=SMA+Negeri+1+Gianyar+Bali' },
  { nama: 'Universitas Warmadewa',      kategori: 'Pendidikan', lat: -8.6580, lng: 115.2172, deskripsi: 'Perguruan tinggi swasta terdekat di wilayah Gianyar', mapsUrl: 'https://maps.google.com/?q=Universitas+Warmadewa+Bali' },

  // ── Infrastruktur ─────────────────────────────────────────
  { nama: 'Terminal Bus Gianyar',       kategori: 'Infrastruktur', lat: -8.5343, lng: 115.3358, deskripsi: 'Terminal bus angkutan umum kota Gianyar', mapsUrl: 'https://maps.google.com/?q=Terminal+Gianyar+Bali' },
  { nama: 'Jembatan Tukad Pakerisan',  kategori: 'Infrastruktur', lat: -8.4150, lng: 115.3180, deskripsi: 'Jembatan utama melintasi Sungai Pakerisan, Tampaksiring', mapsUrl: 'https://maps.google.com/?q=-8.4150,115.3180' },
]

// ── Kategori ─────────────────────────────────────────────────
const KATEGORI_LIST = [
  { id: 'Semua',         label: 'Semua',         icon: Layers,    color: 'gray',   count: SEMUA_LOKASI.length },
  { id: 'Pemerintahan',  label: 'Pemerintahan',  icon: Building2, color: 'blue',   count: SEMUA_LOKASI.filter(l=>l.kategori==='Pemerintahan').length },
  { id: 'Wisata',        label: 'Wisata',         icon: Camera,    color: 'green',  count: SEMUA_LOKASI.filter(l=>l.kategori==='Wisata').length },
  { id: 'Kesehatan',     label: 'Kesehatan',      icon: Heart,     color: 'red',    count: SEMUA_LOKASI.filter(l=>l.kategori==='Kesehatan').length },
  { id: 'Ekonomi',       label: 'Ekonomi & UMKM', icon: Store,     color: 'amber',  count: SEMUA_LOKASI.filter(l=>l.kategori==='Ekonomi'||l.kategori==='UMKM').length },
  { id: 'Pendidikan',    label: 'Pendidikan',     icon: BookOpen,  color: 'purple', count: SEMUA_LOKASI.filter(l=>l.kategori==='Pendidikan').length },
  { id: 'Infrastruktur', label: 'Infrastruktur',  icon: Wrench,    color: 'slate',  count: SEMUA_LOKASI.filter(l=>l.kategori==='Infrastruktur').length },
]

const COLOR_CLASS: Record<string, string> = {
  gray:   'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  blue:   'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  green:  'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  red:    'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  amber:  'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  slate:  'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
}
const COLOR_ACTIVE: Record<string, string> = {
  gray:   'bg-gray-700 text-white border-gray-700 shadow-md',
  blue:   'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200',
  green:  'bg-green-600 text-white border-green-600 shadow-md shadow-green-200',
  red:    'bg-red-600 text-white border-red-600 shadow-md shadow-red-200',
  amber:  'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200',
  purple: 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200',
  slate:  'bg-slate-600 text-white border-slate-600 shadow-md',
}

// Warna ikon per kategori (untuk sidebar)
const KAT_DOT: Record<string, string> = {
  Pemerintahan: 'bg-blue-500', Wisata: 'bg-green-500', Kesehatan: 'bg-red-500',
  Ekonomi: 'bg-amber-500', UMKM: 'bg-amber-400', Pendidikan: 'bg-purple-500',
  Infrastruktur: 'bg-slate-500',
}

export default function PetaPage() {
  const [activeKat, setActiveKat] = useState('Semua')
  const [selectedLoc, setSelectedLoc] = useState<LokasiMarker | null>(null)
  const [showList, setShowList] = useState(false)

  const filteredMarkers = useMemo(() => {
    if (activeKat === 'Semua') return SEMUA_LOKASI
    if (activeKat === 'Ekonomi') return SEMUA_LOKASI.filter(l => l.kategori === 'Ekonomi' || l.kategori === 'UMKM')
    return SEMUA_LOKASI.filter(l => l.kategori === activeKat)
  }, [activeKat])

  const activeKatData = KATEGORI_LIST.find(k => k.id === activeKat)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-blue-700 overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          aria-hidden="true" />
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Ikon */}
            <div className="w-16 h-16 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <MapPin size={32} className="text-white" aria-hidden="true" />
            </div>

            {/* Teks */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-teal-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                  GIS · Peta Interaktif
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Peta Digital Kabupaten Gianyar
              </h1>
              <p className="text-sm text-teal-100 mt-1.5 max-w-xl">
                Peta interaktif aset, layanan publik, wisata, dan infrastruktur daerah Kabupaten Gianyar, Bali.
                Klik marker untuk detail dan arah navigasi.
              </p>
            </div>

            {/* Stat ringkas */}
            <div className="flex gap-4 sm:flex-col sm:gap-2 flex-shrink-0 text-right">
              <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center backdrop-blur-sm">
                <p className="text-2xl font-black text-white">{SEMUA_LOKASI.length}</p>
                <p className="text-xs text-teal-200">Total Lokasi</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center backdrop-blur-sm">
                <p className="text-2xl font-black text-white">{KATEGORI_LIST.length - 1}</p>
                <p className="text-xs text-teal-200">Kategori</p>
              </div>
            </div>
          </div>

          {/* Koordinat info */}
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { label: 'Pusat', val: '8°31′S, 115°19′E' },
              { label: 'Luas', val: '368 km²' },
              { label: 'Kecamatan', val: '7 Kecamatan' },
              { label: 'Sumber', val: 'OpenStreetMap' },
            ].map(info => (
              <div key={info.label} className="flex items-center gap-1.5 text-xs text-teal-100 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                <Info size={11} aria-hidden="true" />
                <span className="text-teal-300 font-medium">{info.label}:</span>
                <span>{info.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Konten Utama ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Filter Kategori */}
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Filter kategori lokasi">
          {KATEGORI_LIST.map(kat => {
            const Icon = kat.icon
            const isActive = activeKat === kat.id
            return (
              <button
                key={kat.id}
                onClick={() => { setActiveKat(kat.id); setSelectedLoc(null) }}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 ${
                  isActive ? COLOR_ACTIVE[kat.color] : COLOR_CLASS[kat.color]
                }`}
              >
                <Icon size={14} aria-hidden="true" />
                {kat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/25' : 'bg-black/8'}`}>
                  {kat.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Main Layout: Map + Sidebar */}
        <div className="grid lg:grid-cols-[1fr_310px] gap-4">

          {/* ── Peta ── */}
          <div className="flex flex-col gap-3">
            <div className="shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 ring-1 ring-black/5">
              <GianyarMap
                markers={filteredMarkers}
                height={520}
                zoom={11}
                center={[-8.5278, 115.3301]}
              />
            </div>

            {/* Attribution baris */}
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-slate-500 px-1">
              <span>
                © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer"
                  className="hover:text-teal-600 underline">OpenStreetMap</a> contributors
              </span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                {filteredMarkers.length} lokasi ditampilkan
              </span>
            </div>

            {/* Info card navigasi */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0">
                <Navigation size={18} className="text-teal-600 dark:text-teal-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">Butuh arah navigasi?</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Buka Google Maps untuk petunjuk arah turn-by-turn ke lokasi tujuan.</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href="https://maps.google.com/?q=Kabupaten+Gianyar+Bali+Indonesia"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <ExternalLink size={12} aria-hidden="true" />
                  Google Maps
                </a>
                <Link href="/layanan/antrian"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 px-4 py-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-teal-500">
                  Antrian Digital
                </Link>
              </div>
            </div>
          </div>

          {/* ── Sidebar: daftar lokasi ── */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            {/* Header sidebar */}
            <button
              onClick={() => setShowList(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition lg:cursor-default focus:outline-none"
              aria-expanded={showList}
            >
              <span className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${activeKat === 'Semua' ? 'bg-teal-500' : KAT_DOT[activeKat] ?? 'bg-gray-400'}`} />
                <span>{activeKatData?.label ?? 'Semua Lokasi'}</span>
                <span className="text-xs font-normal text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  {filteredMarkers.length}
                </span>
              </span>
              <ChevronDown size={14} className={`lg:hidden transition-transform ${showList ? 'rotate-180' : ''}`} />
            </button>

            {/* Daftar lokasi */}
            <div className={`overflow-y-auto flex-1 divide-y divide-gray-50 dark:divide-slate-800 ${showList ? 'block' : 'hidden lg:block'}`}
              style={{ maxHeight: 436 }}>
              {filteredMarkers.map((loc) => {
                const isSelected = selectedLoc === loc
                return (
                  <button
                    key={loc.nama}
                    onClick={() => setSelectedLoc(isSelected ? null : loc)}
                    className={`w-full text-left px-4 py-3 transition-all focus:outline-none focus:bg-teal-50 dark:focus:bg-slate-800 ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-slate-800 border-l-[3px] border-teal-500'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 border-l-[3px] border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${KAT_DOT[loc.kategori] ?? 'bg-gray-400'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold leading-snug ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-gray-800 dark:text-slate-100'}`}>
                          {loc.nama}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{loc.kategori}</p>
                        {isSelected && (
                          <div className="mt-2 space-y-1.5">
                            {loc.deskripsi && (
                              <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{loc.deskripsi}</p>
                            )}
                            {loc.mapsUrl && (
                              <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium">
                                <ExternalLink size={11} aria-hidden="true" />
                                Buka Google Maps
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Footer sidebar */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
              <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                <AlertTriangle size={10} className="text-amber-500" aria-hidden="true" />
                Klik marker di peta atau baris di atas untuk detail lokasi
              </p>
            </div>
          </div>
        </div>

        {/* ── Statistik Kategori ──────────────────────────────── */}
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {KATEGORI_LIST.filter(k => k.id !== 'Semua').map(kat => {
            const Icon = kat.icon
            const isActive = activeKat === kat.id
            return (
              <button
                key={kat.id}
                onClick={() => { setActiveKat(isActive ? 'Semua' : kat.id); setSelectedLoc(null) }}
                className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isActive ? COLOR_ACTIVE[kat.color] : COLOR_CLASS[kat.color] + ' hover:shadow-md'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white dark:bg-slate-700 shadow-sm'}`}>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <p className="text-xl font-black leading-none">{kat.count}</p>
                <p className="text-[11px] font-medium leading-tight">{kat.label}</p>
              </button>
            )
          })}
        </div>

        {/* ── Catatan bawah ── */}
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-5 text-center">
          Data spasial berdasarkan koordinat nyata Kabupaten Gianyar, Bali ·
          Dikelola Dinas Kominfo Kab. Gianyar
        </p>
      </div>
    </div>
  )
}
