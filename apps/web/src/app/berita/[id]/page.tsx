import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, ArrowLeft, MapPin, Tag } from 'lucide-react'

const BERITA: Record<string, {
  id: string
  judul: string
  isi: string[]
  tanggal: string
  kategori: string
  penulis: string
  lokasi: string
  gradient: string
}> = {
  '1': {
    id: '1',
    judul: 'Pemkab Gianyar Luncurkan Program Digitalisasi Layanan Publik',
    isi: [
      'Pemerintah Kabupaten Gianyar secara resmi meluncurkan program digitalisasi layanan publik yang mencakup 12 jenis layanan kependudukan pada Senin (2/4/2026).',
      'Program ini memungkinkan masyarakat mengakses layanan seperti permohonan KTP, Kartu Keluarga, Akta Kelahiran, hingga pengajuan perizinan secara online tanpa harus datang langsung ke kantor.',
      'Bupati Gianyar dalam sambutannya menyampaikan bahwa program ini merupakan bagian dari komitmen pemerintah daerah untuk mewujudkan tata kelola pemerintahan yang efisien, transparan, dan berorientasi pada pelayanan masyarakat.',
      'Dengan diluncurkannya portal layanan digital ini, diharapkan antrian di kantor Dukcapil dan dinas terkait dapat berkurang signifikan, serta waktu penyelesaian layanan dapat dipercepat.',
    ],
    tanggal: '2 April 2026',
    kategori: 'Pengumuman',
    penulis: 'Humas Pemkab Gianyar',
    lokasi: 'Kantor Bupati Gianyar',
    gradient: 'from-blue-600 to-indigo-700',
  },
  '2': {
    id: '2',
    judul: 'Festival Seni Ubud 2026 Resmi Dibuka, Dihadiri Ribuan Wisatawan',
    isi: [
      'Festival Seni Ubud 2026 secara resmi dibuka pada Selasa (1/4/2026) di Puri Ubud, dihadiri oleh ribuan wisatawan domestik dan mancanegara.',
      'Festival yang berlangsung selama 5 hari ini menampilkan lebih dari 120 penampilan seni dari seluruh Indonesia dan mancanegara, termasuk pertunjukan Tari Kecak, wayang kulit, gamelan, serta seni kontemporer.',
      'Direktur Festival menyampaikan bahwa tahun ini tema "Bali dan Dunia" diangkat untuk memperlihatkan bagaimana seni dan budaya Bali terus berkembang dan berinteraksi dengan pengaruh global.',
      'Penampilan unggulan termasuk kolaborasi musisi internasional dengan seniman lokal Ubud, serta pameran seni rupa dari 45 galeri di wilayah Gianyar.',
    ],
    tanggal: '1 April 2026',
    kategori: 'Budaya',
    penulis: 'Tim Redaksi Portal Gianyar',
    lokasi: 'Puri Ubud, Kecamatan Ubud',
    gradient: 'from-purple-600 to-pink-700',
  },
  '3': {
    id: '3',
    judul: 'Pembangunan Jalan Raya Tegallalang Selesai Tepat Waktu',
    isi: [
      'Proyek pembangunan Jalan Raya Tegallalang senilai Rp 4,2 miliar telah selesai tepat sesuai jadwal dan resmi diserahterimakan pada Minggu (30/3/2026).',
      'Jalan sepanjang 3,2 km ini menghubungkan Desa Tegallalang dengan kawasan wisata Ceking yang selama ini menjadi salah satu destinasi paling dikunjungi di Kabupaten Gianyar.',
      'Kepala Dinas Pekerjaan Umum Kabupaten Gianyar menjelaskan bahwa perbaikan jalan ini dilengkapi dengan pelebaran badan jalan dari 5 meter menjadi 7 meter, serta pemasangan saluran drainase yang lebih baik.',
      'Dengan selesainya proyek ini, diharapkan konektivitas wisata di kawasan Tegallalang meningkat dan memberikan dampak positif bagi perekonomian warga setempat.',
    ],
    tanggal: '30 Maret 2026',
    kategori: 'Infrastruktur',
    penulis: 'Dinas PU Kabupaten Gianyar',
    lokasi: 'Kecamatan Tegallalang, Gianyar',
    gradient: 'from-orange-500 to-red-600',
  },
}

const KATEGORI_WARNA: Record<string, string> = {
  Pengumuman: 'bg-blue-100 text-blue-700',
  Budaya: 'bg-purple-100 text-purple-700',
  Infrastruktur: 'bg-orange-100 text-orange-700',
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const berita = BERITA[id]
  if (!berita) return { title: 'Berita tidak ditemukan' }
  return {
    title: berita.judul,
    description: berita.isi[0],
  }
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const berita = BERITA[id]
  if (!berita) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link href="/berita"
        className="inline-flex items-center gap-2 text-sm text-blue-700 hover:underline mb-6 focus:outline-none focus:underline">
        <ArrowLeft size={16} aria-hidden="true" />
        Kembali ke Berita
      </Link>

      {/* Hero */}
      <div className={`h-52 md:h-64 rounded-2xl bg-gradient-to-br ${berita.gradient} mb-6 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          aria-hidden="true" />
        <h1 className="relative text-white text-xl md:text-2xl font-bold text-center px-8 leading-snug">
          {berita.judul}
        </h1>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-6 text-sm">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${KATEGORI_WARNA[berita.kategori] ?? 'bg-gray-100 text-gray-700'}`}>
          <Tag size={11} className="inline mr-1" aria-hidden="true" />
          {berita.kategori}
        </span>
        <span className="flex items-center gap-1.5 text-gray-500">
          <Calendar size={14} aria-hidden="true" />
          {berita.tanggal}
        </span>
        <span className="flex items-center gap-1.5 text-gray-500">
          <MapPin size={14} aria-hidden="true" />
          {berita.lokasi}
        </span>
      </div>

      {/* Isi */}
      <div className="prose prose-gray max-w-none">
        {berita.isi.map((paragraf, i) => (
          <p key={i} className="text-gray-700 leading-relaxed mb-4">
            {paragraf}
          </p>
        ))}
      </div>

      {/* Footer artikel */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        Ditulis oleh: <strong>{berita.penulis}</strong>
      </div>

      {/* CTA kembali */}
      <div className="mt-6">
        <Link href="/berita"
          className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <ArrowLeft size={16} aria-hidden="true" />
          Lihat Berita Lainnya
        </Link>
      </div>
    </article>
  )
}
