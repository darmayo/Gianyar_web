'use client'
// ============================================================
// DynamicForm — Formulir Pintar Multi-Layanan
//
// Cara kerja:
//  1. User pilih jenis layanan dari selector
//  2. Form fields berubah otomatis sesuai konfigurasi
//  3. Submit → POST /api/pengajuan → dapat nomor tiket
//
// Menambah layanan baru: cukup tambah entry di FORM_CONFIGS
// tanpa ubah komponen ini.
// ============================================================

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CreditCard, Users, BookOpen, Home, FileText,
  Heart, Landmark, Briefcase, ChevronDown, CheckCircle,
  AlertCircle, ArrowRight
} from 'lucide-react'

// ── Tipe Konfigurasi ─────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'select' | 'tel' | 'email' | 'date' | 'nik' | 'nop' | 'checkbox'

interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  hint?: string
  options?: { value: string; label: string }[]
  maxLength?: number
}

interface ServiceConfig {
  jenis: string
  label: string
  labelEn: string
  icon: React.ReactNode
  colorClass: string      // Tailwind background class untuk kartu
  accentClass: string     // Tailwind text class untuk aksen
  description: string
  fields: FieldConfig[]
  submitLabel: string
  sla: string             // "3 hari kerja"
}

// ── Konfigurasi Per Layanan ───────────────────────────────────

const KECAMATAN_OPTIONS = [
  'Gianyar','Ubud','Sukawati','Blahbatuh','Tampaksiring','Tegallalang','Payangan',
].map(k => ({ value: k, label: k }))

