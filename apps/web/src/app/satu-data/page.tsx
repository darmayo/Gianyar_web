'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'
import { Database, Users, GraduationCap, Heart, Leaf, TrendingUp, Download } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const DATA_KEPENDUDUKAN = [
  { kecamatan: 'Gianyar', penduduk: 94872, lk: 47200, pr: 47672 },
  { kecamatan: 'Sukawati', penduduk: 102541, lk: 51000, pr: 51541 },
  { kecamatan: 'Ubud', penduduk: 76318, lk: 37900, pr: 38418 },
  { kecamatan: 'Blahbatuh', penduduk: 67932, lk: 33800, pr: 34132 },
  { kecamatan: 'Tampaksiring', penduduk: 47218, lk: 23500, pr: 23718 },
  { kecamatan: 'Tegallalang', penduduk: 43104, lk: 21400, pr: 21704 },
  { kecamatan: 'Payangan', penduduk: 37423, lk: 18600, pr: 18823 },
]

const DATA_PENDIDIKAN = [
  { jenjang: 'TK/PAUD', negeri: 42, swasta: 178, total: 220 },
  { jenjang: 'SD', negeri: 198, swasta: 34, total: 232 },
  { jenjang: 'SMP', negeri: 28, swasta: 22, total: 50 },
  { jenjang: 'SMA/SMK', negeri: 12, swasta: 18, total: 30 },
]

const DATA_KESEHATAN = [
  { fasilitas: 'RSUD', jumlah: 1 },
  { fasilitas: 'RS Swasta', jumlah: 8 },
  { fasilitas: 'Puskesmas', jumlah: 13 },
  { fasilitas: 'Pustu', jumlah: 46 },
  { fasilitas: 'Klinik', jumlah: 35 },
  { fasilitas: 'Apotek', jumlah: 78 },
]

const DATA_WISATA = [
  { kategori: 'Infrastruktur', nilai: 85 },
  { kategori: 'Akomodasi', nilai: 92 },
  { kategori: 'Kuliner', nilai: 88 },
  { kategori: 'Atraksi Budaya', nilai: 95 },
  { kategori: 'Aksesibilitas', nilai: 78 },
  { kategori: 'Kebersihan', nilai: 82 },
]

const BG: Record<string,string> = { blue:'bg-blue-50', green:'bg-green-50', red:'bg-red-50', amber:'bg-amber-50', purple:'bg-purple-50', teal:'bg-teal-50' }
const TXT: Record<string,string> = { blue:'text-blue-700', green:'text-green-700', red:'text-red-600', amber:'text-amber-700', purple:'text-purple-700', teal:'text-teal-700' }

export default function SatuDataPage() {
  const { t } = useLang()

  const ANGKA_KUNCI = [
    { label: t('Total Penduduk', 'Total Population'), value:'512.408 jiwa', sub: t('Sensus 2024', 'Census 2024'), icon:Users, color:'blue' },
    { label: t('Sekolah Aktif', 'Active Schools'), value:'532 unit', sub: t('TK s.d. SMA/SMK', 'Kindergarten to Senior High'), icon:GraduationCap, color:'green' },
    { label: t('Fasilitas Kesehatan', 'Health Facilities'), value:'181 unit', sub: t('RS, Puskesmas, Klinik', 'Hospitals, Clinics, Health Centers'), icon:Heart, color:'red' },
    { label: t('Destinasi Wisata', 'Tourist Destinations'), value:'147 objek', sub: t('Terdata & beroperasi', 'Registered & operating'), icon:Leaf, color:'amber' },
    { label: t('UMKM Terdaftar', 'Registered SMEs'), value:'18.432 unit', sub: t('Data NIB 2024', 'NIB Data 2024'), icon:TrendingUp, color:'purple' },
    { label: t('Indeks Gini', 'Gini Index'), value:'0,28', sub: t('Ketimpangan rendah', 'Low inequality'), icon:Database, color:'teal' },
  ]

  function downloadDataset() {
    const rows = [
      ['Dataset', 'Kecamatan/Fasilitas/Jenjang', 'Nilai'],
      ...DATA_KEPENDUDUKAN.map((d) => ['Kependudukan', d.kecamatan, d.penduduk]),
      ...DATA_PENDIDIKAN.map((d) => ['Pendidikan', d.jenjang, d.total]),
      ...DATA_KESEHATAN.map((d) => ['Kesehatan', d.fasilitas, d.jumlah]),
      ...DATA_WISATA.map((d) => ['Pariwisata', d.kategori, d.nilai]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'satu-data-gianyar.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
          <Database size={24} className="text-teal-700 dark:text-teal-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t('Satu Data Gianyar', 'Gianyar One Data')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t('Statistik sektoral terpadu — diperbarui berkala', 'Integrated sectoral statistics — updated periodically')}</p>
        </div>
        </div>
        <button
          type="button"
          onClick={downloadDataset}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 transition"
        >
          <Download size={16} /> {t('Unduh CSV', 'Download CSV')}
        </button>
      </div>
      <p className="text-xs text-gray-400 dark:text-slate-500 mb-8">{t('Sumber: BPS Kab. Gianyar, Dinas terkait · Data per: 2024', 'Source: BPS Gianyar Regency, Related Agencies · Data as of: 2024')}</p>

      {/* Angka Kunci */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {ANGKA_KUNCI.map(a => (
          <div key={a.label} className={`${BG[a.color]} dark:bg-slate-800 rounded-2xl p-5 flex items-start gap-4`}>
            <div className={`w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <a.icon size={20} className={TXT[a.color]} />
            </div>
            <div>
              <p className={`text-2xl font-black ${TXT[a.color]}`}>{a.value}</p>
              <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm">{a.label}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{a.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Penduduk per Kecamatan */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Penduduk per Kecamatan', 'Population by District')}</h2>
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={DATA_KEPENDUDUKAN} layout="vertical" margin={{left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="kecamatan" tick={{fontSize:11}} width={90} />
              <Tooltip formatter={(v:unknown)=>[(v as number).toLocaleString('id-ID')+` ${t('jiwa', 'people')}`,'']} />
              <Bar dataKey="lk" name={t('Laki-laki', 'Male')} stackId="a" fill="#2563eb" />
              <Bar dataKey="pr" name={t('Perempuan', 'Female')} stackId="a" fill="#93c5fd" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Pendidikan */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Sekolah per Jenjang', 'Schools by Level')}</h2>
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DATA_PENDIDIKAN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="jenjang" tick={{fontSize:11}} />
                <YAxis tick={{fontSize:11}} />
                <Tooltip />
                <Bar dataKey="negeri" name={t('Negeri', 'Public')} fill="#16a34a" radius={[4,4,0,0]} />
                <Bar dataKey="swasta" name={t('Swasta', 'Private')} fill="#86efac" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Pariwisata Radar */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Indeks Pariwisata Gianyar', 'Gianyar Tourism Index')}</h2>
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={DATA_WISATA}>
                <PolarGrid />
                <PolarAngleAxis dataKey="kategori" tick={{fontSize:10}} />
                <Radar name={t('Skor', 'Score')} dataKey="nilai" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Fasilitas Kesehatan */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Fasilitas Kesehatan', 'Health Facilities')}</h2>
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DATA_KESEHATAN.map(f => (
            <div key={f.fasilitas} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm text-center">
              <p className="text-3xl font-black text-red-600">{f.jumlah}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{f.fasilitas}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
