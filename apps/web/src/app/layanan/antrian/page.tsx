'use client'
import { useState } from 'react'
import { Clock, CheckCircle, AlertCircle, Users, Calendar } from 'lucide-react'

const JENIS = [
  {value:'KTP', label:'Perekaman / Penggantian KTP'},
  {value:'KARTU_KELUARGA', label:'Permohonan Kartu Keluarga'},
  {value:'AKTA_LAHIR', label:'Akta Kelahiran'},
  {value:'PINDAH_DOMISILI', label:'Surat Pindah / Datang'},
  {value:'PERIZINAN', label:'Perizinan & Izin Usaha'},
  {value:'KONSULTASI', label:'Layanan Umum / Konsultasi'},
]

const JAM = [
  {slot:'08:00', label:'08.00 – 09.00'},
  {slot:'09:00', label:'09.00 – 10.00'},
  {slot:'10:00', label:'10.00 – 11.00'},
  {slot:'11:00', label:'11.00 – 12.00'},
  {slot:'13:00', label:'13.00 – 14.00'},
]

type Tiket = {nomor:string; jenis:string; slot:string; tanggal:string}

export default function AntrianPage() {
  const [jenis, setJenis] = useState('')
  const [slot, setSlot] = useState('')
  const [nama, setNama] = useState('')
  const [nik, setNik] = useState('')
  const [noHp, setNoHp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tiket, setTiket] = useState<Tiket|null>(null)

  const hariIni = new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

  async function handleDaftar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!jenis||!slot||!nama.trim()||nik.length!==16||noHp.length<9) {
      setError('Lengkapi semua data dengan benar.')
      return
    }
    setLoading(true)
    try {
      const tanggal = new Date().toISOString().split('T')[0]
      const res = await fetch('/api/antrian',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({layanan:jenis,waktu:slot,tanggal,nama:nama.trim(),noHp})})
      const data = await res.json()
      if (!res.ok) throw new Error(data.error??'Gagal mendaftar antrian')
      setTiket({nomor:data.data?.nomorAntrian??'-', jenis:data.data?.layanan??jenis, slot:data.data?.waktu??slot, tanggal:data.data?.tanggal??tanggal})
    } catch(err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi.')
    } finally { setLoading(false) }
  }

  if (tiket) return (
    <div className="max-w-lg mx-auto px-4 py-10 text-center">
      <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Antrian Berhasil Didaftarkan</h1>
      <p className="text-gray-500 mb-6">Simpan nomor antrian Anda</p>
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 mb-6 shadow-lg">
        <p className="text-sm text-blue-200 mb-1">Nomor Antrian</p>
        <p className="text-5xl font-black tracking-widest mb-4">{tiket.nomor}</p>
        <div className="bg-white/10 rounded-xl p-4 text-sm space-y-1">
          <p><span className="text-blue-300">Layanan:</span> {JENIS.find(j=>j.value===tiket.jenis)?.label??tiket.jenis}</p>
          <p><span className="text-blue-300">Jam:</span> {JAM.find(j=>j.slot===tiket.slot)?.label??tiket.slot}</p>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left mb-6">
        <p className="font-semibold mb-1">Petunjuk kedatangan:</p>
        <ul className="list-disc ml-4 space-y-1 text-xs">
          <li>Hadir 15 menit sebelum jam layanan</li>
          <li>Bawa KTP asli dan dokumen pendukung</li>
          <li>Tunjukkan nomor antrian ke petugas loket</li>
        </ul>
      </div>
      <button onClick={() => {setTiket(null);setJenis('');setSlot('');setNama('');setNik('');setNoHp('')}}
        className="px-6 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition">
        Daftar Antrian Baru
      </button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock size={24} className="text-blue-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Antrian Digital</h1>
          <p className="text-sm text-gray-500">Dinas Kependudukan dan Pencatatan Sipil</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
          <Calendar size={20} className="text-blue-700" />
          <div><p className="text-xs text-gray-500">Hari ini</p><p className="text-xs font-semibold text-gray-800">{hariIni}</p></div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
          <Users size={20} className="text-green-700" />
          <div><p className="text-xs text-gray-500">Kapasitas/slot</p><p className="text-sm font-bold text-gray-800">10 orang</p></div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
          <Clock size={20} className="text-amber-700" />
          <div><p className="text-xs text-gray-500">Jam pelayanan</p><p className="text-sm font-bold text-gray-800">08.00 – 15.00</p></div>
        </div>
      </div>

      <form onSubmit={handleDaftar} className="space-y-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">Formulir Pendaftaran Antrian</h2>

        <div>
          <label htmlFor="jenis" className="block text-sm font-medium text-gray-700 mb-1">Jenis Layanan <span className="text-red-500">*</span></label>
          <select id="jenis" value={jenis} onChange={e=>setJenis(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Pilih Layanan --</option>
            {JENIS.map(j=><option key={j.value} value={j.value}>{j.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jam <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-3 gap-2">
            {JAM.map(j=>(
              <button type="button" key={j.slot} onClick={()=>setSlot(j.slot)}
                className={`border rounded-lg py-2 text-sm font-medium transition ${slot===j.slot?'bg-blue-900 text-white border-blue-900':'border-gray-200 text-gray-700 hover:border-blue-300'}`}>
                {j.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
          <input id="nama" type="text" value={nama} onChange={e=>setNama(e.target.value)} placeholder="Sesuai KTP"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">NIK <span className="text-red-500">*</span></label>
          <input id="nik" type="text" value={nik} onChange={e=>setNik(e.target.value.replace(/\D/g,'').slice(0,16))} placeholder="16 digit NIK"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-xs text-gray-400 mt-0.5">{nik.length}/16 digit</p>
        </div>

        <div>
          <label htmlFor="noHp" className="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp <span className="text-red-500">*</span></label>
          <input id="noHp" type="tel" value={noHp} onChange={e=>setNoHp(e.target.value.replace(/\D/g,'').slice(0,15))} placeholder="08xxxxxxxxxx"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700" role="alert">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-60 transition">
          {loading?'Mendaftarkan...':'Ambil Nomor Antrian'}
        </button>
      </form>
    </div>
  )
}
