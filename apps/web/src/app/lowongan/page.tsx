'use client'
import { Briefcase, MapPin, Clock, Phone, Mail, Calendar, ExternalLink } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const JENIS_COLOR: Record<string, string> = {
  FULL_TIME: 'bg-green-100 text-green-700',
  PART_TIME: 'bg-blue-100 text-blue-700',
  CONTRACT: 'bg-amber-100 text-amber-700',
  MAGANG: 'bg-purple-100 text-purple-700',
}

export default function LowonganPage() {
  const { t } = useLang()
  const now = new Date()

  const JENIS_LABEL: Record<string, string> = {
    FULL_TIME: t('Penuh Waktu', 'Full Time'),
    PART_TIME: t('Paruh Waktu', 'Part Time'),
    CONTRACT: t('Kontrak', 'Contract'),
    MAGANG: t('Magang', 'Internship'),
  }

  const LOWONGAN = [
    {
      id: 1,
      judul: t('Pemandu Wisata (Tour Guide)', 'Tour Guide'),
      perusahaan: 'Ubud Heritage Tours',
      lokasi: t('Ubud, Gianyar', 'Ubud, Gianyar'),
      jenisKerja: 'FULL_TIME',
      bidang: t('Pariwisata', 'Tourism'),
      gaji: 'Rp 4.000.000 – 6.000.000',
      tanggalBuka: '1 Apr 2026',
      tanggalTutup: '30 Apr 2026',
      kontakEmail: 'hr@ubud-tours.co.id',
      persyaratan: [
        t('Min. D3 semua jurusan', 'Min. D3 any major'),
        t('Fasih Bahasa Inggris', 'Fluent in English'),
        t('Berpenampilan menarik', 'Well-groomed appearance'),
        t('Menguasai sejarah budaya Bali', 'Knowledgeable in Balinese cultural history'),
      ],
      deskripsi: t('Memandu wisatawan mancanegara dalam tur budaya dan alam di sekitar Ubud dan Gianyar.', 'Guiding international tourists on cultural and nature tours around Ubud and Gianyar.'),
      highlight: true,
    },
    {
      id: 2,
      judul: t('Pengrajin Perak (Silver Artisan)', 'Silver Artisan'),
      perusahaan: 'Silver Art Celuk',
      lokasi: t('Celuk, Sukawati', 'Celuk, Sukawati'),
      jenisKerja: 'FULL_TIME',
      bidang: t('Kerajinan', 'Crafts'),
      gaji: 'Rp 3.500.000 – 5.000.000',
      tanggalBuka: '15 Mar 2026',
      tanggalTutup: '15 Apr 2026',
      kontakEmail: 'rekrutmen@silverartceluk.com',
      kontakHp: '0878-8901-2345',
      persyaratan: [
        t('Pengalaman ukir perak min. 1 tahun', 'Min. 1 year silver carving experience'),
        t('Teliti dan kreatif', 'Detail-oriented and creative'),
        t('Domisili Gianyar diutamakan', 'Gianyar residents preferred'),
      ],
      deskripsi: t('Membuat perhiasan perak filigri dan ukir motif khas Bali untuk pasar ekspor.', 'Creating filigree silver jewelry and Balinese-motif carvings for the export market.'),
      highlight: false,
    },
    {
      id: 3,
      judul: t('Staf IT / Web Developer', 'IT Staff / Web Developer'),
      perusahaan: 'Dinas Kominfo Gianyar',
      lokasi: t('Gianyar Kota', 'Gianyar City'),
      jenisKerja: 'CONTRACT',
      bidang: t('Teknologi', 'Technology'),
      gaji: 'Rp 5.000.000 – 7.000.000',
      tanggalBuka: '1 Apr 2026',
      tanggalTutup: '20 Apr 2026',
      kontakEmail: 'kominfo@gianyarkab.go.id',
      persyaratan: [
        t('S1 Teknik Informatika / Ilmu Komputer', 'S1 Informatics Engineering / Computer Science'),
        t('Menguasai React/Next.js', 'Proficient in React/Next.js'),
        'PostgreSQL & REST API',
        t('Kontrak 12 bulan', '12-month contract'),
      ],
      deskripsi: t('Membantu pengembangan dan pemeliharaan sistem informasi pemerintah Kabupaten Gianyar.', 'Assisting in the development and maintenance of the Gianyar Regency government information system.'),
      highlight: true,
    },
    {
      id: 4,
      judul: t('Chef / Juru Masak', 'Chef / Cook'),
      perusahaan: 'Dapur Bali Bu Ketut',
      lokasi: t('Sukawati, Gianyar', 'Sukawati, Gianyar'),
      jenisKerja: 'FULL_TIME',
      bidang: t('Kuliner', 'Culinary'),
      gaji: 'Rp 3.000.000 – 4.500.000',
      tanggalBuka: '20 Mar 2026',
      tanggalTutup: '10 Apr 2026',
      kontakHp: '0813-4567-8901',
      persyaratan: [
        t('Pengalaman memasak masakan Bali min. 2 tahun', 'Min. 2 years experience cooking Balinese cuisine'),
        t('Higienis & menjaga kebersihan', 'Hygienic & maintains cleanliness'),
        t('Bersedia kerja shift', 'Willing to work shifts'),
      ],
      deskripsi: t('Menyiapkan jajan tradisional Bali dan masakan khas untuk restoran dan catering.', 'Preparing traditional Balinese snacks and signature dishes for restaurant and catering.'),
      highlight: false,
    },
    {
      id: 5,
      judul: t('Tenaga Kesehatan (Perawat)', 'Healthcare Staff (Nurse)'),
      perusahaan: 'RSUD Sanjiwani Gianyar',
      lokasi: t('Gianyar Kota', 'Gianyar City'),
      jenisKerja: 'FULL_TIME',
      bidang: t('Kesehatan', 'Healthcare'),
      gaji: t('Sesuai standar Pemda', 'Per regional government standard'),
      tanggalBuka: '1 Apr 2026',
      tanggalTutup: '25 Apr 2026',
      kontakEmail: 'sdm@rsud-sanjiwani.go.id',
      persyaratan: [
        t('STR Aktif', 'Active STR License'),
        t('D3/S1 Keperawatan', 'D3/S1 Nursing'),
        t('Bersedia shift malam', 'Willing to work night shifts'),
        t('Berdomisili Gianyar/Bali', 'Resident of Gianyar/Bali'),
      ],
      deskripsi: t('Memberikan pelayanan keperawatan kepada pasien rawat inap dan rawat jalan.', 'Providing nursing care to inpatient and outpatient patients.'),
      highlight: false,
    },
    {
      id: 6,
      judul: t('Instruktur Tari Bali', 'Balinese Dance Instructor'),
      perusahaan: 'Sanggar Seni Peliatan',
      lokasi: t('Peliatan, Ubud', 'Peliatan, Ubud'),
      jenisKerja: 'PART_TIME',
      bidang: t('Seni Budaya', 'Arts & Culture'),
      gaji: t('Rp 2.500.000 + bonus pertunjukan', 'Rp 2,500,000 + performance bonus'),
      tanggalBuka: '1 Apr 2026',
      tanggalTutup: null,
      kontakHp: '0817-123-4567',
      persyaratan: [
        t('Menguasai tari Legong/Kecak/Barong', 'Proficient in Legong/Kecak/Barong dance'),
        t('Pengalaman mengajar', 'Teaching experience'),
        t('Bersedia tampil di pertunjukan reguler', 'Willing to perform in regular shows'),
      ],
      deskripsi: t('Mengajar tari tradisional Bali kepada siswa lokal dan wisatawan. Part-time fleksibel.', 'Teaching traditional Balinese dance to local students and tourists. Flexible part-time.'),
      highlight: false,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-3">
        <Briefcase size={32} className="text-amber-600" aria-hidden="true" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">{t('Lowongan Kerja Lokal', 'Local Job Vacancies')}</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">{t('Info kerja dari perusahaan & UMKM di Kabupaten Gianyar', 'Job info from companies & SMEs in Gianyar Regency')}</p>
        </div>
      </div>

      <p className="text-sm text-gray-400 dark:text-slate-500 mb-8">
        {t('Diperbarui: ', 'Updated: ')}{now.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
        {' '}· {LOWONGAN.length} {t('lowongan tersedia', 'vacancies available')}
      </p>

      {/* Banner daftar UMKM */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-300">{t('Punya bisnis di Gianyar?', 'Have a business in Gianyar?')}</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{t('Daftarkan lowongan kerja Anda secara gratis melalui portal ini.', 'List your job vacancy for free through this portal.')}</p>
        </div>
        <a href="mailto:kominfo@gianyarkab.go.id?subject=Daftar%20Lowongan%20Kerja"
          className="flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-200 dark:bg-amber-800 px-4 py-2 rounded-lg hover:bg-amber-300 dark:hover:bg-amber-700 transition flex-shrink-0">
          {t('Daftarkan Lowongan', 'Post a Vacancy')} <ExternalLink size={12} />
        </a>
      </div>

      {/* Grid lowongan */}
      <div className="space-y-4">
        {LOWONGAN.map(l => {
          const tutupDate = l.tanggalTutup ? new Date(l.tanggalTutup) : null
          const isExpired = tutupDate && tutupDate < now
          const isDaysLeft = tutupDate && !isExpired
            ? Math.ceil((tutupDate.getTime() - now.getTime()) / 86400000)
            : null

          return (
            <article key={l.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-5 hover:shadow-md transition ${
                l.highlight ? 'border-blue-300 dark:border-blue-700 ring-1 ring-blue-200 dark:ring-blue-800' : 'border-gray-100 dark:border-slate-700'
              } ${isExpired ? 'opacity-60' : ''}`}>

              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div className="min-w-0">
                  {l.highlight && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded mr-2">{t('Unggulan', 'Featured')}</span>
                  )}
                  <h2 className="font-bold text-gray-800 dark:text-slate-100 text-base mt-1">{l.judul}</h2>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{l.perusahaan}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${JENIS_COLOR[l.jenisKerja]}`}>
                    {JENIS_LABEL[l.jenisKerja]}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded">{l.bidang}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1"><MapPin size={11} /> {l.lokasi}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {t('Dibuka: ', 'Opened: ')}{l.tanggalBuka}</span>
                {l.tanggalTutup && (
                  <span className={`flex items-center gap-1 ${isDaysLeft && isDaysLeft <= 5 ? 'text-red-600 font-semibold' : ''}`}>
                    <Calendar size={11} />
                    {isExpired ? t('Ditutup', 'Closed') : `${t('Tutup: ', 'Closes: ')}${l.tanggalTutup}${isDaysLeft !== null ? ` (${isDaysLeft} ${t('hari lagi', 'days left')})` : ''}`}
                  </span>
                )}
                {!l.tanggalTutup && <span className="text-green-600 font-medium">{t('Terbuka', 'Open')}</span>}
              </div>

              <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">{l.deskripsi}</p>

              {/* Persyaratan */}
              <details className="mb-3">
                <summary className="text-xs font-medium text-gray-600 dark:text-slate-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-400">
                  {t('Persyaratan', 'Requirements')} ({l.persyaratan.length})
                </summary>
                <ul className="mt-2 list-disc ml-4 space-y-0.5 text-xs text-gray-500 dark:text-slate-400">
                  {l.persyaratan.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </details>

              <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-gray-100 dark:border-slate-700">
                <div className="text-sm font-bold text-green-700 dark:text-green-400">{l.gaji}</div>
                <div className="flex gap-2 flex-wrap">
                  {l.kontakEmail && (
                    <a href={`mailto:${l.kontakEmail}?subject=Lamaran: ${l.judul}`}
                      className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition font-medium">
                      <Mail size={12} /> {t('Kirim Lamaran', 'Send Application')}
                    </a>
                  )}
                  {l.kontakHp && (
                    <a href={`https://wa.me/62${l.kontakHp.replace(/^0/, '').replace(/[\s-]/g, '')}?text=Halo%2C%20saya%20tertarik%20melamar%20posisi%20${encodeURIComponent(l.judul)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition font-medium">
                      <Phone size={12} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400 dark:text-slate-500">
        {t('Informasi lowongan diverifikasi oleh Dinas Tenaga Kerja Kabupaten Gianyar.', 'Job information is verified by the Gianyar Regency Manpower Office.')}
        {' '}{t('Hati-hati penipuan — pelamar ', 'Beware of fraud — applicants are ')}<strong>{t('tidak dipungut biaya', 'not charged any fees')}</strong>{t(' apapun.', '.')}
      </p>
    </div>
  )
}
