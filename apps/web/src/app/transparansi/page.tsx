'use client'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, TrendingUp, DollarSign, FileText, ExternalLink } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const APBD_TAHUNAN = [
  { tahun: '2022', pendapatan: 1842, belanja: 1798, surplus: 44 },
  { tahun: '2023', pendapatan: 1975, belanja: 1921, surplus: 54 },
  { tahun: '2024', pendapatan: 2134, belanja: 2088, surplus: 46 },
  { tahun: '2025', pendapatan: 2287, belanja: 2231, surplus: 56 },
  { tahun: '2026', pendapatan: 2410, belanja: 2350, surplus: 60 },
]

const REALISASI_2026 = [
  { bulan: 'Jan', target: 201, realisasi: 188 },
  { bulan: 'Feb', target: 201, realisasi: 195 },
  { bulan: 'Mar', target: 201, realisasi: 210 },
  { bulan: 'Apr', target: 201, realisasi: 97 },
]

const BELANJA_SEKTOR_ID = ['Pendidikan', 'Infrastruktur', 'Kesehatan', 'Sosial & Lingkungan', 'Aparatur', 'Lainnya']
const BELANJA_SEKTOR_EN = ['Education', 'Infrastructure', 'Health', 'Social & Environment', 'Apparatus', 'Others']
const BELANJA_VALUES = [32, 24, 18, 12, 9, 5]
const BELANJA_ANGGARAN = [771, 564, 423, 282, 211, 118]
const COLORS = ['#1e3a8a','#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe']

const LAPORAN = [
  { tahun: '2025', jenis: 'LKPD (Laporan Keuangan Pemerintah Daerah)', jenisEn: 'LKPD (Regional Government Financial Report)', opini: 'WTP', ukuran: '4.2 MB' },
  { tahun: '2025', jenis: 'Laporan Realisasi APBD', jenisEn: 'Regional Budget Realization Report', opini: '-', ukuran: '1.8 MB' },
  { tahun: '2025', jenis: 'Laporan Kinerja (LKjIP)', jenisEn: 'Performance Report (LKjIP)', opini: 'B', ukuran: '3.1 MB' },
  { tahun: '2024', jenis: 'LKPD Audited (BPK)', jenisEn: 'Audited LKPD (BPK)', opini: 'WTP', ukuran: '5.6 MB' },
  { tahun: '2024', jenis: 'Laporan Realisasi APBD', jenisEn: 'Regional Budget Realization Report', opini: '-', ukuran: '2.0 MB' },
  { tahun: '2023', jenis: 'LKPD Audited (BPK)', jenisEn: 'Audited LKPD (BPK)', opini: 'WTP', ukuran: '5.1 MB' },
]