const FORM_CONFIGS: ServiceConfig[] = [
  // ── KTP ──────────────────────────────────────────────────
  {
    jenis: 'KTP',
    label: 'Kartu Tanda Penduduk',
    labelEn: 'ID Card',
    icon: <CreditCard size={22} />,
    colorClass: 'bg-blue-50 border-blue-200',
    accentClass: 'text-blue-900',
    description: 'Perekaman, penggantian, atau pembuatan KTP elektronik baru.',
    sla: '5 hari kerja',
    submitLabel: 'Ajukan KTP',
    fields: [
      { name:'namaLengkap', label:'Nama Lengkap', type:'text', required:true, placeholder:'Sesuai akta lahir', maxLength:100 },
      { name:'nik', label:'NIK', type:'nik', required:true, placeholder:'16 digit NIK', hint:'NIK terdapat di KK Anda' },
      { name:'jenisKelamin', label:'Jenis Kelamin', type:'select', required:true, options:[{value:'L',label:'Laki-laki'},{value:'P',label:'Perempuan'}] },
      { name:'tempatLahir', label:'Tempat Lahir', type:'text', required:true, placeholder:'Nama kota/kabupaten' },
      { name:'tanggalLahir', label:'Tanggal Lahir', type:'date', required:true },
      { name:'kecamatan', label:'Kecamatan', type:'select', required:true, options:KECAMATAN_OPTIONS },
      { name:'alasan', label:'Alasan Permohonan', type:'select', required:true, options:[
        {value:'BARU',label:'KTP Baru (pertama kali)'},
        {value:'HILANG',label:'KTP Hilang'},
        {value:'RUSAK',label:'KTP Rusak'},
        {value:'PERUBAHAN',label:'Perubahan Data'},
      ]},
      { name:'noHp', label:'No. HP/WhatsApp', type:'tel', required:true, placeholder:'08xxxxxxxxxx' },
    ],
  },

  // ── KK ───────────────────────────────────────────────────
  {
    jenis: 'KK',
    label: 'Kartu Keluarga',
    labelEn: 'Family Card',
    icon: <Users size={22} />,
    colorClass: 'bg-green-50 border-green-200',
    accentClass: 'text-green-800',
    description: 'Pembuatan KK baru, perubahan anggota, atau penggantian KK rusak/hilang.',
    sla: '5 hari kerja',
    submitLabel: 'Ajukan Kartu Keluarga',
    fields: [
      { name:'namaKepalaKeluarga', label:'Nama Kepala Keluarga', type:'text', required:true, maxLength:100 },
      { name:'nikKepalaKeluarga', label:'NIK Kepala Keluarga', type:'nik', required:true },
      { name:'alamatLengkap', label:'Alamat Lengkap', type:'textarea', required:true },
      { name:'kecamatan', label:'Kecamatan', type:'select', required:true, options:KECAMATAN_OPTIONS },
      { name:'jenisPermohonan', label:'Jenis Permohonan', type:'select', required:true, options:[
        {value:'BARU',label:'KK Baru'},
        {value:'PERUBAHAN',label:'Perubahan Anggota Keluarga'},
        {value:'PENGGANTIAN',label:'Penggantian KK Hilang/Rusak'},
      ]},
      { name:'noHp', label:'No. HP/WhatsApp', type:'tel', required:true, placeholder:'08xxxxxxxxxx' },
    ],
  },

  // ── AKTA LAHIR ────────────────────────────────────────────
  {
    jenis: 'AKTA_LAHIR',
    label: 'Akta Kelahiran',
    labelEn: 'Birth Certificate',
    icon: <BookOpen size={22} />,
    colorClass: 'bg-purple-50 border-purple-200',
    accentClass: 'text-purple-800',
    description: 'Pendaftaran kelahiran dan penerbitan akta kelahiran.',
    sla: '3 hari kerja',
    submitLabel: 'Daftarkan Kelahiran',
    fields: [
      { name:'namaAnak', label:'Nama Anak', type:'text', required:true, maxLength:100 },
      { name:'tanggalLahir', label:'Tanggal Lahir', type:'date', required:true },
      { name:'tempatLahir', label:'Tempat Lahir', type:'text', required:true },
      { name:'namaAyah', label:'Nama Ayah', type:'text', required:true },
      { name:'nikAyah', label:'NIK Ayah', type:'nik', required:true },
      { name:'namaIbu', label:'Nama Ibu', type:'text', required:true },
      { name:'nikIbu', label:'NIK Ibu', type:'nik', required:false, hint:'Opsional jika ibu tidak ber-NIK' },
      { name:'noHp', label:'No. HP/WhatsApp', type:'tel', required:true },
    ],
  },

  // ── PINDAH DOMISILI ───────────────────────────────────────
  {
    jenis: 'PINDAH_DOMISILI',
    label: 'Pindah Domisili',
    labelEn: 'Change of Address',
    icon: <Home size={22} />,
    colorClass: 'bg-amber-50 border-amber-200',
    accentClass: 'text-amber-800',
    description: 'Pengurusan surat pindah masuk atau pindah keluar Kabupaten Gianyar.',
    sla: '3 hari kerja',
    submitLabel: 'Proses Pindah Domisili',
    fields: [
      { name:'namaLengkap', label:'Nama Lengkap', type:'text', required:true },
      { name:'nik', label:'NIK', type:'nik', required:true },
      { name:'jenisPindah', label:'Jenis Pindah', type:'select', required:true, options:[
        {value:'MASUK',label:'Pindah Masuk ke Gianyar'},
        {value:'KELUAR',label:'Pindah Keluar dari Gianyar'},
        {value:'DALAM',label:'Pindah Antar Desa (dalam Gianyar)'},
      ]},
      { name:'alamatAsal', label:'Alamat Asal', type:'textarea', required:true },
      { name:'alamatTujuan', label:'Alamat Tujuan', type:'textarea', required:true },
      { name:'alasanPindah', label:'Alasan Pindah', type:'text', required:false },
      { name:'noHp', label:'No. HP/WhatsApp', type:'tel', required:true },
    ],
  },

  // ── PERIZINAN / IMB ───────────────────────────────────────
  {
    jenis: 'PERIZINAN',
    label: 'Perizinan & IMB',
    labelEn: 'Building Permit',
    icon: <Landmark size={22} />,
    colorClass: 'bg-slate-50 border-slate-200',
    accentClass: 'text-slate-800',
    description: 'Permohonan IMB, izin usaha, izin pariwisata, dan perizinan lainnya.',
    sla: '7 hari kerja',
    submitLabel: 'Ajukan Perizinan',
    fields: [
      { name:'namaPermohonan', label:'Nama Pemohon', type:'text', required:true },
      { name:'nik', label:'NIK', type:'nik', required:true },
      { name:'jenisIzin', label:'Jenis Izin', type:'select', required:true, options:[
        {value:'IMB',label:'Izin Mendirikan Bangunan (IMB/PBG)'},
        {value:'USAHA',label:'Izin Usaha / SIUP'},
        {value:'PARIWISATA',label:'Izin Usaha Pariwisata'},
        {value:'KERAMAIAN',label:'Izin Keramaian / Event'},
        {value:'LAINNYA',label:'Perizinan Lainnya'},
      ]},
      { name:'lokasiObjek', label:'Lokasi Objek', type:'textarea', required:true },
      { name:'deskripsiKegiatan', label:'Deskripsi Kegiatan', type:'textarea', required:true, hint:'Jelaskan rencana kegiatan atau bangunan' },
      { name:'noHp', label:'No. HP/WhatsApp', type:'tel', required:true },
      { name:'email', label:'Email', type:'email', required:false },
    ],
  },

  // ── BANTUAN SOSIAL ────────────────────────────────────────
  {
    jenis: 'BANSOS',
    label: 'Bantuan Sosial (Bansos)',
    labelEn: 'Social Aid',
    icon: <Heart size={22} />,
    colorClass: 'bg-rose-50 border-rose-200',
    accentClass: 'text-rose-800',
    description: 'Cek status penerima bansos, daftar program, atau ajukan klaim.',
    sla: '7 hari kerja',
    submitLabel: 'Cek / Ajukan Bansos',
    fields: [
      { name:'namaLengkap', label:'Nama Lengkap', type:'text', required:true },
      { name:'nik', label:'NIK', type:'nik', required:true, hint:'NIK yang terdaftar di Dukcapil' },
      { name:'noKK', label:'Nomor KK', type:'text', required:true, maxLength:16, placeholder:'16 digit nomor KK' },
      { name:'jenisPermohonan', label:'Jenis Permohonan', type:'select', required:true, options:[
        {value:'CEK_STATUS',label:'Cek Status Penerima Bansos'},
        {value:'DAFTAR_BARU',label:'Daftar Sebagai Penerima Baru'},
        {value:'KLAIM',label:'Klaim Bantuan yang Belum Diterima'},
        {value:'SANGGAH',label:'Sanggahan / Keberatan Data'},
      ]},
      { name:'programBansos', label:'Program Bansos', type:'select', required:false, options:[
        {value:'PKH',label:'PKH (Program Keluarga Harapan)'},
        {value:'BPNT',label:'BPNT (Bantuan Pangan Non Tunai)'},
        {value:'BLT',label:'BLT (Bantuan Langsung Tunai)'},
        {value:'PIP',label:'PIP (Program Indonesia Pintar)'},
        {value:'JKN',label:'JKN/KIS (BPJS Kesehatan)'},
        {value:'LAINNYA',label:'Program Lainnya'},
      ]},
      { name:'keterangan', label:'Keterangan Tambahan', type:'textarea', required:false },
      { name:'noHp', label:'No. HP/WhatsApp', type:'tel', required:true },
    ],
  },

  // ── CEK PAJAK PBB ─────────────────────────────────────────
  {
    jenis: 'PAJAK_PBB',
    label: 'Cek Pajak PBB',
    labelEn: 'Land & Building Tax',
    icon: <FileText size={22} />,
    colorClass: 'bg-teal-50 border-teal-200',
    accentClass: 'text-teal-800',
    description: 'Cek tagihan, unduh SPPT, dan konfirmasi pembayaran PBB-P2.',
    sla: 'Instan',
    submitLabel: 'Cek Tagihan PBB',
    fields: [
      { name:'nop', label:'NOP (Nomor Objek Pajak)', type:'nop', required:true, placeholder:'XX.XX.XXX.XXX.XXX-XXXX.X', hint:'Tertera di SPPT tahun sebelumnya' },
      { name:'namaWajibPajak', label:'Nama Wajib Pajak', type:'text', required:true },
      { name:'tahunPajak', label:'Tahun Pajak', type:'select', required:true, options:[
        {value:'2026',label:'2026'},{value:'2025',label:'2025'},{value:'2024',label:'2024'},
      ]},
      { name:'noHp', label:'No. HP/WhatsApp', type:'tel', required:true },
    ],
  },

  // ── LOWONGAN / SURAT KERJA ────────────────────────────────
  {
    jenis: 'SURAT_KERJA',
    label: 'Surat Keterangan Kerja',
    labelEn: 'Work Certificate',
    icon: <Briefcase size={22} />,
    colorClass: 'bg-orange-50 border-orange-200',
    accentClass: 'text-orange-800',
    description: 'Penerbitan surat keterangan tidak mampu, domisili, atau keterangan kerja.',
    sla: '2 hari kerja',
    submitLabel: 'Ajukan Surat',
    fields: [
      { name:'namaLengkap', label:'Nama Lengkap', type:'text', required:true },
      { name:'nik', label:'NIK', type:'nik', required:true },
      { name:'jenisSurat', label:'Jenis Surat', type:'select', required:true, options:[
        {value:'KETERANGAN_DOMISILI',label:'Surat Keterangan Domisili'},
        {value:'TIDAK_MAMPU',label:'Surat Keterangan Tidak Mampu (SKTM)'},
        {value:'KETERANGAN_USAHA',label:'Surat Keterangan Usaha (SKU)'},
        {value:'PENGANTAR_SKCK',label:'Surat Pengantar SKCK'},
        {value:'REKOMENDASI',label:'Surat Rekomendasi Lainnya'},
      ]},
      { name:'tujuanSurat', label:'Tujuan / Keperluan', type:'text', required:true, placeholder:'Misal: untuk melamar pekerjaan' },
      { name:'noHp', label:'No. HP/WhatsApp', type:'tel', required:true },
    ],
  },
]

