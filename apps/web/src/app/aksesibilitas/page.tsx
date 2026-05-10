import type { Metadata } from 'next'
import { Eye, Keyboard, Volume2, Monitor, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Aksesibilitas — Portal Gianyar',
  description: 'Komitmen kami terhadap aksesibilitas digital untuk semua pengguna Portal Kabupaten Gianyar',
}

const FITUR = [
  { icon: Eye, judul: 'Kontras & Ukuran Teks', deskripsi: 'Pengaturan ukuran font (90%–130%) dan mode kontras tinggi tersedia di toolbar aksesibilitas di bagian atas halaman.' },
  { icon: Keyboard, judul: 'Navigasi Keyboard', deskripsi: 'Seluruh halaman dapat diakses sepenuhnya via keyboard. Gunakan Tab untuk berpindah antar elemen, Enter untuk mengaktifkan, dan Esc untuk menutup menu.' },
  { icon: Volume2, judul: 'Kompatibel Screen Reader', deskripsi: 'Kami menggunakan atribut ARIA, landmark HTML5, dan teks alternatif pada gambar agar kompatibel dengan NVDA, JAWS, dan VoiceOver.' },
  { icon: Monitor, judul: 'Desain Responsif', deskripsi: 'Portal ini dapat diakses dari berbagai perangkat: komputer, tablet, dan smartphone, dengan tampilan yang menyesuaikan ukuran layar.' },
]

const STANDAR = [
  'WCAG 2.1 Level AA — Panduan Aksesibilitas Konten Web',
  'Permenkominfo No. 5/2021 tentang Sistem Elektronik Pemerintah',
  'RPJMN 2020–2024: Transformasi Digital Pemerintah',
  'Undang-Undang No. 8 Tahun 2016 tentang Penyandang Disabilitas',
]

export default function AksesibilitasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pernyataan Aksesibilitas</h1>
      <p className="text-gray-500 mb-8">
        Pemerintah Kabupaten Gianyar berkomitmen menyediakan portal yang dapat diakses oleh semua warga,
        termasuk penyandang disabilitas dan lansia.
      </p>

      {/* Fitur Aksesibilitas */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Fitur Aksesibilitas</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FITUR.map(f => (
            <div key={f.judul} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <f.icon size={20} className="text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{f.judul}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standar yang Diikuti */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Standar yang Diikuti</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <ul className="space-y-3">
            {STANDAR.map(s => (
              <li key={s} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cara Menggunakan */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cara Menggunakan Fitur Aksesibilitas</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <p className="font-semibold text-gray-800 mb-1">Toolbar Aksesibilitas</p>
            <p className="text-sm text-gray-500">
              Di bagian atas halaman terdapat toolbar dengan tombol <strong>A-</strong> dan <strong>A+</strong> untuk mengatur ukuran teks,
              tombol <strong>Kontras</strong> untuk mode kontras tinggi, dan ikon reset untuk mengembalikan ke pengaturan default.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Skip to Content</p>
            <p className="text-sm text-gray-500">
              Tekan <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Tab</kbd> pertama kali saat halaman dimuat
              untuk mengakses tombol &quot;Langsung ke Konten&quot;, yang memungkinkan pengguna keyboard melompati menu navigasi.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Pintasan Keyboard</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              {[
                ['Tab', 'Navigasi maju'],
                ['Shift + Tab', 'Navigasi mundur'],
                ['Enter / Space', 'Aktifkan elemen'],
                ['Esc', 'Tutup dialog/menu'],
                ['Arrow Keys', 'Navigasi dalam menu'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono flex-shrink-0">{key}</kbd>
                  <span className="text-gray-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Masalah yang Diketahui */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Keterbatasan yang Diketahui</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• Beberapa dokumen PDF lama mungkin belum memiliki teks alternatif yang lengkap</li>
            <li>• Peta interaktif memerlukan perangkat penunjuk (mouse/touch) untuk operasi penuh</li>
            <li>• Grafik statistik dilengkapi tabel data sebagai alternatif teks</li>
          </ul>
        </div>
      </section>

      {/* Kontak */}
      <section className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Laporkan Masalah Aksesibilitas</h2>
        <p className="text-sm text-gray-500 mb-4">
          Jika Anda menemukan hambatan aksesibilitas atau memerlukan konten dalam format alternatif,
          silakan hubungi kami:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="mailto:aksesibilitas@gianyarkab.go.id"
            className="flex-1 text-center py-2.5 bg-blue-900 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition">
            Email: aksesibilitas@gianyarkab.go.id
          </a>
          <a href="tel:+62361943049"
            className="flex-1 text-center py-2.5 border border-blue-900 text-blue-900 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
            Telepon: (0361) 943049
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Kami berupaya merespons laporan aksesibilitas dalam waktu 5 hari kerja.
          Pernyataan ini terakhir diperbarui: April 2026.
        </p>
      </section>
    </div>
  )
}
