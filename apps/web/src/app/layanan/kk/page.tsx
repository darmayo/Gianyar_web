'use client'
import { useState } from 'react'
import { Users, CheckCircle, AlertCircle, Upload, X } from 'lucide-react'
import { uploadPengajuanDocuments, validateClientDocuments } from '@/lib/document-upload-client'

const KECAMATAN = ['Gianyar','Ubud','Sukawati','Blahbatuh','Tampaksiring','Tegallalang','Payangan']
const ALASAN = [
  {value:'BARU', label:'KK Baru (pernikahan/pindah)'},
  {value:'TAMBAH_ANGGOTA', label:'Penambahan Anggota Keluarga'},
  {value:'KURANG_ANGGOTA', label:'Pengurangan Anggota (meninggal/pindah)'},
  {value:'PERUBAHAN', label:'Perubahan Data'},
  {value:'HILANG', label:'KK Hilang/Rusak'},
]

type TicketState = { nomor: string; token: string; statusUrl: string }

export default function KKPage() {
  const [form, setForm] = useState<Record<string,string>>({})
  const [files, setFiles] = useState<File[]>([])
  const [agree, setAgree] = useState(false)
  const [captchaA] = useState(() => Math.floor(1+Math.random()*9))
  const [captchaB] = useState(() => Math.floor(1+Math.random()*9))
  const [captchaInput, setCaptchaInput] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [tiket, setTiket] = useState<TicketState | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadWarning, setUploadWarning] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const sel = Array.from(e.target.files ?? []).slice(0,5)
    const clientError = validateClientDocuments(sel, 5)
    if (clientError) {
      setErrors((prev) => ({ ...prev, files: clientError }))
      e.target.value = ''
      return
    }
    setErrors((prev) => {
      const next = { ...prev }
      delete next.files
      return next
    })
    setFiles(sel)
  }

  function set(field: string, value: string) {
    setForm(p => ({...p,[field]:value}))
  }

  function validate() {
    const e: Record<string,string> = {}
    if (!form.namaKepala?.trim()) e.namaKepala = 'Wajib diisi'
    if (!/^\d{16}$/.test(form.nikKepala ?? '')) e.nikKepala = 'NIK harus 16 digit'
    if (!form.alasan) e.alasan = 'Pilih alasan permohonan'
    if (!form.kecamatan) e.kecamatan = 'Pilih kecamatan'
    if (!form.alamat?.trim()) e.alamat = 'Wajib diisi'
    if (!form.rt?.trim()) e.rt = 'Wajib diisi'
    if (!form.rw?.trim()) e.rw = 'Wajib diisi'
    if (!form.desa?.trim()) e.desa = 'Wajib diisi'
    if (!/^08\d{8,13}$/.test(form.noHp ?? '')) e.noHp = 'Format: 08xxxxxxxxxx'
    if (!agree) e.agree = 'Anda harus menyetujui pernyataan'
    if (Number(captchaInput) !== captchaA + captchaB) e.captcha = 'Jawaban CAPTCHA salah'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    setUploadWarning('')
    try {
      const { namaKepala, noHp, ...dataFormulir } = form
      const res = await fetch('/api/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenisLayanan: 'KK',
          namaSubmitter: namaKepala,
          kontakSubmitter: noHp,
          dataFormulir: {
            ...dataFormulir,
            namaKepala,
            noHp,
            dokumenPendukung: files.map((file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
            })),
          },
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Gagal mengirim permohonan')
      if (files.length > 0) {
        try {
          await uploadPengajuanDocuments(result.nomorTiket, result.trackingToken, files)
        } catch {
          setUploadWarning('Permohonan diterima, tetapi sebagian dokumen gagal diunggah. Hubungi petugas dengan nomor tiket bila dokumen diminta ulang.')
        }
      }
      setTiket({ nomor: result.nomorTiket, token: result.trackingToken, statusUrl: result.statusUrl })
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Gagal mengirim permohonan' })
    } finally {
      setLoading(false)
    }
  }

  if (tiket) return (
    <div className="max-w-lg mx-auto px-4 py-10 text-center">
      <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Permohonan KK Diterima</h1>
      <p className="text-gray-500 mb-6">Permohonan Anda sedang diproses</p>
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-7 max-w-sm mx-auto my-6 shadow-lg">
        <p className="text-sm text-blue-200 mb-1">Nomor Tiket</p>
        <p className="text-3xl font-black font-mono tracking-wider">{tiket.nomor}</p>
        <p className="text-sm text-blue-200 mt-4 mb-1">Token Tracking</p>
        <p className="text-xs font-mono break-all bg-white/10 rounded-lg px-3 py-2">{tiket.token}</p>
        <p className="text-xs text-blue-300 mt-2">Simpan nomor tiket dan token untuk cek status permohonan</p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left mb-6">
        <p className="font-semibold mb-1">Langkah selanjutnya:</p>
        <ul className="list-decimal ml-4 space-y-1 text-xs">
          <li>Tunggu konfirmasi via WhatsApp dalam 1×24 jam</li>
          <li>Datang ke Dukcapil sesuai jadwal yang dikirim</li>
          <li>Bawa dokumen asli (KTP, surat nikah, dll)</li>
          <li>Proses selesai 5 hari kerja</li>
        </ul>
      </div>
      {uploadWarning && (
        <p className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 mb-4">
          {uploadWarning}
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <a href={tiket.statusUrl} className="px-5 py-2.5 border border-blue-900 text-blue-900 rounded-lg text-sm font-medium hover:bg-blue-50 transition">Cek Status</a>
        <button onClick={() => { setTiket(null); setForm({}); setFiles([]) }} className="px-5 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition">Permohonan Baru</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Users size={24} className="text-blue-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Permohonan Kartu Keluarga</h1>
          <p className="text-sm text-gray-500">Dinas Kependudukan dan Pencatatan Sipil Gianyar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">Data Kepala Keluarga</h2>

        <div>
          <label htmlFor="namaKepala" className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Keluarga <span className="text-red-500">*</span></label>
          <input id="namaKepala" type="text" value={form.namaKepala??''} onChange={e=>set('namaKepala',e.target.value)} placeholder="Sesuai KTP"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.namaKepala?'border-red-400':'border-gray-200'}`} />
          {errors.namaKepala && <p className="text-xs text-red-600 mt-0.5">{errors.namaKepala}</p>}
        </div>

        <div>
          <label htmlFor="nikKepala" className="block text-sm font-medium text-gray-700 mb-1">NIK Kepala Keluarga <span className="text-red-500">*</span></label>
          <input id="nikKepala" type="text" value={form.nikKepala??''} onChange={e=>set('nikKepala',e.target.value.replace(/\D/g,'').slice(0,16))}
            placeholder="16 digit NIK" className={`w-full border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nikKepala?'border-red-400':'border-gray-200'}`} />
          <p className="text-xs text-gray-400 mt-0.5">{(form.nikKepala??'').length}/16 digit</p>
          {errors.nikKepala && <p className="text-xs text-red-600 mt-0.5">{errors.nikKepala}</p>}
        </div>

        <div>
          <label htmlFor="alasan" className="block text-sm font-medium text-gray-700 mb-1">Alasan Permohonan <span className="text-red-500">*</span></label>
          <select id="alasan" value={form.alasan??''} onChange={e=>set('alasan',e.target.value)}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.alasan?'border-red-400':'border-gray-200'}`}>
            <option value="">-- Pilih Alasan --</option>
            {ALASAN.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
          {errors.alasan && <p className="text-xs text-red-600 mt-0.5">{errors.alasan}</p>}
        </div>

        <hr className="border-gray-100" />
        <h2 className="font-bold text-gray-800">Alamat Domisili</h2>

        <div>
          <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span className="text-red-500">*</span></label>
          <textarea id="alamat" rows={2} value={form.alamat??''} onChange={e=>set('alamat',e.target.value)} placeholder="Nama jalan, nomor rumah"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.alamat?'border-red-400':'border-gray-200'}`} />
          {errors.alamat && <p className="text-xs text-red-600 mt-0.5">{errors.alamat}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="rt" className="block text-sm font-medium text-gray-700 mb-1">RT <span className="text-red-500">*</span></label>
            <input id="rt" type="text" value={form.rt??''} onChange={e=>set('rt',e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="001"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rt?'border-red-400':'border-gray-200'}`} />
            {errors.rt && <p className="text-xs text-red-600 mt-0.5">{errors.rt}</p>}
          </div>
          <div>
            <label htmlFor="rw" className="block text-sm font-medium text-gray-700 mb-1">RW <span className="text-red-500">*</span></label>
            <input id="rw" type="text" value={form.rw??''} onChange={e=>set('rw',e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="001"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rw?'border-red-400':'border-gray-200'}`} />
            {errors.rw && <p className="text-xs text-red-600 mt-0.5">{errors.rw}</p>}
          </div>
          <div>
            <label htmlFor="desa" className="block text-sm font-medium text-gray-700 mb-1">Desa/Kelurahan <span className="text-red-500">*</span></label>
            <input id="desa" type="text" value={form.desa??''} onChange={e=>set('desa',e.target.value)} placeholder="Nama desa"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.desa?'border-red-400':'border-gray-200'}`} />
            {errors.desa && <p className="text-xs text-red-600 mt-0.5">{errors.desa}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700 mb-1">Kecamatan <span className="text-red-500">*</span></label>
          <select id="kecamatan" value={form.kecamatan??''} onChange={e=>set('kecamatan',e.target.value)}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.kecamatan?'border-red-400':'border-gray-200'}`}>
            <option value="">-- Pilih Kecamatan --</option>
            {KECAMATAN.map(k=><option key={k} value={k}>Kec. {k}</option>)}
          </select>
          {errors.kecamatan && <p className="text-xs text-red-600 mt-0.5">{errors.kecamatan}</p>}
        </div>

        <div>
          <label htmlFor="noHp" className="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp <span className="text-red-500">*</span></label>
          <input id="noHp" type="tel" value={form.noHp??''} onChange={e=>set('noHp',e.target.value.replace(/\D/g,'').slice(0,15))} placeholder="08xxxxxxxxxx"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.noHp?'border-red-400':'border-gray-200'}`} />
          {errors.noHp && <p className="text-xs text-red-600 mt-0.5">{errors.noHp}</p>}
        </div>

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dokumen Pendukung</label>
          <p className="text-xs text-gray-400 mb-2">KTP asli, surat nikah/cerai, akta lahir, surat keterangan pindah (jika ada)</p>
          <label className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-xl py-5 cursor-pointer hover:border-blue-400 transition">
            <Upload size={20} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">JPG, PNG, PDF — maks. 5MB, 5 file</span>
            <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} className="sr-only" />
          </label>
          {files.map((f,i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-600 mt-1">
              <span className="text-green-500">✓</span> {f.name}
              <button type="button" onClick={() => setFiles(p => p.filter((_,j)=>j!==i))} className="ml-auto text-gray-400 hover:text-red-500"><X size={12} /></button>
            </div>
          ))}
          {errors.files && <p className="text-xs text-red-600 mt-1" role="alert">{errors.files}</p>}
        </div>

        {/* CAPTCHA */}
        <div>
          <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
            Verifikasi: {captchaA} + {captchaB} = ? <span className="text-red-500">*</span>
          </label>
          <input id="captcha" type="number" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)}
            className={`w-32 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.captcha?'border-red-400':'border-gray-200'}`} />
          {errors.captcha && <p className="text-xs text-red-600 mt-0.5">{errors.captcha}</p>}
        </div>

        {/* Pernyataan */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded text-blue-600" />
          <span className="text-xs text-gray-600">Saya menyatakan data yang diisi benar dan dapat dipertanggungjawabkan. Data diproses sesuai UU PDP No.27/2022.</span>
        </label>
        {errors.agree && <p className="text-xs text-red-600">{errors.agree}</p>}

        {Object.keys(errors).length > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} /> {errors.submit ?? 'Periksa kembali isian Anda'}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-60 transition">
          {loading ? 'Mengirim...' : 'Kirim Permohonan KK'}
        </button>
      </form>
    </div>
  )
}