// ── Validasi Zod dinamis ──────────────────────────────────────

function buildZodSchema(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    namaSubmitter: z.string().min(2, 'Nama wajib diisi'),
    kontakSubmitter: z.string().min(5, 'Kontak wajib diisi'),
    pernyataan: z.literal(true, { errorMap: () => ({ message: 'Anda harus menyetujui pernyataan' }) }),
  }

  for (const f of fields) {
    let schema: z.ZodTypeAny

    if (f.type === 'nik') {
      schema = z.string().regex(/^\d{16}$/, 'NIK harus 16 digit angka')
    } else if (f.type === 'nop') {
      schema = z.string().min(10, 'NOP tidak valid')
    } else if (f.type === 'tel') {
      schema = z.string().regex(/^08\d{8,13}$/, 'Format: 08xxxxxxxxxx')
    } else if (f.type === 'email') {
      schema = z.string().email('Format email tidak valid').or(z.literal(''))
    } else if (f.type === 'textarea' || f.type === 'text') {
      schema = z.string().min(f.required ? 2 : 0).max(f.maxLength ?? 500)
    } else {
      schema = z.string()
    }

    if (!f.required) {
      shape[f.name] = schema.optional().or(z.literal(''))
    } else {
      shape[f.name] = (schema as z.ZodString).min(1, `${f.label} wajib diisi`)
    }
  }

  return z.object(shape)
}

