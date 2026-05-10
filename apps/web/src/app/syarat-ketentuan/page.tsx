import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — Portal Gianyar',
  description: 'Syarat dan Ketentuan Penggunaan Portal Resmi Pemerintah Kabupaten Gianyar',
}

const SECTIONS = [
  {
    judul: '1. Ketentuan Umum',
    isi: [
      'Portal ini dikelola oleh Dinas Komunikasi dan Informatika Kabupaten Gianyar.',
      'Dengan mengakses portal ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.',
      'Pemerintah Kabupaten Gianyar berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.',
    ],
  },
  {
    judul: '2. Penggunaan Layanan',
    isi: [
      'Layanan digital ini tersedia untuk warga Kabupaten Gianyar dan masyarakat umum yang membutuhkan informasi resmi.',
      'Pengguna wajib memberikan informasi yang benar, akurat, dan lengkap saat mengajukan permohonan layanan.',
      'Pengguna dilarang menggunakan portal ini untuk tujuan yang melanggar hukum atau merugikan pihak lain.',
      'Penyalahgunaan layanan dapat mengakibatkan penangguhan akses dan dilaporkan kepada pihak berwenang.',
    ],
  },
  {
    judul: '3. Perlindungan Data Pribadi',
    isi: [
      'Data pribadi yang dikumpulkan digunakan semata-mata untuk keperluan pelayanan publik sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.',
      'Kami tidak akan menjual, menyewakan, atau membagi data pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.',
      'Nomor Induk Kependudukan (NIK) disimpan dalam bentuk terenkripsi dan tidak pernah ditampilkan secara penuh.',
      'Pengguna berhak meminta akses, koreksi, atau penghapusan data pribadi mereka dengan menghubungi kami.',
    ],
  },
  {
    judul: '4. Kekayaan Intelektual',
    isi: [
      'Seluruh konten pada portal ini — termasuk teks, gambar, logo, dan desain — adalah milik Pemerintah Kabupaten Gianyar.',
      'Konten boleh digunakan untuk keperluan non-komersial dengan menyebutkan sumber secara jelas.',
      'Dilarang mereproduksi, mendistribusikan, atau mengkomersialkan konten portal tanpa izin tertulis.',
    ],
  },
  {
    judul: '5. Layanan Pihak Ketiga',
    isi: [
      'Portal ini mungkin memuat tautan ke situs pihak ketiga. Kami tidak bertanggung jawab atas konten atau kebijakan privasi situs tersebut.',
      'Penggunaan layanan pihak ketiga (peta, WhatsApp, dll.) tunduk pada syarat dan ketentuan masing-masing penyedia layanan.',
    ],
  },
  {
    judul: '6. Penafian & Batasan Tanggung Jawab',
    isi: [
      'Portal ini disediakan "sebagaimana adanya". Kami tidak menjamin ketersediaan layanan 24 jam penuh tanpa gangguan.',
      'Kami berupaya menjaga akurasi informasi, namun tidak bertanggung jawab atas kerugian yang timbul akibat ketidakakuratan informasi.',
      'Keputusan yang diambil berdasarkan informasi di portal ini sepenuhnya merupakan tanggung jawab pengguna.',
    ],
  },
  {
    judul: '7. Hukum yang Berlaku',
    isi: [
      'Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia.',
      'Sengketa yang timbul diselesaikan melalui jalur musyawarah, atau jika tidak tercapai kesepakatan, melalui pengadilan yang berwenang di Kabupaten Gianyar.',
    ],
  },
]

export default function SyaratKetentuanPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Syarat & Ketentuan</h1>
      <p className="text-gray-500 mb-1">Portal Resmi Pemerintah Kabupaten Gianyar</p>
      <p className="text-xs text-gray-400 mb-8">Berlaku sejak: 1 Januari 2026 · Terakhir diperbarui: April 2026</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
        Harap baca syarat dan ketentuan ini dengan saksama sebelum menggunakan layanan portal.
        Penggunaan portal dianggap sebagai persetujuan atas syarat-syarat berikut.
      </div>

      <div className="space-y-8">
        {SECTIONS.map(s => (
          <section key={s.judul}>
            <h2 className="text-lg font-bold text-gray-800 mb-3">{s.judul}</h2>
            <ul className="space-y-2">
              {s.isi.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500 mb-3">Pertanyaan terkait syarat dan ketentuan ini dapat disampaikan ke:</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="mailto:info@gianyarkab.go.id"
            className="flex-1 text-center py-2.5 bg-blue-900 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition">
            info@gianyarkab.go.id
          </a>
          <a href="/pengaduan/buat"
            className="flex-1 text-center py-2.5 border border-blue-200 text-blue-900 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
            Kirim Pengaduan
          </a>
        </div>
      </div>
    </div>
  )
}
