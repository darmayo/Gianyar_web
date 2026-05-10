'use client'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useLang } from '@/contexts/LanguageContext'

const dataBulanan = [
  { bulan: 'Okt', pengaduan: 42 }, { bulan: 'Nov', pengaduan: 58 },
  { bulan: 'Des', pengaduan: 37 }, { bulan: 'Jan', pengaduan: 63 },
  { bulan: 'Feb', pengaduan: 51 }, { bulan: 'Mar', pengaduan: 72 },
]

const dataKategori = [
  { name: 'Infrastruktur', value: 35 }, { name: 'Pelayanan Publik', value: 28 },
  { name: 'Lingkungan', value: 18 }, { name: 'Keamanan', value: 10 },
  { name: 'Lainnya', value: 9 },
]
const PIE_COLORS = ['#1e3a8a','#2563eb','#60a5fa','#93c5fd','#bfdbfe']

const dataLayanan = [
  { kecamatan: 'Gianyar', ktp: 120, kk: 80 }, { kecamatan: 'Ubud', ktp: 98, kk: 65 },
  { kecamatan: 'Sukawati', ktp: 87, kk: 55 }, { kecamatan: 'Blahbatuh', ktp: 64, kk: 42 },
  { kecamatan: 'Tampaksiring', ktp: 53, kk: 38 }, { kecamatan: 'Tegallalang', ktp: 45, kk: 30 },
  { kecamatan: 'Payangan', ktp: 38, kk: 25 },
]

const dataAPBD = [
  { program: 'Pendidikan', anggaran: 125, realisasi: 118 },
  { program: 'Kesehatan', anggaran: 98, realisasi: 91 },
  { program: 'Infrastruktur', anggaran: 210, realisasi: 185 },
  { program: 'Sosial', anggaran: 67, realisasi: 59 },
  { program: 'Pariwisata', anggaran: 45, realisasi: 42 },
]

export default function StatistikPage() {
  const { t } = useLang()

  const KPI = [
    { label: t('Total Pengaduan 2026', 'Total Complaints 2026'), nilai: '323', satuan: t('laporan', 'reports'), warna: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: t('Selesai Tepat Waktu', 'Resolved On Time'), nilai: '89', satuan: '%', warna: 'text-green-700', bg: 'bg-green-50 dark:bg-green-900/30' },
    { label: t('Layanan Kependudukan', 'Civil Registry Services'), nilai: '1.247', satuan: t('permohonan', 'requests'), warna: 'text-purple-700', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    { label: t('Kepuasan Warga (IKM)', 'Resident Satisfaction (IKM)'), nilai: '4.3', satuan: '/ 5.0', warna: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t('Dashboard Statistik Publik', 'Public Statistics Dashboard')}</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">{t('Data layanan dan pengaduan Pemerintah Kabupaten Gianyar — diperbarui bulanan', 'Gianyar Regency Government service and complaint data — updated monthly')}</p>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {KPI.map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-5`}>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">{k.label}</p>
            <p className={`text-3xl font-black ${k.warna}`}>{k.nilai}
              <span className="text-sm font-normal ml-1">{k.satuan}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Bar: pengaduan bulanan */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Pengaduan per Bulan', 'Complaints per Month')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataBulanan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="pengaduan" name={t('Pengaduan', 'Complaints')} fill="#1e3a8a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie: kategori */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Kategori Pengaduan', 'Complaint Categories')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={dataKategori} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0)*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {dataKategori.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar: layanan per kecamatan */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Layanan KTP & KK per Kecamatan', 'ID Card & Family Card Services per District')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataLayanan} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="kecamatan" type="category" tick={{ fontSize: 11 }} width={75} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ktp" name="KTP" fill="#1e3a8a" radius={[0,4,4,0]} />
              <Bar dataKey="kk" name="KK" fill="#60a5fa" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar: APBD */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Realisasi APBD (Miliar Rp)', 'Budget Realization (Billion IDR)')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataAPBD}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="program" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`Rp ${v} M`]} />
              <Legend />
              <Bar dataKey="anggaran" name={t('Anggaran', 'Budget')} fill="#e2e8f0" radius={[4,4,0,0]} />
              <Bar dataKey="realisasi" name={t('Realisasi', 'Realization')} fill="#1e3a8a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
