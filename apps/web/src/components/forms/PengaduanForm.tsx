'use client'
// ============================================================
// Form Pengaduan — React Hook Form + Zod
// Security: XSS prevention, file validation, CSRF
// Accessibility: ARIA, error messages, focus management
// ============================================================

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { uploadPengajuanDocuments, validateClientDocuments } from '@/lib/document-upload-client'

const pengaduanSchema = z.object({
  judul: z.string().min(5, 'Judul minimal 5 karakter').max(200),
  kategori: z.enum(['INFRASTRUKTUR','PELAYANAN_PUBLIK','LINGKUNGAN','KEAMANAN','KESEHATAN','PENDIDIKAN','LAINNYA'], {
    errorMap: () => ({ message: 'Pilih kategori' }),
  }),
  deskripsi: z.string().min(20, 'Deskripsi minimal 20 karakter').max(2000),
  lokasi: z.string().max(255).optional(),
  isAnonim: z.boolean().default(false),
})

const fileUploadSchema = z.object({
  name: z.string(),
  type: z.string().refine(t => ['image/jpeg','image/png','image/webp','application/pdf'].includes(t), 'Format tidak didukung'),
  size: z.number().max(10 * 1024 * 1024, 'Ukuran file maksimal 10 MB'),
})

type PengaduanInput = z.infer<typeof pengaduanSchema>

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const KATEGORI_OPTIONS = [
  { value: 'INFRASTRUKTUR', label: 'Infrastruktur (Jalan, Jembatan, Drainase)' },
  { value: 'PELAYANAN_PUBLIK', label: 'Pelayanan Publik' },
  { value: 'LINGKUNGAN', label: 'Lingkungan Hidup' },
  { value: 'KEAMANAN', label: 'Keamanan & Ketertiban' },
  { value: 'KESEHATAN', label: 'Kesehatan' },
  { value: 'PENDIDIKAN', label: 'Pendidikan' },
  { value: 'LAINNYA', label: 'Lainnya' },
]

