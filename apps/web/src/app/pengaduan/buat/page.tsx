import type { Metadata } from 'next'
import { MessageSquarePlus, Info } from 'lucide-react'
import { PengaduanForm } from '@/components/forms/PengaduanForm'

export const metadata: Metadata = {
  title: 'Buat Pengaduan — Portal Gianyar',
  description: 'Sampaikan pengaduan, laporan, dan aspirasi Anda kepada Pemerintah Kabupaten Gianyar',
}

export default function BuatPengaduanPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageSquarePlus size={24} className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaduan Masyarakat</h1>
          <p className="text-sm text-gray-500">Sampaikan laporan Anda — kami akan menindaklanjuti</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 space-y-1">
          <p className="font-semibold">Standar Layanan (SLA)</p>
          <ul className="text-xs space-y-0.5 text-blue-700">
            <li>• Infrastruktur &amp; Keamanan: respons dalam <strong>3 hari kerja</strong></li>
            <li>• Pelayanan Publik: respons dalam <strong>5 hari kerja</strong></li>
            <li>• Lingkungan &amp; Lainnya: respons dalam <strong>7 hari kerja</strong></li>
          </ul>
          <p className="text-xs mt-1">Sudah punya tiket? <a href="/pengaduan/cek" className="font-semibold underline">Cek status pengaduan</a></p>
        </div>
      </div>

      <PengaduanForm />
    </div>
  )
}
