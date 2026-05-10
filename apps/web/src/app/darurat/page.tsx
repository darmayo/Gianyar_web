'use client'
import { Phone, AlertTriangle, Shield, Flame, HeartPulse, Car } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

export default function DaruratPage() {
  const { t } = useLang()

  const KONTAK = [
    { label: t('Ambulans / RSUD Sanjiwani', 'Ambulance / Sanjiwani Hospital'), telp:'(0361) 943354', icon:<HeartPulse size={28} />, warna:'bg-red-100 text-red-700 border-red-200', keterangan: t('UGD 24 jam', '24-hour Emergency') },
    { label: t('Pemadam Kebakaran', 'Fire Department'), telp:'(0361) 943113', icon:<Flame size={28} />, warna:'bg-orange-100 text-orange-700 border-orange-200', keterangan: t('Siaga 24 jam', 'On standby 24 hours') },
    { label: t('Polres Gianyar', 'Gianyar Police'), telp:'(0361) 943110', icon:<Shield size={28} />, warna:'bg-blue-100 text-blue-700 border-blue-200', keterangan: t('Hotline keamanan', 'Security hotline') },
    { label: t('BPBD Gianyar', 'Gianyar BPBD'), telp:'(0361) 943012', icon:<AlertTriangle size={28} />, warna:'bg-yellow-100 text-yellow-700 border-yellow-200', keterangan: t('Penanggulangan bencana', 'Disaster management') },
    { label: t('Dinas Perhubungan', 'Transportation Office'), telp:'(0361) 943058', icon:<Car size={28} />, warna:'bg-purple-100 text-purple-700 border-purple-200', keterangan: t('Kemacetan & lalu lintas', 'Traffic & congestion') },
    { label: t('PLN Gianyar', 'Gianyar PLN'), telp:'123', icon:<Phone size={28} />, warna:'bg-amber-100 text-amber-700 border-amber-200', keterangan: t('Gangguan listrik', 'Power outage') },
    { label: t('PDAM Gianyar', 'Gianyar PDAM'), telp:'(0361) 943118', icon:<Phone size={28} />, warna:'bg-teal-100 text-teal-700 border-teal-200', keterangan: t('Gangguan air bersih', 'Water supply disruption') },
    { label: t('Emergency Nasional', 'National Emergency'), telp:'112', icon:<Phone size={28} />, warna:'bg-gray-100 text-gray-700 border-gray-200', keterangan: t('Single emergency number', 'Single emergency number') },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
          <AlertTriangle size={24} className="text-red-700 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t('Kontak Darurat', 'Emergency Contacts')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t('Kabupaten Gianyar — Siap 24 jam', 'Gianyar Regency — Available 24 hours')}</p>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8 text-sm text-red-800 dark:text-red-300">
        <p className="font-bold mb-1">{t('Dalam Keadaan Darurat', 'In an Emergency')}</p>
        <p>{t('Hubungi ', 'Call ')}<strong>112</strong>{t(' (nomor darurat nasional) atau langsung tekan nomor di bawah ini. Tetap tenang dan sampaikan lokasi Anda dengan jelas.', ' (national emergency number) or press the numbers below. Stay calm and state your location clearly.')}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {KONTAK.map(k => (
          <a key={k.label} href={`tel:${k.telp.replace(/[^+\d]/g,'')}`}
            className={`flex items-center gap-4 border rounded-2xl p-4 ${k.warna} hover:shadow-md transition active:scale-95`}>
            <span className="flex-shrink-0">{k.icon}</span>
            <div>
              <p className="font-bold text-sm">{k.label}</p>
              <p className="text-lg font-black font-mono">{k.telp}</p>
              <p className="text-xs opacity-70">{k.keterangan}</p>
            </div>
          </a>
        ))}
      </div>

      {/* CCTV Placeholder */}
      <section className="mb-8">
        <h2 className="font-bold text-gray-800 dark:text-slate-100 mb-3 text-lg">{t('CCTV Publik (Live)', 'Public CCTV (Live)')}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { lokasi: t('Simpang Empat Gianyar', 'Gianyar Main Intersection'), status:'online' },
            { lokasi: t('Jl. Raya Ubud — Pasar', 'Jl. Raya Ubud — Market'), status:'online' },
            { lokasi: t('Bundaran Batubulan', 'Batubulan Roundabout'), status:'offline' },
            { lokasi: t('Jl. Bypass Sukawati', 'Jl. Bypass Sukawati'), status:'offline' },
          ].map(c => (
            <div key={c.lokasi} className={`rounded-xl border p-3 ${c.status==='online' ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700'}`}>
              <div className={`rounded-lg aspect-video flex items-center justify-center mb-2 ${c.status==='online' ? 'bg-gray-800' : 'bg-gray-200 dark:bg-slate-700'}`}>
                {c.status==='online'
                  ? <p className="text-white text-xs opacity-60">{t('Feed CCTV (integrasi dalam pengembangan)', 'CCTV Feed (integration in development)')}</p>
                  : <p className="text-gray-400 dark:text-slate-400 text-xs">{t('Offline', 'Offline')}</p>
                }
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${c.status==='online' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <p className={`text-xs font-medium ${c.status==='online' ? 'text-gray-200' : 'text-gray-500 dark:text-slate-400'}`}>{c.lokasi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-center text-gray-400 dark:text-slate-500">
        {t('Info bencana lebih lengkap di ', 'More disaster info at ')}<a href="/bpbd" className="text-blue-600 dark:text-blue-400 hover:underline">{t('halaman BPBD', 'BPBD page')}</a>
      </p>
    </div>
  )
}
