'use client'
import { useState } from 'react'
import { QrCode, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const MOCK_DOCS: Record<string, { jenis: string; nama: string; tanggal: string; pejabat: string; valid: boolean }> = {
  'GYR-2026-KTP-000123': { jenis:'KTP Elektronik', nama:'I Made Surya', tanggal:'15 Maret 2026', pejabat:'Kepala Dukcapil Gianyar', valid: true },
  'GYR-2026-KK-000456': { jenis:'Kartu Keluarga', nama:'Ni Wayan Dewi', tanggal:'10 Februari 2026', pejabat:'Kepala Dukcapil Gianyar', valid: true },
  'GYR-2026-AKT-000789': { jenis:'Akta Kelahiran', nama:'Gede Bagus Rahmat', tanggal:'5 Januari 2026', pejabat:'Kepala Dukcapil Gianyar', valid: false },
}

export default function VerifikasiPage() {
  const [kode, setKode] = useState('')
  const [hasil, setHasil] = useState<null | { found: boolean; data?: typeof MOCK_DOCS[string] }>(null)
  const [loading, setLoading] = useState(false)

  function handleCek(e: React.FormEvent) {
    e.preventDefault()
    const k = kode.trim().toUpperCase()
    if (!/^GYR-\d{4}-[A-Z]{2,5}-\d{6}$/.test(k)) {
      setHasil({ found: false })
      return
    }
    setLoading(true)
    setTimeout(() => {
      const d = MOCK_DOCS[k]
      setHasil(d ? { found: true, data: d } : { found: false })
      setLoading(false)
    }, 800)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <QrCode size={24} className="text-blue-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Verifikasi Dokumen</h1>
          <p className="text-sm text-gray-500">Cek keaslian dokumen resmi Pemkab Gianyar</p>
        </div>
      </div>

      <form onSubmit={handleCek} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <label htmlFor="kode" className="block text-sm font-medium text-gray-700 mb-1">
          Kode Verifikasi Dokumen
        </label>
        <input id="kode" type="text" value={kode} onChange={e => setKode(e.target.value)}
          placeholder="GYR-2026-KTP-000123"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 uppercase"
          maxLength={22} />
        <p className="text-xs text-gray-400 mb-4">Format: GYR-TAHUN-JENIS-NOMOR. Tertera pada bagian bawah dokumen resmi.</p>
        <button type="submit" disabled={loading || !kode.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-60 transition">
          <Search size={16} /> {loading ? 'Memeriksa...' : 'Verifikasi Dokumen'}
        </button>
      </form>

      {hasil && (
        <div className={`rounded-2xl p-6 border ${hasil.found && hasil.data?.valid ? 'bg-green-50 border-green-200' : hasil.found && !hasil.data?.valid ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          {!hasil.found && (
            <div className="flex items-center gap-3 text-gray-600">
              <XCircle size={28} className="text-gray-400" />
              <div>
                <p className="font-bold">Dokumen Tidak Ditemukan</p>
                <p className="text-sm mt-0.5">Kode tidak terdaftar di sistem. Pastikan kode benar atau hubungi Dukcapil.</p>
              </div>
            </div>
          )}
          {hasil.found && hasil.data?.valid && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={28} className="text-green-600" />
                <div>
                  <p className="font-bold text-green-800">Dokumen Valid & Asli</p>
                  <p className="text-xs text-green-600">Dokumen terdaftar dan sah secara hukum</p>
                </div>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Jenis</dt><dd className="font-medium">{hasil.data.jenis}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Atas Nama</dt><dd className="font-medium">{hasil.data.nama}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Tanggal Terbit</dt><dd className="font-medium">{hasil.data.tanggal}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Pejabat</dt><dd className="font-medium text-right max-w-xs">{hasil.data.pejabat}</dd></div>
              </dl>
            </>
          )}
          {hasil.found && !hasil.data?.valid && (
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle size={28} />
              <div>
                <p className="font-bold">Dokumen Tidak Valid</p>
                <p className="text-sm mt-0.5">Dokumen ditemukan namun telah dicabut/tidak berlaku. Segera hubungi Dukcapil Gianyar.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-600 mb-1">Kode demo untuk pengujian:</p>
        {Object.keys(MOCK_DOCS).map(k => (
          <button key={k} onClick={() => setKode(k)} className="block font-mono text-blue-600 hover:underline mb-0.5">{k}</button>
        ))}
      </div>
    </div>
  )
}
