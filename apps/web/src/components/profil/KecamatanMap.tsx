'use client'
import { useState } from 'react'
import { MapPin, X, Users, TreePine, Navigation } from 'lucide-react'

const KECAMATAN = [
  {
    nama: 'Gianyar',
    ibukota: 'Gianyar',
    luas: '50,59 km²',
    desa: '16 Desa / 4 Kelurahan',
    penduduk: '~95.000 jiwa',
    terkenal: 'Pusat pemerintahan, Puri Gianyar, Pasar Gianyar',
    mapQ: 'Kecamatan+Gianyar+Kabupaten+Gianyar+Bali+Indonesia',
    lat: -8.5296, lng: 115.3319,
  },
  {
    nama: 'Blahbatuh',
    ibukota: 'Blahbatuh',
    luas: '39,70 km²',
    desa: '10 Desa',
    penduduk: '~68.000 jiwa',
    terkenal: 'Pura Gaduh, Desa Bona, kerajinan lontar',
    mapQ: 'Kecamatan+Blahbatuh+Gianyar+Bali+Indonesia',
    lat: -8.5538, lng: 115.2812,
  },
  {
    nama: 'Sukawati',
    ibukota: 'Sukawati',
    luas: '55,02 km²',
    desa: '12 Desa',
    penduduk: '~103.000 jiwa',
    terkenal: 'Pasar Seni Sukawati, Desa Celuk (emas & perak)',
    mapQ: 'Kecamatan+Sukawati+Gianyar+Bali+Indonesia',
    lat: -8.5820, lng: 115.2923,
  },
  {
    nama: 'Ubud',
    ibukota: 'Ubud',
    luas: '42,38 km²',
    desa: '7 Desa / 1 Kelurahan',
    penduduk: '~76.000 jiwa',
    terkenal: 'Monkey Forest, Tegalalang, pusat seni & wisata dunia',
    mapQ: 'Kecamatan+Ubud+Gianyar+Bali+Indonesia',
    lat: -8.5069, lng: 115.2624,
  },
  {
    nama: 'Tampaksiring',
    ibukota: 'Tampaksiring',
    luas: '42,63 km²',
    desa: '8 Desa',
    penduduk: '~47.000 jiwa',
    terkenal: 'Pura Tirta Empul, Istana Kepresidenan, Goa Gajah',
    mapQ: 'Kecamatan+Tampaksiring+Gianyar+Bali+Indonesia',
    lat: -8.4184, lng: 115.3149,
  },
  {
    nama: 'Tegallalang',
    ibukota: 'Tegallalang',
    luas: '61,80 km²',
    desa: '7 Desa',
    penduduk: '~43.000 jiwa',
    terkenal: 'Sawah terasering Tegalalang (UNESCO), Desa Mas ukiran',
    mapQ: 'Kecamatan+Tegallalang+Gianyar+Bali+Indonesia',
    lat: -8.4290, lng: 115.2787,
  },
  {
    nama: 'Payangan',
    ibukota: 'Payangan',
    luas: '75,88 km²',
    desa: '9 Desa',
    penduduk: '~38.000 jiwa',
    terkenal: 'Agrowisata, Tukad Oos, destinasi eco-tourism',
    mapQ: 'Kecamatan+Payangan+Gianyar+Bali+Indonesia',
    lat: -8.3737, lng: 115.2423,
  },
]

export function KecamatanMap() {
  const [selected, setSelected] = useState<typeof KECAMATAN[0] | null>(null)

  function handleClick(k: typeof KECAMATAN[0]) {
    setSelected(prev => prev?.nama === k.nama ? null : k)
  }

  const mapSrc = selected
    ? `https://maps.google.com/maps?q=${selected.mapQ}&z=13&output=embed`
    : null

  return (
    <div>
      {/* Grid Kecamatan */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {KECAMATAN.map(k => (
          <button
            key={k.nama}
            onClick={() => handleClick(k)}
            className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm text-left transition-all group
              ${selected?.nama === k.nama
                ? 'bg-blue-900 border-blue-900 text-white shadow-md scale-[1.02]'
                : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
              }`}
          >
            <MapPin
              size={14}
              className={`flex-shrink-0 transition-colors ${selected?.nama === k.nama ? 'text-blue-300' : 'text-red-400 group-hover:text-blue-500'}`}
            />
            <span className={`text-sm font-medium transition-colors ${selected?.nama === k.nama ? 'text-white' : 'text-gray-700'}`}>
              Kec. {k.nama}
            </span>
            {selected?.nama === k.nama && (
              <X size={12} className="ml-auto text-blue-300" />
            )}
          </button>
        ))}
      </div>

      {/* Panel Peta — muncul saat kecamatan dipilih */}
      {selected && (
        <div className="mt-4 bg-white border border-blue-200 rounded-2xl shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="bg-blue-900 text-white px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Kecamatan {selected.nama}</h3>
              <p className="text-blue-300 text-xs">Kabupaten Gianyar, Bali</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="p-1.5 hover:bg-blue-800 rounded-lg transition"
              aria-label="Tutup peta"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Info Sidebar */}
            <div className="md:col-span-2 p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Ibu Kota', value: selected.ibukota, icon: MapPin },
                  { label: 'Luas', value: selected.luas, icon: Navigation },
                  { label: 'Desa/Kel.', value: selected.desa, icon: TreePine },
                  { label: 'Penduduk', value: selected.penduduk, icon: Users },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                      <item.icon size={10} /> {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Dikenal dengan</p>
                <p className="text-xs text-blue-800 leading-relaxed">{selected.terkenal}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${selected.mapQ}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-blue-900 text-white rounded-xl text-xs font-medium hover:bg-blue-800 transition"
              >
                <Navigation size={13} /> Buka di Google Maps
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="md:col-span-3 h-72 md:h-auto">
              <iframe
                title={`Peta Kecamatan ${selected.nama}`}
                src={mapSrc!}
                width="100%"
                height="100%"
                style={{ minHeight: '280px', border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
