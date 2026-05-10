'use client'
import { useState } from 'react'
import { MapPin, Star, Clock, Ticket, Calendar, Play, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

const DESTINASI = [
  { nama:'Tegalalang Rice Terrace', lokasi:'Tegallalang, Ubud', kategori:'Alam', rating:4.8, tiket:'Rp 50.000', jam:'07.00–18.00', deskripsi:'Sawah terasering ikonik yang terkenal di seluruh dunia, dengan pemandangan hijau berlapis yang memukau.', icon:'🌿' },
  { nama:'Ubud Monkey Forest', lokasi:'Ubud', kategori:'Alam', rating:4.6, tiket:'Rp 80.000', jam:'08.30–18.00', deskripsi:'Hutan suci dengan ratusan monyet ekor panjang, tiga pura kuno, dan vegetasi tropis yang rimbun.', icon:'🐒' },
  { nama:'Goa Gajah', lokasi:'Blahbatuh, Gianyar', kategori:'Budaya', rating:4.5, tiket:'Rp 50.000', jam:'08.00–17.00', deskripsi:'Situs arkeologi abad ke-11 berupa gua meditasi dengan relief ukiran batu yang menakjubkan.', icon:'🏛️' },
  { nama:'Tirta Empul', lokasi:'Tampaksiring', kategori:'Budaya', rating:4.7, tiket:'Rp 50.000', jam:'09.00–17.00', deskripsi:'Pura suci dengan mata air alami yang dipercaya memiliki kekuatan penyucian. Pengunjung bisa melukat.', icon:'💧' },
  { nama:'Pasar Seni Sukawati', lokasi:'Sukawati', kategori:'Belanja', rating:4.3, tiket:'Gratis', jam:'06.00–18.00', deskripsi:'Pusat belanja kerajinan tangan, kain endek, dan suvenir khas Bali dengan harga terjangkau.', icon:'🛍️' },
  { nama:'Bukit Campuhan Ridge Walk', lokasi:'Ubud', kategori:'Alam', rating:4.7, tiket:'Gratis', jam:'06.00–18.00', deskripsi:'Jalur trekking di punggung bukit dengan panorama sawah, sungai, dan hutan bambu yang menenangkan.', icon:'🥾' },
  { nama:'Desa Mas (Pusat Ukiran)', lokasi:'Mas, Ubud', kategori:'Seni', rating:4.5, tiket:'Gratis', jam:'08.00–17.00', deskripsi:'Desa penghasil ukiran kayu terbaik di Bali. Kunjungi galeri dan saksikan pengrajin bekerja langsung.', icon:'🪵' },
  { nama:'Puri Agung Gianyar', lokasi:'Gianyar Kota', kategori:'Budaya', rating:4.4, tiket:'Gratis', jam:'08.00–17.00', deskripsi:'Istana kerajaan Gianyar yang masih berdiri kokoh, tempat upacara adat dan pameran seni budaya.', icon:'👑' },
]

const EVENTS = [
  { tanggal:'5', bulan:'Apr', nama:'Penampilan Tari Kecak', lokasi:'Puri Ubud', kategori:'Budaya', waktu:'19.00 WITA' },
  { tanggal:'10', bulan:'Apr', nama:'Odalan Pura Gunung Kawi', lokasi:'Tampaksiring', kategori:'Spiritual', waktu:'Sepanjang hari' },
  { tanggal:'15', bulan:'Apr', nama:'Pasar Seni Mas', lokasi:'Desa Mas, Ubud', kategori:'Ekonomi', waktu:'07.00–15.00' },
  { tanggal:'20', bulan:'Apr', nama:'Festival Kesenian Bali Gianyar', lokasi:'Puri Agung Gianyar', kategori:'Festival', waktu:'16.00–21.00' },
  { tanggal:'25', bulan:'Apr', nama:'Workshop Batik Ubud', lokasi:'Ubud Art Market', kategori:'Workshop', waktu:'09.00–12.00' },
  { tanggal:'1', bulan:'Mei', nama:'Hari Buruh — Car Free Day', lokasi:'Jl. Ngurah Rai', kategori:'Publik', waktu:'06.00–10.00' },
  { tanggal:'5', bulan:'Mei', nama:'Bali Art Festival Pembukaan', lokasi:'Gianyar', kategori:'Festival', waktu:'18.00 WITA' },
  { tanggal:'12', bulan:'Mei', nama:'Pertunjukan Gamelan Klasik', lokasi:'STSI Gianyar', kategori:'Budaya', waktu:'19.30 WITA' },
  { tanggal:'20', bulan:'Mei', nama:'Odalan Pura Tirta Empul', lokasi:'Tampaksiring', kategori:'Spiritual', waktu:'Sepanjang hari' },
]

const VIRTUAL_TOURS = [
  { nama:'Tegalalang Rice Terrace — 360°', deskripsi:'Nikmati keindahan sawah terasering dari sudut pandang drone 360 derajat yang memukau.', thumbnail:'🌿', youtubeId:'dQw4w9WgXcQ', durasi:'3:42' },
  { nama:'Upacara Kecak di Puri Ubud', deskripsi:'Saksikan pertunjukan Tari Kecak tradisional dengan latar belakang matahari terbenam yang magis.', thumbnail:'🔥', youtubeId:'dQw4w9WgXcQ', durasi:'8:15' },
  { nama:'Wisata Tirta Empul', deskripsi:'Jelajahi pura suci dan ritual melukat di mata air keramat Tirta Empul secara virtual.', thumbnail:'💧', youtubeId:'dQw4w9WgXcQ', durasi:'5:30' },
  { nama:'Kerajinan Perak Celuk', deskripsi:'Lihat proses pembuatan perhiasan perak tradisional Bali oleh pengrajin maestro Desa Celuk.', thumbnail:'💍', youtubeId:'dQw4w9WgXcQ', durasi:'6:22' },
]

const WARNA_KATEGORI: Record<string, string> = {
  Alam: 'bg-green-100 text-green-700',
  Budaya: 'bg-amber-100 text-amber-700',
  Seni: 'bg-purple-100 text-purple-700',
  Belanja: 'bg-pink-100 text-pink-700',
}

const WARNA_EVENT: Record<string, string> = {
  Budaya: 'bg-purple-100 text-purple-700',
  Spiritual: 'bg-orange-100 text-orange-700',
  Ekonomi: 'bg-green-100 text-green-700',
  Festival: 'bg-pink-100 text-pink-700',
  Workshop: 'bg-blue-100 text-blue-700',
  Publik: 'bg-gray-100 text-gray-700',
}

const KATEGORI_LIST = ['Semua', 'Alam', 'Budaya', 'Seni', 'Belanja']

export default function PariwisataPage() {
  const [filterKat, setFilterKat] = useState('Semua')
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [eventPage, setEventPage] = useState(0)
  const eventsPerPage = 6
  const totalEventPages = Math.ceil(EVENTS.length / eventsPerPage)
  const visibleEvents = EVENTS.slice(eventPage * eventsPerPage, (eventPage + 1) * eventsPerPage)

  const filteredDest = filterKat === 'Semua' ? DESTINASI : DESTINASI.filter(d => d.kategori === filterKat)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🏝️</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pariwisata Gianyar</h1>
          <p className="text-sm text-gray-500">Surga seni, budaya, dan alam — {DESTINASI.length} destinasi unggulan</p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {[
          { label:'Destinasi Wisata', value:'8+', color:'green' },
          { label:'Rating Rata-rata', value:'4.6★', color:'amber' },
          { label:'Event Bulan Ini', value:`${EVENTS.length}`, color:'purple' },
          { label:'Kunjungan/thn', value:'1,2 Jt', color:'blue' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-black text-${k.color}-600`}>{k.value}</p>
            <p className="text-xs text-gray-500">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Destinasi Wisata */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-800">Destinasi Wisata Unggulan</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-gray-400" />
            {KATEGORI_LIST.map(k => (
              <button key={k} onClick={() => setFilterKat(k)}
                className={`text-xs px-3 py-1.5 rounded-full border transition font-medium
                  ${filterKat === k ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {filteredDest.map(d => (
            <article key={d.nama} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 px-5 pt-5 pb-3 flex items-center gap-3">
                <span className="text-4xl">{d.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{d.nama}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {d.lokasi}
                  </p>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${WARNA_KATEGORI[d.kategori] ?? 'bg-gray-100 text-gray-600'}`}>{d.kategori}</span>
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <Star size={11} fill="currentColor" /> {d.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{d.deskripsi}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Ticket size={11} /> {d.tiket}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {d.jam}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Virtual Tour */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Play size={20} className="text-red-600" /> Virtual Tour Gianyar
        </h2>
        <p className="text-sm text-gray-400 mb-4">Jelajahi destinasi Gianyar secara virtual dari rumah Anda</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {VIRTUAL_TOURS.map((vt, i) => (
            <div key={vt.nama} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              {activeVideo === i ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${vt.youtubeId}?autoplay=1`}
                    title={vt.nama}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <button onClick={() => setActiveVideo(i)} className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative group">
                  <span className="text-6xl">{vt.thumbnail}</span>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={24} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">{vt.durasi}</span>
                </button>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{vt.nama}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{vt.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">Konten video bersumber dari dokumentasi Dinas Pariwisata Kabupaten Gianyar</p>
      </section>

      {/* Kalender Event Budaya */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={20} className="text-amber-600" /> Kalender Event Budaya
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setEventPage(p => Math.max(0, p - 1))} disabled={eventPage === 0}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-gray-500">{eventPage + 1}/{totalEventPages}</span>
            <button onClick={() => setEventPage(p => Math.min(totalEventPages - 1, p + 1))} disabled={eventPage >= totalEventPages - 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleEvents.map(ev => (
            <div key={ev.nama + ev.tanggal}
              className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm flex gap-3 hover:shadow-md transition">
              <div className="flex-shrink-0 w-14 h-14 bg-amber-500 text-white rounded-xl flex flex-col items-center justify-center">
                <span className="text-xs font-medium leading-none">{ev.bulan}</span>
                <span className="text-xl font-bold leading-none">{ev.tanggal}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${WARNA_EVENT[ev.kategori] ?? 'bg-gray-100 text-gray-700'}`}>
                  {ev.kategori}
                </span>
                <h3 className="font-semibold text-gray-800 mt-1 text-sm leading-snug">{ev.nama}</h3>
                <p className="text-xs text-gray-500">📍 {ev.lokasi}</p>
                <p className="text-xs text-gray-400">🕐 {ev.waktu}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <p className="font-semibold mb-1">Informasi Wisata</p>
        <p className="text-xs">Harga tiket dapat berubah sewaktu-waktu. Untuk info terkini, hubungi Dinas Pariwisata Kabupaten Gianyar di{' '}
          <a href="tel:036194302" className="underline">(0361) 943020</a> atau kunjungi loket setempat.</p>
      </div>
    </div>
  )
}
