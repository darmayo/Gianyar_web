'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DynamicForm } from '@/components/forms/DynamicForm'
import { FileText } from 'lucide-react'

function FormulirContent() {
  const params = useSearchParams()
  const jenis = params.get('jenis') ?? ''

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FileText size={24} className="text-blue-900" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Formulir Layanan Terpadu</h1>
          <p className="text-sm text-gray-500">Pilih jenis layanan — kolom berubah otomatis</p>
        </div>
      </div>

      {/* DynamicForm */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <DynamicForm defaultJenis={jenis} />
      </div>

      {/* Catatan */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
        <p className="font-semibold">Catatan Penting</p>
        <p>• Data yang Anda kirim diproses oleh petugas dalam waktu sesuai SLA masing-masing layanan.</p>
        <p>• Nomor tiket yang diberikan dapat digunakan untuk melacak status permohonan.</p>
        <p>• Pastikan nomor WhatsApp aktif untuk menerima notifikasi update.</p>
        <p>• Formulir ini dilindungi oleh UU PDP No.27/2022 — data Anda aman.</p>
      </div>
    </div>
  )
}

export default function FormulirPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    }>
      <FormulirContent />
    </Suspense>
  )
}
