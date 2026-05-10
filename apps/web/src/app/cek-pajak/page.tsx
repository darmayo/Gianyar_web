'use client'
import { useState } from 'react'
import { FileText, Search, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

type PajakResult = {
  nop: string
  tahun: number
  namaWajibPajak: string
  alamatObjek: string
  luasTanah: number
  nilaiJualObjekPajak: number
  tagihan: number
  sudahBayar: boolean
  tanggalBayar: string | null
  ratelimitRemaining: number
}

const TAHUN_OPTIONS = [2026, 2025, 2024]

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function CekPajakPage() {
  const { t } = useLang()
  const [nop, setNop] = useState('')
  const [tahun, setTahun] = useState(2026)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PajakResult | null>(null)
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)

  async function handleCek(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    const nopClean = nop.trim()
    // Validasi dasar format NOP sebelum kirim ke API
    if (!/^\d{2}\.\d{2}\.\d{3}\.\d{3}\.\d{3}-\d{4}\.\d$/.test(nopClean)) {
      setError(t('Format NOP tidak valid. Contoh: 51.04.010.001.001-0001.0', 'Invalid NOP format. Example: 51.04.010.001.001-0001.0'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/cek-pajak?nop=${encodeURIComponent(nopClean)}&tahun=${tahun}`)
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 429) {
          setError(t(`Batas pengecekan tercapai. Coba lagi dalam ${data.retryAfterSeconds ?? 60} detik.`, `Check limit reached. Try again in ${data.retryAfterSeconds ?? 60} seconds.`))
        } else {
          setError(data.error ?? t('Terjadi kesalahan', 'An error occurred'))
        }
        return
      }
      setResult(data)
      setRemaining(data.ratelimitRemaining)
    } catch {
      setError(t('Gagal terhubung ke server. Periksa koneksi internet Anda.', 'Failed to connect to server. Check your internet connection.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
          <FileText size={24} className="text-teal-700 dark:text-teal-300" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t('Cek Pajak Bumi & Bangunan (PBB-P2)', 'Check Land & Building Tax (PBB-P2)')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t('Badan Pendapatan Daerah Kabupaten Gianyar', 'Regional Revenue Agency of Gianyar Regency')}</p>
        </div>
      </div>

      {/* Info NOP */}
      <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl p-4 mb-6 flex gap-3">
        <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-slate-300">
          <p className="font-semibold">{t('Di mana menemukan NOP?', 'Where to find the NOP?')}</p>
          <p className="text-xs mt-0.5">
            {t('NOP (Nomor Objek Pajak) tertera di pojok kiri atas SPPT tahun sebelumnya.', 'NOP (Tax Object Number) is printed at the top-left corner of the previous year\'s SPPT.')}
            {' '}{t('Format:', 'Format:')} <span className="font-mono bg-blue-100 dark:bg-slate-700 px-1 rounded">51.04.010.001.001-0001.0</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleCek} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="nop" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('NOP (Nomor Objek Pajak)', 'NOP (Tax Object Number)')} <span className="text-red-500">*</span>
            </label>
            <input
              id="nop"
              type="text"
              value={nop}
              onChange={e => setNop(e.target.value)}
              placeholder="51.04.010.001.001-0001.0"
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              maxLength={25}
            />
          </div>
          <div>
            <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('Tahun Pajak', 'Tax Year')}
            </label>
            <select
              id="tahun"
              value={tahun}
              onChange={e => setTahun(Number(e.target.value))}
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {TAHUN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400" role="alert">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" /> {error}
          </div>
        )}

        {remaining !== null && (
          <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">{t('Sisa kuota pengecekan menit ini:', 'Remaining checks this minute:')} {remaining}</p>
        )}

        <button type="submit" disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 disabled:opacity-60 transition">
          <Search size={16} /> {loading ? t('Mencari...', 'Searching...') : t('Cek Tagihan PBB', 'Check Tax Bill')}
        </button>
      </form>

      {/* Hasil */}
      {result && (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-slate-700">
            {result.sudahBayar
              ? <CheckCircle size={28} className="text-green-500" />
              : <XCircle size={28} className="text-red-500" />
            }
            <div>
              <p className="font-bold text-gray-800 dark:text-slate-100 text-lg">
                {result.sudahBayar ? t('Lunas', 'Paid') : t('Belum Lunas', 'Unpaid')}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">{t('PBB Tahun', 'Land Tax Year')} {result.tahun}</p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-slate-400">NOP</dt>
              <dd className="font-mono font-medium text-gray-800 dark:text-slate-100">{result.nop}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-slate-400">{t('Wajib Pajak', 'Taxpayer')}</dt>
              <dd className="font-medium text-gray-800 dark:text-slate-100">{result.namaWajibPajak}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-slate-400">{t('Alamat Objek', 'Object Address')}</dt>
              <dd className="font-medium text-gray-800 dark:text-slate-100 text-right max-w-xs">{result.alamatObjek}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-slate-400">{t('Luas Tanah', 'Land Area')}</dt>
              <dd className="font-medium text-gray-800 dark:text-slate-100">{result.luasTanah.toLocaleString('id-ID')} m²</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-slate-400">NJOP</dt>
              <dd className="font-medium text-gray-800 dark:text-slate-100">{formatRupiah(result.nilaiJualObjekPajak)}</dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
              <dt className="font-semibold text-gray-700 dark:text-slate-300">{t('Tagihan PBB', 'Tax Bill')}</dt>
              <dd className={`font-bold text-lg ${result.sudahBayar ? 'text-green-700' : 'text-red-700'}`}>
                {formatRupiah(result.tagihan)}
              </dd>
            </div>
            {result.tanggalBayar && (
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-slate-400">{t('Tanggal Lunas', 'Payment Date')}</dt>
                <dd className="text-green-700 font-medium">{result.tanggalBayar}</dd>
              </div>
            )}
          </dl>

          {!result.sudahBayar && (
            <div className="mt-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
              <p className="font-semibold mb-1">{t('Cara Pembayaran PBB', 'How to Pay Land Tax')}</p>
              <ul className="list-disc ml-4 space-y-0.5 text-xs text-amber-700 dark:text-amber-400">
                <li>{t('ATM BPD Bali / BRI / Mandiri dengan kode billing', 'ATM BPD Bali / BRI / Mandiri with billing code')}</li>
                <li>{t('Kantor Pos terdekat', 'Nearest Post Office')}</li>
                <li>{t('Badan Pendapatan Daerah — Jl. Ngurah Rai No.1, Gianyar', 'Regional Revenue Agency — Jl. Ngurah Rai No.1, Gianyar')}</li>
                <li>{t('Jatuh tempo: 31 Agustus', 'Due date: August 31')} {result.tahun}</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Demo NOP */}
      <div className="mt-6 bg-gray-50 dark:bg-slate-800 rounded-xl p-4 text-xs text-gray-500 dark:text-slate-400">
        <p className="font-medium text-gray-600 dark:text-slate-300 mb-1">{t('Demo NOP untuk pengujian:', 'Demo NOP for testing:')}</p>
        <button onClick={() => setNop('51.04.010.001.001-0001.0')}
          className="font-mono text-blue-700 dark:text-blue-400 hover:underline">
          51.04.010.001.001-0001.0
        </button>
        {' · '}
        <button onClick={() => setNop('51.04.020.002.005-0012.0')}
          className="font-mono text-blue-700 dark:text-blue-400 hover:underline">
          51.04.020.002.005-0012.0
        </button>
      </div>
    </div>
  )
}