export function PengaduanForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [nomorTiket, setNomorTiket] = useState<string>('')
  const [trackingToken, setTrackingToken] = useState<string>('')
  const [statusUrl, setStatusUrl] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string>('')
  const [uploadWarning, setUploadWarning] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PengaduanInput>({
    resolver: zodResolver(pengaduanSchema),
    defaultValues: { isAnonim: false },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('')
    const selectedFiles = Array.from(e.target.files ?? [])

    if (selectedFiles.length > 3) {
      setFileError('Maksimal 3 file lampiran')
      e.target.value = ''
      return
    }

    const clientError = validateClientDocuments(selectedFiles, 3)
    if (clientError) {
      setFileError(clientError)
      e.target.value = ''
      return
    }

    for (const file of selectedFiles) {
      const result = fileUploadSchema.safeParse({
        name: file.name,
        type: file.type,
        size: file.size,
      })
      if (!result.success) {
        setFileError(result.error.errors[0].message)
        e.target.value = ''
        return
      }
    }

    setFiles(selectedFiles)
  }

  const onSubmit = async (data: PengaduanInput) => {
    setFormState('submitting')
    setUploadWarning('')

    try {
      const res = await fetch('/api/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenisLayanan: 'PENGADUAN',
          namaSubmitter: data.isAnonim ? 'Anonim' : 'Warga Gianyar',
          kontakSubmitter: 'tidak-diberikan',
          dataFormulir: {
            ...data,
            lampiran: files.map((file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
            })),
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? err.message ?? 'Gagal mengirim pengaduan')
      }

      const result = await res.json()
      if (files.length > 0) {
        try {
          await uploadPengajuanDocuments(result.nomorTiket, result.trackingToken, files)
        } catch {
          setUploadWarning('Pengajuan diterima, tetapi sebagian lampiran gagal diunggah. Hubungi petugas dengan nomor tiket bila dokumen diminta ulang.')
        }
      }
      setNomorTiket(result.nomorTiket)
      setTrackingToken(result.trackingToken)
      setStatusUrl(result.statusUrl)
      setFormState('success')
      reset()
      setFiles([])
    } catch (err: unknown) {
      setFormState('error')
      console.error(err)
    }
  }

  if (formState === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl bg-green-50 border border-green-200 p-8 text-center"
      >
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <h2 className="text-xl font-bold text-green-800 mb-2">
          Pengaduan Berhasil Dikirim
        </h2>
        <p className="text-green-700 mb-4">
          Nomor tiket Anda:
        </p>
        <p className="text-3xl font-mono font-bold text-green-900 mb-4">
          {nomorTiket}
        </p>
        <p className="text-green-700 mb-2">
          Token tracking:
        </p>
        <p className="text-sm font-mono break-all text-green-900 bg-white/70 rounded-lg px-3 py-2 mb-4">
          {trackingToken}
        </p>
        <p className="text-sm text-green-600 mb-6">
          Simpan nomor tiket dan token tracking ini untuk memantau status pengaduan Anda.
          Notifikasi akan dikirim ke email/WhatsApp yang terdaftar.
        </p>
        {uploadWarning && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            {uploadWarning}
          </p>
        )}
        <a
          href={statusUrl || '/pengaduan/cek'}
          className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Pantau Status Pengaduan
        </a>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Form pengaduan masyarakat"
      className="space-y-6"
    >
      {/* Judul */}
      <div>
        <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-1">
          Judul Pengaduan <span aria-hidden="true" className="text-red-500">*</span>
          <span className="sr-only">(wajib diisi)</span>
        </label>
        <input
          id="judul"
          type="text"
          maxLength={200}
          aria-invalid={!!errors.judul}
          aria-describedby={errors.judul ? 'judul-error' : undefined}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
            errors.judul ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Contoh: Jalan berlubang di Jl. Raya Ubud"
          {...register('judul')}
        />
        {errors.judul && (
          <p id="judul-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.judul.message}
          </p>
        )}
      </div>

      {/* Kategori */}
      <div>
        <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">
          Kategori <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <select
          id="kategori"
          aria-invalid={!!errors.kategori}
          aria-describedby={errors.kategori ? 'kategori-error' : undefined}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
            errors.kategori ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
          {...register('kategori')}
        >
          <option value="">-- Pilih kategori --</option>
          {KATEGORI_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.kategori && (
          <p id="kategori-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.kategori.message}
          </p>
        )}
      </div>

      {/* Deskripsi */}
      <div>
        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Lengkap <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id="deskripsi"
          rows={5}
          maxLength={2000}
          aria-invalid={!!errors.deskripsi}
          aria-describedby="deskripsi-hint deskripsi-error"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-y ${
            errors.deskripsi ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Jelaskan masalah secara rinci: lokasi, waktu kejadian, dampak yang dirasakan..."
          {...register('deskripsi')}
        />
        <p id="deskripsi-hint" className="mt-1 text-xs text-gray-500">
          Minimal 20 karakter, maksimal 2000 karakter
        </p>
        {errors.deskripsi && (
          <p id="deskripsi-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.deskripsi.message}
          </p>
        )}
      </div>

      {/* Lokasi */}
      <div>
        <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-1">
          Lokasi (opsional)
        </label>
        <input
          id="lokasi"
          type="text"
          maxLength={255}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Contoh: Desa Ubud, Kecamatan Ubud"
          {...register('lokasi')}
        />
      </div>

      {/* File Upload */}
      <div>
        <label htmlFor="lampiran" className="block text-sm font-medium text-gray-700 mb-1">
          Lampiran (opsional)
        </label>
        <input
          id="lampiran"
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileChange}
          aria-describedby="lampiran-hint"
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        <p id="lampiran-hint" className="mt-1 text-xs text-gray-500">
          Maks. 3 file, 10 MB per file. Format: JPG, PNG, WebP, PDF
        </p>
        {fileError && (
          <p role="alert" className="mt-1 text-sm text-red-600">{fileError}</p>
        )}
        {files.length > 0 && (
          <ul className="mt-2 space-y-1" aria-label="File terpilih">
            {files.map((f, i) => (
              <li key={i} className="text-xs text-gray-600">
                ✓ {f.name} ({(f.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Anonim */}
      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <input
          id="isAnonim"
          type="checkbox"
          className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          {...register('isAnonim')}
        />
        <div>
          <label htmlFor="isAnonim" className="text-sm font-medium text-gray-700">
            Kirim sebagai anonim
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Identitas Anda tidak akan ditampilkan ke publik, namun tetap tersimpan
            di sistem untuk keperluan verifikasi.
          </p>
        </div>
      </div>

      {formState === 'error' && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          Terjadi kesalahan saat mengirim pengaduan. Silakan coba kembali.
        </div>
      )}

      <button
        type="submit"
        disabled={formState === 'submitting'}
        aria-busy={formState === 'submitting'}
        className="w-full py-3 px-6 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {formState === 'submitting' ? 'Mengirim...' : 'Kirim Pengaduan'}
      </button>
    </form>
  )
}