export default function TransparansiPage() {
  const { t, lang } = useLang()

  const belanjaSector = BELANJA_VALUES.map((value, i) => ({
    name: lang === 'id' ? BELANJA_SEKTOR_ID[i] : BELANJA_SEKTOR_EN[i],
    value,
    anggaran: BELANJA_ANGGARAN[i],
  }))

  const KPI = [
    { label: t('APBD 2026', 'Regional Budget 2026'), value: 'Rp 2,41 T', sub: t('Anggaran ditetapkan', 'Approved budget'), icon: DollarSign, color: 'blue' },
    { label: t('Realisasi Pendapatan', 'Revenue Realization'), value: '28,7%', sub: t('per April 2026', 'as of April 2026'), icon: TrendingUp, color: 'green' },
    { label: t('Opini BPK 2024', 'BPK Audit Opinion 2024'), value: 'WTP', sub: t('Wajar Tanpa Pengecualian', 'Unqualified Opinion'), icon: FileText, color: 'amber' },
    { label: t('Keterbukaan Info', 'Info Transparency'), value: '#3', sub: t('Peringkat di Bali', 'Rank in Bali'), icon: ExternalLink, color: 'purple' },
  ]

  function downloadReport(report: typeof LAPORAN[number]) {
    const rows = [
      ['Tahun', 'Dokumen', 'Opini/Nilai', 'Ukuran'],
      [report.tahun, lang === 'id' ? report.jenis : report.jenisEn, report.opini, report.ukuran],
      [],
      ['Sumber', 'BPKAD Kabupaten Gianyar'],
      ['Catatan', lang === 'id' ? 'Dokumen contoh portal. Hubungkan ke arsip resmi untuk PDF final.' : 'Portal sample document. Connect to official archive for final PDF.'],
    ]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.tahun}-${(lang === 'id' ? report.jenis : report.jenisEn).toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-1">
        {t('Transparansi Anggaran', 'Budget Transparency')}
      </h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">
        {t('APBD & Laporan Keuangan Pemerintah Kabupaten Gianyar', 'Regional Budget & Financial Reports of Gianyar Regency')}
      </p>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-4 gap-4 mb-10">
        {KPI.map(c => (
          <div key={c.label} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-${c.color}-100 dark:bg-${c.color}-900`}>
              <c.icon size={18} className={`text-${c.color}-700 dark:text-${c.color}-300`} />
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">{c.value}</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mt-0.5">{c.label}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart APBD 5 Tahun */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">
          {t('Tren APBD 2022–2026 (Miliar Rupiah)', 'Regional Budget Trend 2022–2026 (Billion IDR)')}
        </h2>
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={APBD_TAHUNAN} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="tahun" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip formatter={(v: unknown) => [`Rp ${v} M`, '']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
              <Legend />
              <Bar dataKey="pendapatan" name={t('Pendapatan', 'Revenue')} fill="#2563eb" radius={[4,4,0,0]} />
              <Bar dataKey="belanja" name={t('Belanja', 'Expenditure')} fill="#60a5fa" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <section>
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">
            {t('Realisasi Pendapatan 2026', '2026 Revenue Realization')}
          </h2>
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={REALISASI_2026}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip formatter={(v: unknown) => [`Rp ${v} M`, '']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
                <Legend />
                <Line dataKey="target" name={t('Target', 'Target')} stroke="#d1d5db" strokeDasharray="5 5" dot={false} />
                <Line dataKey="realisasi" name={t('Realisasi', 'Realization')} stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">
            {t('Komposisi Belanja 2026', '2026 Expenditure Breakdown')}
          </h2>
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={belanjaSector} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({name, value}) => `${name} ${value}%`} labelLine={false} fontSize={10}>
                  {belanjaSector.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: unknown, name: unknown, props: {payload?: {anggaran?: number}}) => [`${v}% — Rp ${props.payload?.anggaran} M`, String(name)]} contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {belanjaSector.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{background:COLORS[i]}} />
                  {s.name}: Rp {s.anggaran}M
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Laporan Keuangan */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Download size={20} className="text-blue-700" />
          {t('Laporan Keuangan yang Dapat Diunduh', 'Downloadable Financial Reports')}
        </h2>
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="text-left px-5 py-3">{t('Tahun', 'Year')}</th>
                <th className="text-left px-5 py-3">{t('Dokumen', 'Document')}</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">{t('Opini/Nilai', 'Opinion/Grade')}</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">{t('Ukuran', 'Size')}</th>
                <th className="px-5 py-3">{t('Aksi', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {LAPORAN.map((l, i) => (
                <tr key={i} className={`border-t border-gray-50 dark:border-slate-700 ${i%2===0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-750'}`}>
                  <td className="px-5 py-3 font-semibold text-gray-700 dark:text-slate-300">{l.tahun}</td>
                  <td className="px-5 py-3 text-gray-700 dark:text-slate-300">{t(l.jenis, l.jenisEn)}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {l.opini !== '-' && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.opini==='WTP' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>{l.opini}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-gray-400 dark:text-slate-500 text-xs">{l.ukuran}</td>
                  <td className="px-5 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => downloadReport(l)}
                      className="text-xs bg-blue-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition flex items-center gap-1 mx-auto"
                    >
                      <Download size={12} /> {t('Unduh', 'Download')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">
          {t(
            'Sumber: Badan Pengelola Keuangan & Aset Daerah (BPKAD) Kab. Gianyar · Diperbarui: April 2026',
            'Source: Regional Finance & Asset Management Agency (BPKAD) Gianyar · Updated: April 2026'
          )}
        </p>
      </section>
    </div>
  )
}
