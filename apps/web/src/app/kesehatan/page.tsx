'use client'
import { useState } from 'react'
import { Heart, Droplets, Bed, RefreshCw, Phone, MapPin, AlertTriangle, ChevronRight } from 'lucide-react'

const RSUD = {
  nama: 'RSUD Sanjiwani Gianyar',
  alamat: 'Jl. Ngurah Rai No. 2, Gianyar',
  telp: '(0361) 943020',
  igd: '(0361) 943020 ext 118',
}

const BANGSAL = [
  { nama:'IGD', kapasitas:20, terisi:14, prioritas:'KRITIS' },
  { nama:'ICU', kapasitas:10, terisi:9, prioritas:'KRITIS' },
  { nama:'Interna / Penyakit Dalam', kapasitas:40, terisi:28, prioritas:'NORMAL' },
  { nama:'Bedah', kapasitas:30, terisi:19, prioritas:'NORMAL' },
  { nama:'Anak (Pediatri)', kapasitas:25, terisi:11, prioritas:'NORMAL' },
  { nama:'Kebidanan & Kandungan', kapasitas:20, terisi:15, prioritas:'NORMAL' },
  { nama:'Syaraf (Neurologi)', kapasitas:15, terisi:8, prioritas:'NORMAL' },
  { nama:'Isolasi', kapasitas:12, terisi:3, prioritas:'NORMAL' },
]

const STOK_DARAH = [
  { golongan:'A+', stok:42, kebutuhan:20, status:'CUKUP' },
  { golongan:'A-', stok:8, kebutuhan:5, status:'CUKUP' },
  { golongan:'B+', stok:15, kebutuhan:18, status:'MENIPIS' },
  { golongan:'B-', stok:3, kebutuhan:4, status:'KRITIS' },
  { golongan:'O+', stok:67, kebutuhan:30, status:'CUKUP' },
  { golongan:'O-', stok:5, kebutuhan:8, status:'MENIPIS' },
  { golongan:'AB+', stok:22, kebutuhan:10, status:'CUKUP' },
  { golongan:'AB-', stok:2, kebutuhan:3, status:'KRITIS' },
]

const PUSKESMAS = [
  { nama:'Puskesmas Gianyar I', kecamatan:'Gianyar', telp:'(0361) 943007', status:'BUKA', jadwal:'Senin–Sabtu 07.30–14.00' },
  { nama:'Puskesmas Ubud I', kecamatan:'Ubud', telp:'(0361) 975024', status:'BUKA', jadwal:'Senin–Sabtu 07.30–14.00' },
  { nama:'Puskesmas Sukawati I', kecamatan:'Sukawati', telp:'(0361) 298182', status:'BUKA', jadwal:'Senin–Sabtu 07.30–14.00' },
  { nama:'Puskesmas Blahbatuh I', kecamatan:'Blahbatuh', telp:'(0361) 942109', status:'BUKA', jadwal:'Senin–Sabtu 07.30–14.00' },
  { nama:'Puskesmas Tampaksiring I', kecamatan:'Tampaksiring', telp:'(0361) 901090', status:'BUKA', jadwal:'Senin–Sabtu 07.30–14.00' },
  { nama:'Puskesmas Tegallalang I', kecamatan:'Tegallalang', telp:'(0361) 901082', status:'BUKA', jadwal:'Senin–Sabtu 07.30–14.00' },
  { nama:'Puskesmas Payangan', kecamatan:'Payangan', telp:'(0361) 982026', status:'BUKA', jadwal:'Senin–Sabtu 07.30–14.00' },
]

const STOK_COLOR: Record<string,string> = {
  CUKUP: 'bg-green-100 text-green-700 border-green-200',
  MENIPIS: 'bg-amber-100 text-amber-700 border-amber-200',
  KRITIS: 'bg-red-100 text-red-700 border-red-200',
}

function getOkupansi(terisi: number, kapasitas: number) {
  const pct = Math.round((terisi/kapasitas)*100)
  if (pct >= 90) return { pct, color:'bg-red-500', label:'Penuh', textColor:'text-red-600' }
  if (pct >= 70) return { pct, color:'bg-amber-500', label:'Hampir Penuh', textColor:'text-amber-600' }
  return { pct, color:'bg-green-500', label:'Tersedia', textColor:'text-green-600' }
}

