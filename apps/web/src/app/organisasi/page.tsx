'use client'
import { Building2, User } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const PIMPINAN = [
  { jabatan_id: 'Bupati Gianyar', jabatan_en: 'Gianyar Regent', nama: 'I Made Mahayastra, S.H.', periode: '2022–2027', foto: null },
  { jabatan_id: 'Wakil Bupati Gianyar', jabatan_en: 'Gianyar Deputy Regent', nama: 'Ir. A.A. Gde Agung Bharata, M.M.', periode: '2022–2027', foto: null },
  { jabatan_id: 'Sekretaris Daerah', jabatan_en: 'Regional Secretary', nama: 'I Dewa Tagel Wirasa, S.H., M.H.', periode: '-', foto: null },
]

const SKPD = [
  { nama_id: 'Dinas Kependudukan dan Pencatatan Sipil', nama_en: 'Civil Registry and Population Office', singkatan: 'Dukcapil', kategori_id: 'Dinas', kategori_en: 'Agency' },
  { nama_id: 'Dinas Kesehatan', nama_en: 'Health Office', singkatan: 'Dinkes', kategori_id: 'Dinas', kategori_en: 'Agency' },
  { nama_id: 'Dinas Pendidikan, Kepemudaan, dan Olahraga', nama_en: 'Education, Youth and Sports Office', singkatan: 'Disdikpora', kategori_id: 'Dinas', kategori_en: 'Agency' },
  { nama_id: 'Dinas Pekerjaan Umum dan Penataan Ruang', nama_en: 'Public Works and Spatial Planning Office', singkatan: 'PUPR', kategori_id: 'Dinas', kategori_en: 'Agency' },
  { nama_id: 'Dinas Pariwisata', nama_en: 'Tourism Office', singkatan: 'Dispar', kategori_id: 'Dinas', kategori_en: 'Agency' },
  { nama_id: 'Dinas Perindustrian dan Perdagangan', nama_en: 'Industry and Trade Office', singkatan: 'Disperindag', kategori_id: 'Dinas', kategori_en: 'Agency' },
  { nama_id: 'Dinas Komunikasi dan Informatika', nama_en: 'Communications and Information Office', singkatan: 'Kominfo', kategori_id: 'Dinas', kategori_en: 'Agency' },
  { nama_id: 'Dinas Penanaman Modal dan PTSP', nama_en: 'Investment and Integrated Licensing Office', singkatan: 'DPMPTSP', kategori_id: 'Dinas', kategori_en: 'Agency' },
  { nama_id: 'Badan Perencanaan Pembangunan Daerah', nama_en: 'Regional Development Planning Board', singkatan: 'Bappeda', kategori_id: 'Badan', kategori_en: 'Board' },
  { nama_id: 'Badan Pengelolaan Keuangan dan Aset Daerah', nama_en: 'Regional Finance and Asset Management Board', singkatan: 'BPKAD', kategori_id: 'Badan', kategori_en: 'Board' },
  { nama_id: 'Badan Pendapatan Daerah', nama_en: 'Regional Revenue Board', singkatan: 'Bapenda', kategori_id: 'Badan', kategori_en: 'Board' },
  { nama_id: 'Badan Penanggulangan Bencana Daerah', nama_en: 'Regional Disaster Management Board', singkatan: 'BPBD', kategori_id: 'Badan', kategori_en: 'Board' },
  { nama_id: 'Inspektorat Daerah', nama_en: 'Regional Inspectorate', singkatan: 'Inspektorat', kategori_id: 'Lembaga', kategori_en: 'Institution' },
  { nama_id: 'Satuan Polisi Pamong Praja', nama_en: 'Civil Service Police Unit', singkatan: 'Satpol PP', kategori_id: 'Lembaga', kategori_en: 'Institution' },
  { nama_id: 'Sekretariat DPRD', nama_en: 'Regional Legislative Secretariat', singkatan: 'Setwan', kategori_id: 'Sekretariat', kategori_en: 'Secretariat' },
]

const kategoriColor: Record<string, string> = {
  Dinas: 'bg-blue-100 text-blue-700',
  Badan: 'bg-green-100 text-green-700',
  Lembaga: 'bg-purple-100 text-purple-700',
  Sekretariat: 'bg-amber-100 text-amber-700',
}

export default function OrganisasiPage() {
  const { t } = useLang()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t('Organisasi Pemerintahan', 'Government Organization')}</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">{t('Struktur perangkat daerah Kabupaten Gianyar', 'Regional apparatus structure of Gianyar Regency')}</p>

      {/* Pimpinan */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-5 flex items-center gap-2">
          <User size={20} className="text-blue-700" /> {t('Pimpinan Daerah', 'Regional Leaders')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {PIMPINAN.map(p => (
            <div key={p.jabatan_id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={28} className="text-blue-700 dark:text-blue-400" />
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-400 mb-1">{t(p.jabatan_id, p.jabatan_en)}</p>
              <p className="font-bold text-gray-800 dark:text-slate-100 text-sm leading-snug">{p.nama}</p>
              {p.periode !== '-' && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{t('Periode ', 'Period ')}{p.periode}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* SKPD */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-5 flex items-center gap-2">
          <Building2 size={20} className="text-blue-700" /> {t('Perangkat Daerah (SKPD)', 'Regional Apparatus (SKPD)')}
        </h2>
        <div className="space-y-2">
          {SKPD.map(s => (
            <div key={s.nama_id} className="flex items-center justify-between bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{t(s.nama_id, s.nama_en)}</p>
                <p className="text-xs text-gray-400 dark:text-slate-400">{s.singkatan}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${kategoriColor[s.kategori_id]}`}>
                {t(s.kategori_id, s.kategori_en)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
