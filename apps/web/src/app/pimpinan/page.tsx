'use client'
import { Instagram, Globe, Mail } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const PIMPINAN_UTAMA = [
  {
    jabatan_id: 'Bupati Gianyar',
    jabatan_en: 'Gianyar Regent',
    nama: 'I Made Mahayastra',
    periode: '2021–2026',
    pendidikan_id: 'S2 Manajemen Pariwisata, Universitas Udayana',
    pendidikan_en: 'Master of Tourism Management, Udayana University',
    visi_id: 'Mewujudkan Gianyar yang sejahtera, berbudaya, dan berdaya saing global berbasis nilai Tri Hita Karana.',
    visi_en: 'Realizing a prosperous, culturally rich, and globally competitive Gianyar based on the values of Tri Hita Karana.',
    sosmed: { instagram: '@mahayastra_', web: 'gianyarkab.go.id' },
    warna: 'blue',
  },
  {
    jabatan_id: 'Wakil Bupati Gianyar',
    jabatan_en: 'Gianyar Deputy Regent',
    nama: 'I Wayan Adi Arnawa',
    periode: '2021–2026',
    pendidikan_id: 'S1 Hukum, Universitas Warmadewa',
    pendidikan_en: 'Bachelor of Law, Warmadewa University',
    visi_id: 'Mendukung pemerintahan yang transparan, responsif, dan berorientasi pada pelayanan prima bagi masyarakat.',
    visi_en: 'Supporting a transparent, responsive government oriented toward excellent public service.',
    sosmed: { instagram: '@adiarnawa_', web: 'gianyarkab.go.id' },
    warna: 'green',
  },
]

const SKPD_PIMPINAN = [
  { jabatan_id:'Sekretaris Daerah', jabatan_en:'Regional Secretary', nama:'Drs. I Ketut Mudarta, M.Si', instansi:'Setda Kab. Gianyar' },
  { jabatan_id:'Kepala Dinas Kominfo', jabatan_en:'Head of Communications Office', nama:'I Gede Ngurah Artha, S.T., M.T.', instansi:'Diskominfo' },
  { jabatan_id:'Kepala Dinas Dukcapil', jabatan_en:'Head of Civil Registry Office', nama:'Ni Luh Gede Suartini, S.H.', instansi:'Disdukcapil' },
  { jabatan_id:'Kepala Dinas PU & Tata Ruang', jabatan_en:'Head of Public Works & Spatial Planning', nama:'I Wayan Kari, S.T., M.T.', instansi:'DPUPTR' },
  { jabatan_id:'Kepala Dinas Kesehatan', jabatan_en:'Head of Health Office', nama:'dr. I Nyoman Sutedja, M.Kes.', instansi:'Dinkes' },
  { jabatan_id:'Kepala Dinas Pendidikan', jabatan_en:'Head of Education Office', nama:'I Made Sujana, S.Pd., M.Pd.', instansi:'Disdikpora' },
  { jabatan_id:'Kepala Dinas Pariwisata', jabatan_en:'Head of Tourism Office', nama:'I Wayan Budiarsa, S.Sos., M.Si.', instansi:'Disparda' },
  { jabatan_id:'Kepala BPBD', jabatan_en:'Head of Disaster Management Board', nama:'I Gusti Ngurah Suparta, S.E.', instansi:'BPBD' },
  { jabatan_id:'Kepala Dinas Koperasi & UMKM', jabatan_en:'Head of Cooperative & SME Office', nama:'Ni Ketut Sumarningsih, S.E., M.Si.', instansi:'Diskopumkm' },
  { jabatan_id:'Kepala BKPSDM', jabatan_en:'Head of Civil Service Management Board', nama:'I Nyoman Adnyana, S.H., M.H.', instansi:'BKPSDM' },
  { jabatan_id:'Kepala BPKAD', jabatan_en:'Head of Finance & Asset Management Board', nama:'I Gusti Putu Santosa, S.E., Ak.', instansi:'BPKAD' },
  { jabatan_id:'Kepala Inspektorat', jabatan_en:'Head of Inspectorate', nama:'I Wayan Nuada, S.E., M.Si.', instansi:'Inspektorat' },
]