export default function KesehatanPage() {
  const [lastUpdate] = useState(new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}))
  const [, setRefreshKey] = useState(0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Heart size={24} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kesehatan &amp; Fasilitas Publik</h1>
          <p className="text-sm text-gray-500">Ketersediaan tempat tidur RS & stok darah PMI Gianyar</p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-4 gap-3 my-6">
        {[
          { label:'Tempat Tidur Tersedia', value:`${BANGSAL.reduce((s,b)=>s+(b.kapasitas-b.terisi),0)}`, sub:'dari '+BANGSAL.reduce((s,b)=>s+b.kapasitas,0)+' total', color:'blue' },
          { label:'Stok Darah Kritis', value:`${STOK_DARAH.filter(d=>d.status==='KRITIS').length} gol.`, sub:'Butuh donor segera', color:'red' },
          { label:'Puskesmas Buka', value:`${PUSKESMAS.filter(p=>p.status==='BUKA').length}/${PUSKESMAS.length}`, sub:'Hari ini', color:'green' },
          { label:'Update', value:lastUpdate, sub:'WITA', color:'gray' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
            <p className={`text-2xl font-black text-${k.color}-600`}>{k.value}</p>
            <p className="text-xs font-semibold text-gray-700">{k.label}</p>
            <p className="text-xs text-gray-400">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* RSUD Ketersediaan Kamar */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bed size={20} className="text-blue-700" /> {RSUD.nama}
            </h2>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={11}/> {RSUD.alamat}
              <span className="ml-3"><Phone size={11} className="inline mr-1" />
                <a href={`tel:${RSUD.igd.replace(/[^0-9]/g,'')}`} className="text-blue-600 hover:underline">IGD: {RSUD.igd}</a>
              </span>
            </p>
          </div>
          <button onClick={() => setRefreshKey(k=>k+1)} className="flex items-center gap-1.5 text-xs text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {BANGSAL.map(b => {
            const occ = getOkupansi(b.terisi, b.kapasitas)
            return (
              <div key={b.nama} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {b.prioritas === 'KRITIS' && <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />}
                    <h3 className="font-semibold text-gray-800 text-sm">{b.nama}</h3>
                  </div>
                  <span className={`text-xs font-bold ${occ.textColor}`}>{b.kapasitas - b.terisi} kosong</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full mb-2">
                  <div className={`h-full rounded-full transition-all ${occ.color}`} style={{width:`${occ.pct}%`}} />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{b.terisi}/{b.kapasitas} terisi ({occ.pct}%)</span>
                  <span className={occ.textColor}>{occ.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Stok Darah PMI */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Droplets size={20} className="text-red-600" /> Stok Darah PMI Gianyar
        </h2>
        <p className="text-sm text-gray-400 mb-4">Hubungi PMI: <a href="tel:0361943272" className="text-blue-600 hover:underline">(0361) 943272</a> untuk donor atau permintaan darah</p>

        {/* Alert kritis */}
        {STOK_DARAH.some(d=>d.status==='KRITIS') && (
          <div className="bg-red-50 border border-red-300 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-700">Stok Darah Kritis!</p>
              <p className="text-sm text-red-600">
                Golongan darah {STOK_DARAH.filter(d=>d.status==='KRITIS').map(d=>d.golongan).join(', ')} sangat dibutuhkan.
                Ayo jadi pendonor!
              </p>
              <a href="tel:0361943272" className="inline-flex items-center gap-1 mt-2 text-xs bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-500 transition font-medium">
                <Phone size={11} /> Hubungi PMI Sekarang
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STOK_DARAH.map(d => (
            <div key={d.golongan} className={`border rounded-2xl p-4 text-center ${STOK_COLOR[d.status]}`}>
              <p className="text-3xl font-black mb-1">{d.golongan}</p>
              <p className="text-2xl font-bold">{d.stok}</p>
              <p className="text-xs opacity-70 mb-1">kantong tersedia</p>
              <div className="h-1.5 bg-white/50 rounded-full">
                <div className="h-full bg-current rounded-full opacity-60" style={{width:`${Math.min((d.stok/d.kebutuhan)*100, 100)}%`}} />
              </div>
              <p className={`text-xs font-bold mt-1.5 ${d.status==='KRITIS'?'animate-pulse':''}`}>{d.status}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Puskesmas */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-green-600" /> Puskesmas Kecamatan
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {PUSKESMAS.map(p => (
            <div key={p.nama} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{p.nama}</h3>
                </div>
                <p className="text-xs text-gray-400">{p.jadwal}</p>
                <a href={`tel:${p.telp.replace(/[^0-9]/g,'')}`} className="text-xs text-blue-600 hover:underline">{p.telp}</a>
              </div>
              <a href={`https://maps.google.com/?q=${p.nama.replace(/ /,'+')}+${p.kecamatan}+Bali`} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 p-2 bg-gray-50 rounded-xl hover:bg-blue-50 transition" aria-label="Lihat peta">
                <ChevronRight size={16} className="text-gray-400" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