// ── Sub-komponen Field ────────────────────────────────────────

function FormField({
  field,
  register,
  errors,
}: {
  field: FieldConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any
}) {
  const hasError = !!errors[field.name]
  const baseInput =
    'w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
  const errorBorder = hasError ? 'border-red-400 bg-red-50' : 'border-gray-200'

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {(field.type === 'text' || field.type === 'nik' || field.type === 'nop') && (
        <input
          id={field.name}
          type="text"
          placeholder={field.placeholder}
          maxLength={field.maxLength ?? (field.type === 'nik' ? 16 : undefined)}
          className={`${baseInput} ${errorBorder} ${field.type === 'nik' || field.type === 'nop' ? 'font-mono' : ''}`}
          {...register(field.name)}
        />
      )}

      {field.type === 'tel' && (
        <input
          id={field.name}
          type="tel"
          placeholder={field.placeholder ?? '08xxxxxxxxxx'}
          className={`${baseInput} ${errorBorder} font-mono`}
          {...register(field.name)}
        />
      )}

      {field.type === 'email' && (
        <input
          id={field.name}
          type="email"
          placeholder={field.placeholder}
          className={`${baseInput} ${errorBorder}`}
          {...register(field.name)}
        />
      )}

      {field.type === 'date' && (
        <input
          id={field.name}
          type="date"
          className={`${baseInput} ${errorBorder}`}
          {...register(field.name)}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          id={field.name}
          rows={3}
          placeholder={field.placeholder}
          maxLength={field.maxLength ?? 1000}
          className={`${baseInput} ${errorBorder} resize-y`}
          {...register(field.name)}
        />
      )}

      {field.type === 'select' && field.options && (
        <select
          id={field.name}
          className={`${baseInput} ${errorBorder}`}
          {...register(field.name)}
        >
          <option value="">-- Pilih --</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.hint && !hasError && (
        <p className="text-xs text-gray-400 mt-0.5">{field.hint}</p>
      )}
      {hasError && (
        <p className="text-xs text-red-600 mt-0.5" role="alert">{errors[field.name]?.message}</p>
      )}
    </div>
  )
}

