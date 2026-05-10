import type { Metadata } from 'next'
import { Clock, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jadwal Pelayanan — Portal Gianyar',
  description: 'Jadwal dan jam operasional pelayanan publik Pemerintah Kabupaten Gianyar',
}

const JADWAL = [
  {hari:'Senin', buka:'08.00', tutup:'15.30', istirahat:'12.00–13.00', status:'buka'},
  {hari:'Selasa', buka:'08.00', tutup:'15.30', istirahat:'12.00–13.00', status:'buka'},
  {hari:'Rabu', buka:'08.00', tutup:'15.30', istirahat:'12.00–13.00', status:'buka'},
  {hari:'Kamis', buka:'08.00', tutup:'15.30', istirahat:'12.00–13.00', status:'buka'},
  {hari:'Jumat', buka:'08.00', tutup:'14.30', istirahat:'11.30–13.00', status:'buka'},
  {hari:'Sabtu', buka:'-', tutup:'-', istirahat:'-', status:'tutup'},
  {hari:'Minggu', buka:'-', tutup:'-', istirahat:'-', status:'tutup'},
]

const UNIT = [
  {nama:'Dinas Kependudukan & Capil', singkatan:'Dukcapil', alamat:'Jl. Ngurah Rai No.1, Gianyar', telp:'(0361) 943002', layanan:['KTP','KK','Akta Lahir','Surat Pindah']},
  {nama:'Dinas Penanaman Modal & PTSP', singkatan:'DPMPTSP', alamat:'Komplek Perkantoran Pemkab', telp:'(0361) 943008', layanan:['IMB','Izin Usaha','Izin Pariwisata']},
  {nama:'Kantor Kecamatan Ubud', singkatan:'Kec. Ubud', alamat:'Jl. Raya Ubud, Ubud', telp:'(0361) 975685', layanan:['Surat Keterangan','Legalisir']},
  {nama:'Kantor Kecamatan Gianyar', singkatan:'Kec. Gianyar', alamat:'Jl. Ciung Wanara, Gianyar', telp:'(0361) 943001', layanan:['Surat Keterangan','SKCK Pengantar']},
]

const LIBUR = [
  {tanggal:'14 Mar 2026', keterangan:'Nyepi (Tahun Baru Saka 1948)'},
  {tanggal:'31 Mar 2026', keterangan:'Hari Raya Idul Fitri'},
  {tanggal:'1 Apr 2026', keterangan:'Cuti Bersama Idul Fitri'},
  {tanggal:'1 Mei 2026', keterangan:'Hari Buruh Internasional'},
  {tanggal:'29 Mei 2026', keterangan:'Kenaikan Isa Almasih'},
]

export default function JadwalPage() {
  const hariIni = new Date().toLocaleDateString('id-ID',{weekday:'long'})

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Jadwal Pelayanan</h1>
      <p className="text-gray-500 mb-8">Jam operasional dan unit layanan Pemerintah Kabupaten Gianyar</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={20} className="text-blue-700" /> Jam Pelayanan Umum</h2>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-blue-900 text-white">
              <th className="text-left px-5 py-3">Hari</th>
              <th className="text-left px-5 py-3">Buka</th>
              <th className="text-left px-5 py-3 hidden sm:table-cell">Istirahat</th>
              <th className="text-left px-5 py-3">Tutup</th>
            </tr></thead>
            <tbody>
              {JADWAL.map((j,i) => {
                const isToday = j.hari.toLowerCase() === hariIni.toLowerCase()
                return (
                  <tr key={j.hari} className={`border-t border-gray-50 ${i%2===0?'bg-white':'bg-gray-50'} ${isToday?'ring-2 ring-inset ring-blue-300':''}`}>
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {j.hari} {isToday && <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">Hari ini</span>}
                    </td>
                    <td className={`px-5 py-3 font-semibold ${j.status==='tutup'?'text-red-500':'text-green-700'}`}>
                      {j.status==='tutup'?'Libur':j.buka}
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{j.status==='tutup'?'—':j.istirahat}</td>
                    <td className="px-5 py-3 text-gray-700">{j.status==='tutup'?'—':j.tutup}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={20} className="text-blue-700" /> Unit Pelayanan</h2>
        <div className="space-y-3">
          {UNIT.map(u => (
            <div key={u.nama} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-gray-800">{u.nama}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {u.alamat}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} />
                    <a href={`tel:${u.telp.replace(/[^+\d]/g,'')}`} className="hover:text-blue-700">{u.telp}</a>
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-full flex-shrink-0">{u.singkatan}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {u.layanan.map(l => <span key={l} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{l}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hari Libur 2026</h2>
        <div className="bg-red-50 border border-red-100 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-red-100">
            {LIBUR.map(l => (
              <li key={l.tanggal} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-gray-700">{l.keterangan}</span>
                <span className="text-sm font-semibold text-red-700 font-mono">{l.tanggal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
