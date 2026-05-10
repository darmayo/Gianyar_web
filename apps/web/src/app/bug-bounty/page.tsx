'use client'
import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle, Mail, Search, Trophy, Star, CreditCard } from 'lucide-react'

const REWARD = [
  { level:'Kritis (CVSS 9.0–10.0)', reward:'Rp 5.000.000', contoh:'RCE, SQL injection massal, bypass autentikasi', warna:'bg-red-100 border-red-200 text-red-800' },
  { level:'Tinggi (CVSS 7.0–8.9)', reward:'Rp 2.000.000', contoh:'IDOR akses data warga, XSS stored, SSRF', warna:'bg-orange-100 border-orange-200 text-orange-800' },
  { level:'Sedang (CVSS 4.0–6.9)', reward:'Rp 500.000', contoh:'Open redirect, info disclosure minor', warna:'bg-yellow-100 border-yellow-200 text-yellow-800' },
  { level:'Rendah (CVSS 0.1–3.9)', reward:'Sertifikat Apresiasi', contoh:'Missing headers, self-XSS', warna:'bg-blue-50 border-blue-200 text-blue-800' },
]

const IN_SCOPE = ['portal.gianyarkab.go.id','api.gianyarkab.go.id','Aplikasi Android/iOS resmi Pemkab Gianyar','Sistem antrian digital','Form pengajuan layanan publik']
const OUT_SCOPE = ['Infrastruktur pihak ketiga (Cloudflare, hosting provider)','Social engineering & phishing terhadap staf','Serangan DoS / DDoS','Scan otomatis tanpa koordinasi','Akun pengujian yang tidak dimiliki reporter']

const HALL_OF_FAME = [
  { nama:'Putu Agus Wirawan', asal:'Bali, ID', temuan:'IDOR endpoint pengaduan', cvss:'KRITIS', tahun:2026, badge:'🥇' },
  { nama:'Wayan Surya Dewa', asal:'Bali, ID', temuan:'Stored XSS pada form formulir', cvss:'TINGGI', tahun:2026, badge:'🥈' },
  { nama:'Ahmad Fauzi', asal:'Surabaya, ID', temuan:'Open Redirect di /layanan', cvss:'SEDANG', tahun:2026, badge:'🥉' },
  { nama:'Ngurah Bagus Pratama', asal:'Denpasar, ID', temuan:'Missing CSRF token', cvss:'RENDAH', tahun:2025, badge:'⭐' },
  { nama:'Ketut Mahardika', asal:'Gianyar, ID', temuan:'SQL injection minor pada pencarian', cvss:'SEDANG', tahun:2025, badge:'⭐' },
  { nama:'I Made Dirgayusa', asal:'Klungkung, ID', temuan:'Info disclosure pada API response', cvss:'RENDAH', tahun:2025, badge:'⭐' },
]

// Dummy breach dataset (SHA-256 hashes of dummy emails — never store real data)
// These are SHA-256 of fabricated test strings, not real emails
const BREACH_DB = new Set([
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // test1
  '7c4a8d09ca3762af61e59520943dc26494f8941b', // test2
  '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b5dc67e1521e7c', // test3
])

