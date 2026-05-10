'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-100 dark:border-slate-700 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      >
        <span className="font-medium text-gray-800 dark:text-slate-100 text-sm">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-400 dark:text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-600 dark:text-slate-300 leading-relaxed pr-8">{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  const { t } = useLang()

  const FAQS = [
    {
      kategori: t('KTP & Kependudukan', 'ID Card & Civil Registry'),
      items: [
        {
          q: t('Apa syarat membuat KTP baru?', 'What are the requirements for a new ID card?'),
          a: t('Fotokopi Kartu Keluarga, Surat Pengantar RT/RW, dan pas foto 3x4 (2 lembar). Untuk perekaman sidik jari, hadir langsung ke Dinas Dukcapil.', 'Photocopy of Family Card, RT/RW Cover Letter, and 3x4 passport photo (2 pieces). For fingerprint recording, come in person to the Civil Registry Office.'),
        },
        {
          q: t('Berapa lama proses pembuatan KTP?', 'How long does the ID card process take?'),
          a: t('Proses pembuatan KTP-el memakan waktu maksimal 14 hari kerja setelah semua dokumen lengkap dan perekaman selesai.', 'The electronic ID card process takes a maximum of 14 working days after all documents are complete and recording is done.'),
        },
        {
          q: t('Bagaimana jika KTP saya hilang?', 'What if my ID card is lost?'),
          a: t('Laporkan ke Kepolisian setempat untuk mendapat Surat Keterangan Kehilangan, lalu bawa ke Dukcapil beserta fotokopi KK.', 'Report to the local Police to get a Loss Certificate, then bring it to the Civil Registry Office along with a photocopy of your Family Card.'),
        },
        {
          q: t('Apakah bisa mengurus KTP secara online?', 'Can I process my ID card online?'),
          a: t('Saat ini pengajuan bisa dilakukan online melalui portal ini, namun perekaman biometrik tetap harus hadir langsung.', 'Currently, applications can be made online through this portal, but biometric recording still requires an in-person visit.'),
        },
      ],
    },
    {
      kategori: t('Pengaduan Masyarakat', 'Public Complaints'),
      items: [
        {
          q: t('Bagaimana cara mengajukan pengaduan?', 'How do I submit a complaint?'),
          a: t('Kunjungi menu "Pengaduan", isi formulir online dengan lengkap, lampirkan foto/dokumen pendukung, lalu kirim. Anda akan mendapat nomor tiket otomatis.', 'Visit the "Complaints" menu, fill in the online form completely, attach supporting photos/documents, then submit. You will receive an automatic ticket number.'),
        },
        {
          q: t('Berapa lama pengaduan diselesaikan?', 'How long does it take to resolve a complaint?'),
          a: t('Bervariasi: Keamanan 3 hari, Kesehatan 5 hari, Pelayanan Publik 7 hari, Lingkungan 10 hari, Infrastruktur & lainnya 14 hari kerja.', 'Varies: Security 3 days, Health 5 days, Public Service 7 days, Environment 10 days, Infrastructure & others 14 working days.'),
        },
        {
          q: t('Bisakah saya melapor secara anonim?', 'Can I report anonymously?'),
          a: t('Ya, centang opsi "Kirim sebagai anonim" saat mengisi formulir. Identitas Anda tidak akan ditampilkan, namun tetap tersimpan di sistem untuk verifikasi.', 'Yes, check the "Submit as anonymous" option when filling out the form. Your identity will not be displayed, but is still stored in the system for verification.'),
        },
        {
          q: t('Bagaimana cara memantau status pengaduan?', 'How do I track the status of my complaint?'),
          a: t('Gunakan nomor tiket yang dikirim ke email/WhatsApp Anda, lalu masukkan di halaman "Cek Status Pengaduan".', 'Use the ticket number sent to your email/WhatsApp, then enter it on the "Check Complaint Status" page.'),
        },
      ],
    },
    {
      kategori: t('Perizinan', 'Permits & Licensing'),
      items: [
        {
          q: t('Apa saja izin yang bisa diurus secara online?', 'What permits can be processed online?'),
          a: t('IMB, SIUP, TDP, izin keramaian, dan beberapa izin usaha lainnya sudah dapat diajukan melalui sistem OSS terintegrasi.', 'Building permits (IMB), business licenses (SIUP), trade registration (TDP), event permits, and several other business licenses can be submitted through the integrated OSS system.'),
        },
        {
          q: t('Berapa biaya pengurusan IMB?', 'How much does a building permit (IMB) cost?'),
          a: t('Biaya IMB dihitung berdasarkan luas bangunan, fungsi bangunan, dan zona. Untuk estimasi, gunakan kalkulator IMB di halaman Perizinan.', 'IMB fees are calculated based on building area, building function, and zone. For an estimate, use the IMB calculator on the Permits page.'),
        },
      ],
    },
    {
      kategori: t('Antrian & Layanan Offline', 'Queue & Offline Services'),
      items: [
        {
          q: t('Bagaimana cara ambil nomor antrian online?', 'How do I get an online queue number?'),
          a: t('Di menu layanan yang dipilih, klik "Ambil Nomor Antrian". Pilih tanggal, waktu, dan jenis layanan. QR code akan dikirim ke email/WhatsApp Anda.', 'In the selected service menu, click "Get Queue Number". Select date, time, and service type. A QR code will be sent to your email/WhatsApp.'),
        },
        {
          q: t('Jam layanan Dinas Dukcapil?', 'What are the Civil Registry Office hours?'),
          a: t('Senin–Kamis: 08.00–14.00 WITA. Jumat: 08.00–11.30 WITA. Sabtu–Minggu: Libur.', 'Monday–Thursday: 08:00–14:00 WITA. Friday: 08:00–11:30 WITA. Saturday–Sunday: Closed.'),
        },
      ],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t('Pertanyaan yang Sering Diajukan', 'Frequently Asked Questions')}</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-10">
        {t('Temukan jawaban cepat untuk pertanyaan umum seputar layanan Kabupaten Gianyar.', 'Find quick answers to common questions about Gianyar Regency services.')}
      </p>

      <div className="space-y-6">
        {FAQS.map((kategori) => (
          <section key={kategori.kategori} aria-labelledby={`faq-${kategori.kategori}`}>
            <h2
              id={`faq-${kategori.kategori}`}
              className="text-sm font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider mb-3 px-1"
            >
              {kategori.kategori}
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm px-5">
              {kategori.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-gray-500 dark:text-slate-400">
        {t('Tidak menemukan jawaban?', "Can't find an answer?")}{' '}
        <a
          href="https://wa.me/6236194304900?text=Halo%2C+saya+punya+pertanyaan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 dark:text-blue-400 hover:underline font-medium"
        >
          {t('Hubungi kami via WhatsApp', 'Contact us via WhatsApp')}
        </a>
      </p>
    </div>
  )
}
