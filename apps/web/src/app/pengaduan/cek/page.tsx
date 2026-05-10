'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react'
import { createLogger } from '@/lib/logger'

const log = createLogger('CekPengaduan')

// ============================================================
// Progress steps — urutan status pengaduan
// ============================================================
const STEPS = [
  { key: 'DITERIMA',    label: 'Diterima',    desc: 'Pengaduan berhasil masuk sistem' },
  { key: 'DIVERIFIKASI',label: 'Diverifikasi',desc: 'Sedang dikonfirmasi oleh petugas' },
  { key: 'DIPROSES',    label: 'Diproses',    desc: 'Tindak lanjut sedang dikerjakan' },
  { key: 'SELESAI',     label: 'Selesai',     desc: 'Pengaduan telah diselesaikan' },
]

// Validasi nomor tiket — hanya ADU-YYYY-XXXXXX
const TIKET_REGEX = /^[A-Z]{3}-\d{4}-\d{6}$/

type StatusData = {
  nomorTiket: string
  judul: string
  kategori: string
  status: string
  createdAt: string
  deadlineAt: string
  riwayat: { status: string; catatan: string; tanggal: string }[]
}

// Mock data untuk demo — akan diganti API call
const MOCK: Record<string, StatusData> = {
  'ADU-2026-000001': {
    nomorTiket: 'ADU-2026-000001',
    judul: 'Jalan berlubang di Jl. Raya Ubud KM 3',
    kategori: 'Infrastruktur',
    status: 'DIPROSES',
    createdAt: '1 April 2026',
    deadlineAt: '15 April 2026',
    riwayat: [
      { status: 'DITERIMA',    catatan: 'Pengaduan berhasil diterima oleh sistem',       tanggal: '1 Apr 2026, 10.00' },
      { status: 'DIVERIFIKASI',catatan: 'Lapangan dikonfirmasi oleh petugas Dinas PU',   tanggal: '2 Apr 2026, 09.30' },
      { status: 'DIPROSES',    catatan: 'Tim perbaikan jalan sudah diterjunkan',         tanggal: '3 Apr 2026, 08.00' },
    ],
  },
}

export default function CekPengaduanPage() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(false)

  // Validasi real-time — cegah karakter berbahaya (SQL injection prevention)
  const handleInputChange = (val: string) => {
    const safe = val.toUpperCase().replace(/[^A-Z0-9\-]/g, '').substring(0, 15)
    setInput(safe)
    if (error) setError('')
  }

  const handleCek = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setData(null)

    // Validasi format tiket
    if (!TIKET_REGEX.test(input)) {
      setError('Format tidak valid. Contoh yang benar: ADU-2026-000001')
      log.warn('Format tiket tidak valid', { input })
      return
    }

    setLoading(true)
    try {
      // Simulasi API call — ganti dengan fetch('/api/pengaduan/cek?tiket=...')
      await new Promise((r) => setTimeout(r, 600))
      const result = MOCK[input]

      if (!result) {
        setError('Nomor tiket tidak ditemukan. Pastikan nomor tiket sudah benar.')
        log.info('Tiket tidak ditemukan', { tiket: input })
      } else {
        setData(result)
        log.info('Tiket ditemukan', { tiket: input, status: result.status })
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      log.error('Gagal cek pengaduan', e, { tiket: input })
      setError('Terjadi kesalahan sistem. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = data ? STEPS.findIndex((s) => s.key === data.status) : -1
  const isDitolak = data?.status === 'DITOLAK'

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Cek Status Pengaduan</h1>
      <p className="text-gray-500 mb-8">
        Masukkan nomor tiket yang Anda terima saat mengajukan pengaduan.
      </p>

      {/* Form */}
      <form onSubmit={handleCek} className="flex gap-3 mb-8" role="search">
        <div className="flex-1">
          <label htmlFor="tiket-input" className="sr-only">Nomor tiket pengaduan</label>
          <input
            id="tiket-input"
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="ADU-2026-000001"
            maxLength={15}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!!error}
            aria-describedby={error ? 'tiket-error' : 'tiket-hint'}
            className={`w-full px-4 py-3 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          <p id="tiket-hint" className="sr-only">
            Format nomor tiket: tiga huruf kapital, tanda hubung, empat angka tahun, tanda hubung, enam angka. Contoh: ADU-2026-000001
          </p>
        </div>
        <button
          type="submit"
          disabled={loading || input.length < 14}
          aria-busy={loading}
          className="px-6 py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Mencari...' : 'Cek'}
        </button>
      </form>

      {error && (
        <div id="tiket-error" role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 items-start">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Hasil */}
      {data && (
        <div className="space-y-6">
          {/* Info tiket */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nomor Tiket</p>
                <p className="font-mono font-bold text-blue-900 text-lg">{data.nomorTiket}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                data.status === 'SELESAI' ? 'bg-green-100 text-green-700' :
                data.status === 'DIPROSES' ? 'bg-blue-100 text-blue-700' :
                data.status === 'DITOLAK' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {data.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="font-semibold text-gray-800 mb-1">{data.judul}</h2>
            <p className="text-sm text-gray-500">{data.kategori}</p>
            <div className="mt-3 flex gap-6 text-xs text-gray-400">
              <span>Dibuat: {data.createdAt}</span>
              <span>Batas: {data.deadlineAt}</span>
            </div>
          </div>

          {/* Progress Bar Visual */}
          {!isDitolak && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-6">Progress Penanganan</h3>
              <ol className="relative" aria-label="Status pengaduan">
                {STEPS.map((step, idx) => {
                  const done = idx <= currentStep
                  const active = idx === currentStep
                  const isLast = idx === STEPS.length - 1

                  return (
                    <li key={step.key} className="flex gap-4 pb-6 last:pb-0">
                      {/* Connector line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          done ? 'bg-green-500' : 'bg-gray-200'
                        } transition-colors`}>
                          {done
                            ? <CheckCircle2 size={18} className="text-white" aria-hidden="true" />
                            : <Circle size={18} className="text-gray-400" aria-hidden="true" />
                          }
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 mt-1 ${done ? 'bg-green-300' : 'bg-gray-200'}`} aria-hidden="true" />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className={`font-semibold text-sm ${done ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                          {active && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Saat ini
                            </span>
                          )}
                        </p>
                        <p className={`text-xs mt-0.5 ${done ? 'text-gray-500' : 'text-gray-300'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}

          {/* Riwayat aktivitas */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4">Riwayat Aktivitas</h3>
            <ol className="space-y-4" aria-label="Riwayat aktivitas pengaduan">
              {data.riwayat.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <Clock size={16} className="text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{r.catatan}</p>
                    <time className="text-xs text-gray-400">{r.tanggal}</time>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Hint demo */}
      <p className="mt-8 text-xs text-gray-400 text-center">
        Demo: coba tiket <span className="font-mono">ADU-2026-000001</span>
      </p>
    </div>
  )
}