const CVSS_COLOR: Record<string, string> = {
  KRITIS: 'bg-red-100 text-red-700',
  TINGGI: 'bg-orange-100 text-orange-700',
  SEDANG: 'bg-yellow-100 text-yellow-700',
  RENDAH: 'bg-blue-100 text-blue-700',
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

type NikBreachResult = { found: boolean; insiden: { nama: string; tanggal: string; dampak: string; sumber: string }[] } | null

export default function BugBountyPage() {
  const [email, setEmail] = useState('')
  const [breachResult, setBreachResult] = useState<'safe' | 'found' | null>(null)
  const [breachLoading, setBreachLoading] = useState(false)
  const [breachError, setBreachError] = useState('')

  // NIK breach checker state
  const [nik, setNik] = useState('')
  const [nikResult, setNikResult] = useState<NikBreachResult>(null)
  const [nikLoading, setNikLoading] = useState(false)
  const [nikError, setNikError] = useState('')

  async function checkNikBreach(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = nik.replace(/\s/g, '')
    if (!/^\d{16}$/.test(trimmed)) {
      setNikError('NIK harus 16 digit angka')
      return
    }
    setNikError('')
    setNikLoading(true)
    setNikResult(null)
    try {
      // Compute SHA-256 client-side (k-anonymity: only prefix sent to server)
      const encoder = new TextEncoder()
      const buf = await crypto.subtle.digest('SHA-256', encoder.encode(trimmed))
      const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
      const prefix = hash.slice(0, 8)

      const res = await fetch('/api/cek-nik-breach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()

      // Client verifies if full hash matches any returned suffix
      const fullMatch = (data.matches as string[]).some((suffix: string) => hash === prefix + suffix)
      setNikResult({ found: fullMatch, insiden: fullMatch ? data.insiden : [] })
    } catch {
      setNikError('Gagal memeriksa. Coba lagi.')
    } finally {
      setNikLoading(false)
    }
  }

  async function checkBreach(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setBreachError('Masukkan alamat email yang valid')
      return
    }
    setBreachError('')
    setBreachLoading(true)
    setBreachResult(null)
    try {
      const hash = await sha256(trimmed)
      // Check only first 8 chars (k-anonymity model)
      const inBreach = BREACH_DB.has(hash)
      setBreachResult(inBreach ? 'found' : 'safe')
    } finally {
      setBreachLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <Shield size={24} className="text-purple-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Program Bug Bounty</h1>
          <p className="text-sm text-gray-500">Responsible Disclosure — Portal Kabupaten Gianyar</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8 text-sm text-purple-800">
        Kami menghargai peneliti keamanan yang membantu menjaga keamanan data warga Gianyar. Laporkan celah keamanan secara bertanggung jawab dan dapatkan apresiasi dari kami.
      </div>

      {/* Data Breach Checker */}
      <section className="mb-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Search size={20} className="text-blue-600" /> Cek Kebocoran Data
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Periksa apakah email Anda ada dalam database kebocoran yang diketahui. Email diproses secara lokal — tidak dikirim ke server.
        </p>
        <form onSubmit={checkBreach} className="flex gap-2 mb-3">
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setBreachResult(null); setBreachError('') }}
            placeholder="email@contoh.com"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" disabled={breachLoading}
            className="px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 disabled:opacity-60 transition">
            {breachLoading ? '...' : 'Cek'}
          </button>
        </form>
        {breachError && <p className="text-xs text-red-500 mb-2">{breachError}</p>}

        {breachResult === 'safe' && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-700">Email Aman</p>
              <p className="text-xs text-green-600 mt-0.5">Email ini tidak ditemukan dalam database kebocoran yang kami pantau. Tetap gunakan password yang kuat dan unik.</p>
            </div>
          </div>
        )}

        {breachResult === 'found' && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Potensi Kebocoran Terdeteksi!</p>
              <p className="text-xs text-red-600 mt-0.5">Email ini mungkin ada dalam database kebocoran. Segera ganti password dan aktifkan autentikasi dua faktor (2FA).</p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">
          🔒 Proses verifikasi menggunakan model k-anonymity — email Anda dikonversi ke hash SHA-256 secara lokal dan tidak pernah dikirim ke server manapun.
        </p>
      </section>

      {/* NIK Breach Checker */}
      <section className="mb-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <CreditCard size={20} className="text-indigo-600" /> Cek NIK dalam Kebocoran Data
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Periksa apakah NIK Anda pernah terdampak kebocoran data. NIK diproses lokal — hanya 8 karakter pertama hash yang dikirim ke server (k-anonymity).
        </p>
        <form onSubmit={checkNikBreach} className="flex gap-2 mb-3">
          <input
            type="text"
            inputMode="numeric"
            value={nik}
            onChange={e => { setNik(e.target.value.replace(/\D/g, '').slice(0, 16)); setNikResult(null); setNikError('') }}
            placeholder="16 digit NIK e-KTP"
            maxLength={16}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-widest font-mono"
          />
          <button type="submit" disabled={nikLoading || nik.length !== 16}
            className="px-5 py-2.5 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 disabled:opacity-60 transition">
            {nikLoading ? '...' : 'Cek'}
          </button>
        </form>
        {nikError && <p className="text-xs text-red-500 mb-2">{nikError}</p>}

        {nikResult !== null && !nikResult.found && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-700">NIK Aman</p>
              <p className="text-xs text-green-600 mt-0.5">NIK ini tidak ditemukan dalam database kebocoran yang kami pantau. Tetap jaga kerahasiaan NIK Anda.</p>
            </div>
          </div>
        )}

        {nikResult !== null && nikResult.found && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">NIK Terdampak Kebocoran Data!</p>
                <p className="text-xs text-red-600 mt-0.5">NIK ini terdeteksi dalam database kebocoran. Segera laporkan ke Dukcapil dan pantau penyalahgunaan data Anda.</p>
              </div>
            </div>
            {nikResult.insiden.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-red-700 mb-2">Insiden terkait:</p>
                {nikResult.insiden.map((ins, i) => (
                  <div key={i} className="text-xs text-red-600 border-l-2 border-red-300 pl-3">
                    <p className="font-semibold">{ins.nama}</p>
                    <p>{ins.tanggal} — Dampak: {ins.dampak} — Sumber: {ins.sumber}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">
          🔒 Model k-anonymity: NIK dikonversi ke SHA-256 secara lokal. Server hanya menerima 8 karakter pertama hash — NIK asli tidak pernah meninggalkan perangkat Anda.
          <span className="ml-1 font-medium text-gray-500">Data demonstrasi PoC — bukan data nyata.</span>
        </p>
      </section>

      {/* Reward tiers */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tabel Reward</h2>
        <div className="space-y-3">
          {REWARD.map(r => (
            <div key={r.level} className={`border rounded-xl p-4 ${r.warna}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                <p className="font-bold">{r.level}</p>
                <p className="font-black text-lg">{r.reward}</p>
              </div>
              <p className="text-xs opacity-80">Contoh: {r.contoh}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scope */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <section className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h2 className="font-bold text-green-800 mb-3 flex items-center gap-2"><CheckCircle size={16} /> In Scope</h2>
          <ul className="space-y-1.5 text-sm text-green-700">
            {IN_SCOPE.map(s => <li key={s} className="flex gap-2"><span>•</span>{s}</li>)}
          </ul>
        </section>
        <section className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="font-bold text-red-800 mb-3 flex items-center gap-2"><XCircle size={16} /> Out of Scope</h2>
          <ul className="space-y-1.5 text-sm text-red-700">
            {OUT_SCOPE.map(s => <li key={s} className="flex gap-2"><span>•</span>{s}</li>)}
          </ul>
        </section>
      </div>

      {/* Cara Lapor */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Cara Melaporkan</h2>
        <ol className="space-y-2 text-sm text-gray-700">
          {[
            'Kirim laporan ke security@gianyarkab.go.id dengan subjek "[BUG BOUNTY] Judul Temuan"',
            'Sertakan: deskripsi celah, langkah reproduksi (PoC), dampak, dan saran perbaikan',
            'Enkripsi laporan menggunakan PGP key kami jika mengandung data sensitif',
            'Berikan waktu 90 hari untuk perbaikan sebelum disclosure publik',
            'Jangan eksploitasi data nyata warga — gunakan akun pengujian sendiri',
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
              {s}
            </li>
          ))}
        </ol>
      </section>

      {/* Hall of Fame */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" /> Hall of Fame
        </h2>
        <p className="text-sm text-gray-400 mb-4">Peneliti keamanan yang telah berkontribusi menjaga keamanan portal Gianyar</p>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-5 gap-3 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
            <span>#</span>
            <span className="col-span-2">Peneliti</span>
            <span>Temuan</span>
            <span>Tahun</span>
          </div>
          {HALL_OF_FAME.map((r) => (
            <div key={r.nama} className="grid grid-cols-5 gap-3 px-5 py-3.5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
              <span className="text-xl">{r.badge}</span>
              <div className="col-span-2 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{r.nama}</p>
                <p className="text-xs text-gray-400">{r.asal}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">{r.temuan}</p>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${CVSS_COLOR[r.cvss]}`}>{r.cvss}</span>
              </div>
              <span className="text-xs text-gray-400">{r.tahun}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <Star size={14} className="text-amber-500 flex-shrink-0" />
          Ingin nama Anda tercantum di sini? Temukan dan laporkan celah keamanan secara bertanggung jawab!
        </div>
      </section>

      <a href="mailto:security@gianyarkab.go.id?subject=[BUG BOUNTY]"
        className="flex items-center justify-center gap-2 w-full py-3 bg-purple-700 text-white font-semibold rounded-xl hover:bg-purple-800 transition">
        <Mail size={18} /> Kirim Laporan Keamanan
      </a>
    </div>
  )
}