// ── Komponen Utama ────────────────────────────────────────────

interface DynamicFormProps {
  defaultJenis?: string
  onSuccess?: (tiket: string, jenis: string) => void
  className?: string
}

export function DynamicForm({ defaultJenis, onSuccess, className = '' }: DynamicFormProps) {
  const [selectedJenis, setSelectedJenis] = useState(defaultJenis ?? '')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [tiket, setTiket] = useState<{ nomor: string; jenis: string } | null>(null)

  const config = FORM_CONFIGS.find((c) => c.jenis === selectedJenis)
  const schema = config ? buildZodSchema(config.fields) : z.object({
    namaSubmitter: z.string(),
    kontakSubmitter: z.string(),
    pernyataan: z.boolean(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  // Reset form ketika jenis layanan berubah
  useEffect(() => { reset() }, [selectedJenis, reset])

  async function onSubmit(data: Record<string, unknown>) {
    if (!config) return
    setLoading(true)
    setServerError('')

    // Pisahkan metadata dari data formulir (pernyataan dikecualikan dari dataFormulir)
    const { namaSubmitter, kontakSubmitter, pernyataan: _p, ...dataFormulir } = data

    try {
      const res = await fetch('/api/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenisLayanan: selectedJenis,
          namaSubmitter,
          kontakSubmitter,
          dataFormulir,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Gagal mengirim permohonan')
      setTiket({ nomor: result.nomorTiket, jenis: config.label })
      onSuccess?.(result.nomorTiket, selectedJenis)
      reset()
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // ── State: Tiket Berhasil ───────────────────────────────────
  if (tiket) {
    return (
      <div className={`text-center py-8 px-4 ${className}`}>
        <CheckCircle size={52} className="text-green-500 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Permohonan Diterima!</h2>
        <p className="text-gray-500 mb-6">{tiket.jenis}</p>
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-7 max-w-sm mx-auto mb-6 shadow-lg">
          <p className="text-sm text-blue-200 mb-1">Nomor Tiket Anda</p>
          <p className="text-3xl font-black font-mono tracking-wider mb-1">{tiket.nomor}</p>
          <p className="text-xs text-blue-300">Simpan untuk cek status permohonan</p>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href={`/pengaduan/cek?tiket=${tiket.nomor}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
          >
            Pantau Status <ArrowRight size={14} />
          </a>
          <button
            onClick={() => setTiket(null)}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Permohonan Baru
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* ── Selector Jenis Layanan ─────────────────────────── */}
      <div className="mb-6">
        <label htmlFor="jenis-layanan" className="block text-sm font-semibold text-gray-700 mb-2">
          Pilih Jenis Layanan <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="jenis-layanan"
            value={selectedJenis}
            onChange={(e) => setSelectedJenis(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-10"
          >
            <option value="">-- Pilih layanan yang Anda butuhkan --</option>
            {FORM_CONFIGS.map((c) => (
              <option key={c.jenis} value={c.jenis}>{c.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Info Layanan ───────────────────────────────────── */}
      {config && (
        <div className={`border rounded-xl p-4 mb-6 flex items-start gap-3 ${config.colorClass}`}>
          <span className={config.accentClass}>{config.icon}</span>
          <div>
            <p className={`font-semibold text-sm ${config.accentClass}`}>{config.label}</p>
            <p className="text-xs text-gray-600 mt-0.5">{config.description}</p>
            <p className="text-xs text-gray-500 mt-1">⏱ SLA: {config.sla}</p>
          </div>
        </div>
      )}

      {/* ── Prompt jika belum pilih ────────────────────────── */}
      {!config && (
        <div className="text-center py-12 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Pilih jenis layanan di atas untuk memulai</p>
        </div>
      )}

      {/* ── Form Dinamis ───────────────────────────────────── */}
      {config && (
        <form onSubmit={handleSubmit(onSubmit as never)} noValidate className="space-y-4">

          {/* Field khusus layanan */}
          {config.fields.map((f) => (
            <FormField key={f.name} field={f} register={register} errors={errors} />
          ))}

          <hr className="border-gray-100" />

          {/* Nama & Kontak submitter (selalu ada) */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="namaSubmitter" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap Pemohon <span className="text-red-500">*</span>
              </label>
              <input id="namaSubmitter" type="text" {...register('namaSubmitter')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.namaSubmitter ? 'border-red-400' : 'border-gray-200'}`} />
              {errors.namaSubmitter && <p className="text-xs text-red-600 mt-0.5">{String(errors.namaSubmitter?.message)}</p>}
            </div>
            <div>
              <label htmlFor="kontakSubmitter" className="block text-sm font-medium text-gray-700 mb-1">
                Email / No. WA <span className="text-red-500">*</span>
              </label>
              <input id="kontakSubmitter" type="text" {...register('kontakSubmitter')}
                placeholder="email@contoh.com atau 08xx"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.kontakSubmitter ? 'border-red-400' : 'border-gray-200'}`} />
              {errors.kontakSubmitter && <p className="text-xs text-red-600 mt-0.5">{String(errors.kontakSubmitter?.message)}</p>}
            </div>
          </div>

          {/* Pernyataan */}
          <label className="flex items-start gap-3 cursor-pointer bg-gray-50 rounded-xl p-3 border border-gray-100">
            <input type="checkbox" {...register('pernyataan')}
              className="mt-0.5 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
            <span className="text-xs text-gray-600">
              Saya menyatakan bahwa seluruh data yang saya isi adalah benar dan dapat dipertanggungjawabkan.
              Data saya diproses sesuai <a href="/kebijakan-privasi" className="text-blue-700 underline">Kebijakan Privasi</a> dan UU PDP No.27/2022.
            </span>
          </label>
          {errors.pernyataan && (
            <p className="text-xs text-red-600">{String(errors.pernyataan?.message)}</p>
          )}

          {/* Error server */}
          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700" role="alert">
              <AlertCircle size={16} className="flex-shrink-0" /> {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? 'Mengirim...' : (
              <>{config.submitLabel} <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