export default function PimpinanPage() {
  const { t } = useLang()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t('Pimpinan Daerah', 'Regional Leaders')}</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">{t('Profil pimpinan Pemerintah Kabupaten Gianyar periode 2021–2026', 'Profile of Gianyar Regency Government leaders for the period 2021–2026')}</p>

      {/* Bupati & Wakil */}
      <section className="mb-10">
        <div className="grid md:grid-cols-2 gap-6">
          {PIMPINAN_UTAMA.map(p => (
            <div key={p.jabatan_id} className={`bg-gradient-to-br ${p.warna==='blue'?'from-blue-900 to-blue-700':'from-green-800 to-green-600'} text-white rounded-2xl p-6 shadow-lg`}>
              {/* Avatar placeholder */}
              <div className={`w-20 h-20 ${p.warna==='blue'?'bg-blue-800':'bg-green-700'} rounded-full flex items-center justify-center mb-4 text-3xl font-black`}>
                {p.nama.split(' ').slice(-1)[0][0]}
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${p.warna==='blue'?'text-blue-300':'text-green-300'}`}>{t(p.jabatan_id, p.jabatan_en)}</p>
              <h2 className="text-xl font-bold mb-1">{p.nama}</h2>
              <p className={`text-xs mb-4 ${p.warna==='blue'?'text-blue-300':'text-green-300'}`}>{t('Periode ', 'Period ')}{p.periode} · {t(p.pendidikan_id, p.pendidikan_en)}</p>
              <div className={`${p.warna==='blue'?'bg-blue-800/50':'bg-green-700/50'} rounded-xl p-3 mb-4`}>
                <p className={`text-xs font-semibold mb-1 ${p.warna==='blue'?'text-blue-200':'text-green-200'}`}>{t('Visi', 'Vision')}</p>
                <p className="text-sm leading-relaxed italic">&quot;{t(p.visi_id, p.visi_en)}&quot;</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`https://instagram.com/${p.sosmed.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${p.warna==='blue'?'bg-blue-800 hover:bg-blue-700':'bg-green-700 hover:bg-green-600'} transition`}>
                  <Instagram size={12} /> {p.sosmed.instagram}
                </a>
                <a href={`https://${p.sosmed.web}`} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${p.warna==='blue'?'bg-blue-800 hover:bg-blue-700':'bg-green-700 hover:bg-green-600'} transition`}>
                  <Globe size={12} /> {t('Website Resmi', 'Official Website')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKPD Pimpinan */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Pimpinan Perangkat Daerah', 'Regional Apparatus Leaders')}</h2>
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="text-left px-5 py-3">{t('Jabatan', 'Position')}</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">{t('Nama Pejabat', 'Official Name')}</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">{t('Instansi', 'Institution')}</th>
                <th className="px-5 py-3 hidden lg:table-cell">{t('Kontak', 'Contact')}</th>
              </tr>
            </thead>
            <tbody>
              {SKPD_PIMPINAN.map((s, i) => (
                <tr key={s.jabatan_id} className={`border-t border-gray-50 dark:border-slate-700 ${i%2===0?'bg-white dark:bg-slate-800':'bg-gray-50 dark:bg-slate-900'}`}>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-800 dark:text-slate-100">{t(s.jabatan_id, s.jabatan_en)}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 md:hidden">{s.nama}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-700 dark:text-slate-300">{s.nama}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono">{s.instansi}</span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <a href={`mailto:${s.instansi.toLowerCase().replace(/[^a-z]/g,'')}@gianyarkab.go.id`}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      <Mail size={12} /> {t('Email', 'Email')}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
