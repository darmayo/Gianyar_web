import type { Metadata } from 'next'
import { MapPin, Phone, Globe, CheckCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Direktori UMKM — Kabupaten Gianyar',
  description: 'Direktori vendor dan UMKM asli Kabupaten Gianyar: kerajinan, kuliner, fashion, dan jasa lokal',
}

const UMKM_LIST = [
  { id:1, nama:'Celuk Silver Artisans', pemilik:'I Wayan Merta', kategori:'Kerajinan Perak', lokasi:'Celuk, Sukawati', telp:'0813-3845-1122', web:'celuksilver.com', rating:4.9, produk:'Perhiasan perak filigri, cincin, gelang ukir motif Bali', terverifikasi:true, deskripsi:'Pengrajin perak generasi ketiga dengan teknik ukir tradisional Bali. Melayani pesanan kustom dan ekspor.' },
  { id:2, nama:'Dapur Bali Bu Ketut', pemilik:'Ni Ketut Sari', kategori:'Kuliner', lokasi:'Sukawati, Gianyar', telp:'0856-4521-7890', web:null, rating:4.7, produk:'Lawar, sate lilit, babi guling, nasi campur khas Bali', terverifikasi:true, deskripsi:'Masakan Bali otentik resep turun-temurun. Tersedia catering untuk acara adat dan pesta.' },
  { id:3, nama:'Ubud Batik & Endek', pemilik:'I Made Suarjana', kategori:'Fashion', lokasi:'Ubud, Gianyar', telp:'0812-3847-6655', web:'ubudbatik.id', rating:4.6, produk:'Kain endek, baju batik motif Bali, sarung, selendang', terverifikasi:true, deskripsi:'Produsen kain endek Bali dengan alat tenun tradisional ATBM. Menerima grosir dan eceran.' },
  { id:4, nama:'Mas Wood Carving Gallery', pemilik:'I Nyoman Karsa', kategori:'Kerajinan Kayu', lokasi:'Mas, Ubud', telp:'0819-9988-7766', web:null, rating:4.8, produk:'Patung Garuda, topeng, relief ukir, furniture ukir Bali', terverifikasi:true, deskripsi:'Galeri ukiran kayu premium dari kayu jati dan mahoni. Pengerjaan 100% hand-carved oleh pengrajin berpengalaman.' },
  { id:5, nama:'Gianyar Organic Farm', pemilik:'I Gede Widana', kategori:'Pertanian', lokasi:'Payangan, Gianyar', telp:'0878-1234-5678', web:'gianyarorganic.com', rating:4.5, produk:'Sayur organik, buah-buahan segar, produk olahan pertanian', terverifikasi:false, deskripsi:'Pertanian organik bersertifikat yang menyuplai hotel dan restoran di Ubud dan Gianyar.' },
  { id:6, nama:'Tegalalang Agrotourism', pemilik:'Ni Wayan Darmi', kategori:'Agrowisata', lokasi:'Tegallalang, Gianyar', telp:'0821-5566-4433', web:'tegalalangagro.com', rating:4.7, produk:'Paket wisata edukasi pertanian, kopi luwak, produk herbal', terverifikasi:true, deskripsi:'Wisata agro di terasering Tegalalang dengan pengalaman menanam padi, panen kopi, dan membuat jamu tradisional.' },
]

const kategoriColor: Record<string, string> = {
  'Kerajinan Perak': 'bg-gray-100 text-gray-700',
  'Kuliner': 'bg-orange-100 text-orange-700',
  'Fashion': 'bg-pink-100 text-pink-700',
  'Kerajinan Kayu': 'bg-amber-100 text-amber-700',
  'Pertanian': 'bg-green-100 text-green-700',
  'Agrowisata': 'bg-teal-100 text-teal-700',
}

export default function UMKMPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Direktori UMKM Gianyar</h1>
      <p className="text-gray-500 mb-8">Temukan produk dan jasa unggulan dari pelaku usaha lokal Kabupaten Gianyar</p>

      {/* Banner daftar */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-amber-800">Punya usaha di Gianyar?</p>
          <p className="text-xs text-amber-700 mt-0.5">Daftarkan UMKM Anda secara gratis agar lebih mudah ditemukan.</p>
        </div>
        <a href="mailto:diskoperindag@gianyarkab.go.id?subject=Daftar%20UMKM%20Gianyar"
          className="text-xs font-semibold bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition flex-shrink-0">
          Daftarkan UMKM
        </a>
      </div>

      <div className="space-y-5">
        {UMKM_LIST.map(u => (
          <article key={u.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-bold text-gray-800">{u.nama}</h2>
                  {u.terverifikasi && (
                    <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle size={11} /> Terverifikasi
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Pemilik: {u.pemilik}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${kategoriColor[u.kategori]}`}>{u.kategori}</span>
                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium"><Star size={11} fill="currentColor" /> {u.rating}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{u.deskripsi}</p>
            <p className="text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg px-3 py-2"><strong>Produk:</strong> {u.produk}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={11} /> {u.lokasi}</span>
                <a href={`tel:${u.telp.replace(/[-\s]/g,'')}`} className="flex items-center gap-1 hover:text-blue-700">
                  <Phone size={11} /> {u.telp}
                </a>
                {u.web && (
                  <a href={`https://${u.web}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-700">
                    <Globe size={11} /> {u.web}
                  </a>
                )}
              </div>
              <a href={`https://wa.me/62${u.telp.replace(/^0/,'').replace(/[-\s]/g,'')}?text=Halo%20${encodeURIComponent(u.nama)}%2C%20saya%20tertarik%20dengan%20produk%20Anda`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs bg-green-50 text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-100 transition flex-shrink-0">
                WhatsApp
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
