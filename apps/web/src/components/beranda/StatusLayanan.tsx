'use client'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const STATUS_SERVICES_ID = [
  { nama: 'Portal Layanan Online', namaEn: 'Online Service Portal', status: 'ONLINE', latency: '42ms' },
  { nama: 'Antrian Digital', namaEn: 'Digital Queue', status: 'ONLINE', latency: '58ms' },
  { nama: 'Sistem Pengaduan', namaEn: 'Complaint System', status: 'ONLINE', latency: '71ms' },
  { nama: 'Verifikasi Dokumen', namaEn: 'Document Verification', status: 'ONLINE', latency: '55ms' },
  { nama: 'Cek Pajak PBB', namaEn: 'Property Tax Check', status: 'ONLINE', latency: '63ms' },
  { nama: 'Notifikasi SMS/Email', namaEn: 'SMS/Email Notifications', status: 'TERBATAS', latency: '–' },
]

const uptime = Math.round((STATUS_SERVICES_ID.filter(s => s.status === 'ONLINE').length / STATUS_SERVICES_ID.length) * 100)

export function StatusLayanan() {
  const { t } = useLang()
  const allOnline = STATUS_SERVICES_ID.every(s => s.status === 'ONLINE')
  const hasIssue = STATUS_SERVICES_ID.some(s => s.status === 'GANGGUAN')

  return (
    <section aria-labelledby="status-heading" className="py-8 px-4 bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {allOnline ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : hasIssue ? (
              <AlertCircle size={18} className="text-red-500" />
            ) : (
              <Clock size={18} className="text-amber-500" />
            )}
            <h2 id="status-heading" className="font-bold text-gray-800 dark:text-slate-100">
              {t('Status Layanan Digital', 'Digital Service Status')}
            </h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${allOnline ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'}`}>
              {allOnline ? t('Semua Sistem Normal', 'All Systems Normal') : t('Ada Gangguan Minor', 'Minor Issues')}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
            <span>{t('Uptime', 'Uptime')}: <strong className="text-green-600 dark:text-green-400">{uptime}%</strong></span>
            <Link href="/layanan" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              {t('Lihat semua layanan →', 'View all services →')}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STATUS_SERVICES_ID.map(s => (
            <div key={s.nama} className={`rounded-xl p-3 border text-center
              ${s.status === 'ONLINE' ? 'bg-green-50 border-green-100 dark:bg-green-950 dark:border-green-900' :
                s.status === 'TERBATAS' ? 'bg-amber-50 border-amber-100 dark:bg-amber-950 dark:border-amber-900' :
                'bg-red-50 border-red-100 dark:bg-red-950 dark:border-red-900'}`}>
              <div className={`w-2 h-2 rounded-full mx-auto mb-2
                ${s.status === 'ONLINE' ? 'bg-green-500 animate-pulse' :
                  s.status === 'TERBATAS' ? 'bg-amber-400' : 'bg-red-500'}`} />
              <p className="text-xs font-medium text-gray-700 dark:text-slate-300 leading-snug">
                {t(s.nama, s.namaEn)}
              </p>
              {s.latency !== '–' && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{s.latency}</p>
              )}
              <p className={`text-xs font-bold mt-1
                ${s.status === 'ONLINE' ? 'text-green-600 dark:text-green-400' :
                  s.status === 'TERBATAS' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                {s.status === 'ONLINE' ? t('ONLINE', 'ONLINE') :
                  s.status === 'TERBATAS' ? t('TERBATAS', 'LIMITED') : t('GANGGUAN', 'DOWN')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
