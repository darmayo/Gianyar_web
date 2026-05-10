'use client'
import { useState } from 'react'
import { CreditCard, CheckCircle, AlertCircle, Upload, X } from 'lucide-react'

const KECAMATAN = ['Gianyar','Ubud','Sukawati','Blahbatuh','Tampaksiring','Tegallalang','Payangan']
const ALASAN = [
  {value:'BARU', label:'KTP Baru (pertama kali)'},
  {value:'HILANG', label:'KTP Hilang'},
  {value:'RUSAK', label:'KTP Rusak'},
  {value:'PERUBAHAN', label:'Perubahan Data'},
]

type Field = { name: string; label: string; type: string; placeholder?: string; options?: {value:string;label:string}[]; hint?: string }

const FIELDS: Field[] = [
  { name:'namaLengkap', label:'Nama Lengkap', type:'text', placeholder:'Sesuai akta lahir' },
  { name:'nik', label:'NIK', type:'text', placeholder:'16 digit NIK', hint:'NIK terdapat di Kartu Keluarga' },
  { name:'jenisKelamin', label:'Jenis Kelamin', type:'select', options:[{value:'L',label:'Laki-laki'},{value:'P',label:'Perempuan'}] },
  { name:'tempatLahir', label:'Tempat Lahir', type:'text' },
  { name:'tanggalLahir', label:'Tanggal Lahir', type:'date' },
  { name:'agama', label:'Agama', type:'select', options:[{value:'Hindu',label:'Hindu'},{value:'Islam',label:'Islam'},{value:'Kristen',label:'Kristen'},{value:'Katolik',label:'Katolik'},{value:'Buddha',label:'Buddha'},{value:'Konghucu',label:'Konghucu'}] },
  { name:'pekerjaan', label:'Pekerjaan', type:'text', placeholder:'Sesuai KTP sebelumnya' },
  { name:'alamat', label:'Alamat Lengkap', type:'textarea' },
  { name:'kecamatan', label:'Kecamatan', type:'select', options:KECAMATAN.map(k=>({value:k,label:'Kec. '+k})) },
  { name:'alasan', label:'Alasan Permohonan', type:'select', options:ALASAN },
  { name:'noHp', label:'No. HP/WhatsApp', type:'tel', placeholder:'08xxxxxxxxxx' },
]

export default function KTPPage() {
  const [form, setForm] = useState<Record<string,string>>({})
  const [files, setFiles] = useState<File[]>([])
  const [agree, setAgree] = useState(false)
  const [captchaA] = useState(() => Math.floor(1+Math.random()*9))
  const [captchaB] = useState(() => Math.floor(1+Math.random()*9))
  const [captchaInput, setCaptchaInput] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [tiket, setTiket] = useState('')
  const [loading, setLoading] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const sel = Array.from(e.target.files ?? []).slice(0,3)
    setFiles(sel)
  }

  function validate() {
    const e: Record<string,string> = {}
    if (!form.namaLengkap?.trim()) e.namaLengkap = 'Wajib diisi'
    if (!/^\d{16}$/.test(form.nik ?? '')) e.nik = 'NIK harus 16 digit'
    if (!form.jenisKelamin) e.jenisKelamin = 'Pilih jenis kelamin'
    if (!form.tempatLahir?.trim()) e.tempatLahir = 'Wajib diisi'
    if (!form.tanggalLahir) e.tanggalLahir = 'Wajib diisi'
    if (!form.alamat?.trim()) e.alamat = 'Wajib diisi'
    if (!form.kecamatan) e.kecamatan = 'Pilih kecamatan'
    if (!form.alasan) e.alasan = 'Pilih alasan'
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
    await new Promise(r => setTimeout(r, 1200))
    const year = new Date().getFullYear()
    const seq = Math.floor(100000 + Math.random() * 900000)
    setTiket(`KTP-${year}-${seq}`)
    setLoading(false)
  }

  if (tiket) return (
    <div className="max-w-lg mx-auto px-4 py-10 text-center">
      <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Permohonan KTP Diterima</h1>
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-7 max-w-sm mx-auto my-6 shadow-lg">
        <p className="text-sm text-blue-200 mb-1">Nomor Tiket</p>
        <p className="text-3xl font-black font-mono tracking-wider">{tiket}</p>
        <p className="text-xs text-blue-300 mt-2">Simpan untuk cek status permohonan</p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left mb-6">
        <p className="font-semibold mb-1">Langkah selanjutnya:</p>
        <ul className="list-decimal ml-4 space-y-1 text-xs">
          <li>Tunggu konfirmasi via WhatsApp dalam 1×24 jam</li>
          <li>Datang ke Dukcapil sesuai jadwal yang dikirim</li>
          <li>Bawa dokumen asli + salinan</li>
          <li>Proses selesai 5 hari kerja</li>
        </ul>
      </div>
      <div className="flex gap-3 justify-center">
        <a href="/pengaduan/cek" className="px-5 py-2.5 border border-blue-900 text-blue-900 rounded-lg text-sm font-medium hover:bg-blue-50 transition">Cek Status</a>
        <button onClick={() => { setTiket(''); setForm({}); setFiles([]) }} className="px-5 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition">Permohonan Baru</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CreditCard size={24} className="text-blue-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Permohonan KTP Elektronik</h1>
          <p className="text-sm text-gray-500">Dinas Kependudukan dan Pencatatan Sipil Gianyar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {FIELDS.map(f => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm font-medium text-gray-700 mb-1">
              {f.label} <span className="text-red-500">*</span>
            </label>
            {f.type === 'select' ? (
              <select id={f.name} value={form[f.name]??''} onChange={e => setForm(p => ({...p,[f.name]:e.target.value}))}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[f.name]?'border-red-400':'border-gray-200'}`}>
                <option value="">-- Pilih --</option>
                {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea id={f.name} rows={2} placeholder={f.placeholder} value={form[f.name]??''}
                onChange={e => setForm(p => ({...p,[f.name]:e.target.value}))}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[f.name]?'border-red-400':'border-gray-200'}`} />
            ) : (
              <input id={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]??''}
                onChange={e => setForm(p => ({...p,[f.name]:f.name==='nik'?e.target.value.replace(/\D/g,'').slice(0,16):e.target.value}))}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${f.name==='nik'?'font-mono':''} ${errors[f.name]?'border-red-400':'border-gray-200'}`} />
            )}
            {f.hint && !errors[f.name] && <p className="text-xs text-gray-400 mt-0.5">{f.hint}</p>}
            {errors[f.name] && <p className="text-xs text-red-600 mt-0.5" role="alert">{errors[f.name]}</p>}
          </div>
        ))}

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dokumen Pendukung</label>
          <label className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-xl py-5 cursor-pointer hover:border-blue-400 transition">
            <Upload size={20} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">JPG, PNG, PDF — maks. 5MB, 3 file</span>
            <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} className="sr-only" />
          </label>
          {files.map((f,i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-600 mt-1">
              <span className="text-green-500">✓</span> {f.name}
              <button type="button" onClick={() => setFiles(p => p.filter((_,j)=>j!==i))} className="ml-auto text-gray-400 hover:text-red-500"><X size={12} /></button>
            </div>
          ))}
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
            <AlertCircle size={16} /> Periksa kembali isian Anda
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-60 transition">
          {loading ? 'Mengirim...' : 'Kirim Permohonan KTP'}
        </button>
      </form>
    </div>
  )
}
