'use client'
import { useState, useEffect } from 'react'
import { Camera, Wind, Activity, Wifi, WifiOff, RefreshCw, ThumbsUp } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const CCTV = [
  { id:1, lokasi:'Simpang Patung Bayi, Gianyar', status:'ONLINE', kondisi:'LANCAR', kondisiEn:'CLEAR', thumbnail:'🟢', koordinat:'Pusat kota', koordinatEn:'City center' },
  { id:2, lokasi:'Jl. Raya Ubud (depan Monkey Forest)', status:'ONLINE', kondisi:'PADAT', kondisiEn:'BUSY', thumbnail:'🟡', koordinat:'Ubud', koordinatEn:'Ubud' },
  { id:3, lokasi:'Pasar Seni Sukawati', status:'ONLINE', kondisi:'PADAT', kondisiEn:'BUSY', thumbnail:'🟡', koordinat:'Sukawati', koordinatEn:'Sukawati' },
  { id:4, lokasi:'Simpang Tiga Batubulan', status:'OFFLINE', kondisi:'-', kondisiEn:'-', thumbnail:'🔴', koordinat:'Sukawati', koordinatEn:'Sukawati' },
  { id:5, lokasi:'Jl. Raya Tegallalang', status:'ONLINE', kondisi:'LANCAR', kondisiEn:'CLEAR', thumbnail:'🟢', koordinat:'Tegallalang', koordinatEn:'Tegallalang' },
  { id:6, lokasi:'Pasar Gianyar (pintu masuk)', status:'ONLINE', kondisi:'LANCAR', kondisiEn:'CLEAR', thumbnail:'🟢', koordinat:'Gianyar kota', koordinatEn:'Gianyar city' },
]

const KONDISI_COLOR: Record<string,string> = {
  LANCAR: 'text-green-600 bg-green-50', PADAT: 'text-amber-600 bg-amber-50', MACET: 'text-red-600 bg-red-50',
}

// Simulasi data kualitas udara
function useAirQuality() {
  const [data, setData] = useState([
    { lokasi:'Kota Gianyar', aqi:42, status:'BAIK', statusEn:'GOOD', pm25:12, pm10:28, suhu:28, kelembaban:74 },
    { lokasi:'Ubud', aqi:35, status:'BAIK', statusEn:'GOOD', pm25:9, pm10:21, suhu:26, kelembaban:80 },
    { lokasi:'Sukawati', aqi:58, status:'SEDANG', statusEn:'MODERATE', pm25:18, pm10:41, suhu:29, kelembaban:72 },
    { lokasi:'Tegallalang', aqi:28, status:'BAIK', statusEn:'GOOD', pm25:7, pm10:16, suhu:25, kelembaban:82 },
  ])
  const [lastUpdate, setLastUpdate] = useState(new Date())

  function refresh() {
    setData(prev => prev.map(d => ({
      ...d,
      aqi: Math.max(10, d.aqi + Math.floor((Math.random()-0.5)*8)),
      pm25: Math.max(5, d.pm25 + Math.floor((Math.random()-0.5)*3)),
      suhu: Math.max(22, d.suhu + (Math.random()-0.5)*0.5),
    })))
    setLastUpdate(new Date())
  }

  return { data, lastUpdate, refresh }
}

const AQI_COLOR: Record<string,string> = {
  BAIK:'text-green-600 bg-green-50 border-green-200',
  SEDANG:'text-amber-600 bg-amber-50 border-amber-200',
  TIDAK_SEHAT:'text-red-600 bg-red-50 border-red-200',
}
const AQI_BAR: Record<string,string> = {
  BAIK:'bg-green-500', SEDANG:'bg-amber-500', TIDAK_SEHAT:'bg-red-500',
}

export default function SmartCityPage() {
  const { t } = useLang()
  const { data: aq, lastUpdate, refresh } = useAirQuality()
  const [selectedCctv, setSelectedCctv] = useState<number|null>(null)
  const [tick, setTick] = useState(0)

  // Simulasi update real-time setiap 30 detik
  useEffect(() => {
    const timer = setInterval(() => setTick(v => v+1), 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center flex-shrink-0">
          <Activity size={24} className="text-cyan-700 dark:text-cyan-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t('Smart City Gianyar', 'Smart City Gianyar')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t('Monitoring CCTV publik & kualitas udara real-time', 'Public CCTV monitoring & real-time air quality')}</p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid sm:grid-cols-4 gap-3 my-6">
        {[
          { label: t('CCTV Online', 'CCTV Online'), value:`${CCTV.filter(c=>c.status==='ONLINE').length}/${CCTV.length}`, color:'green' },
          { label: t('Rata-rata AQI', 'Average AQI'), value:Math.round(aq.reduce((s,d)=>s+d.aqi,0)/aq.length), color:'blue' },
          { label: t('Sensor Aktif', 'Active Sensors'), value:'24', color:'cyan' },
          { label: t('Update Terakhir', 'Last Update'), value:lastUpdate.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}), color:'gray' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm text-center">
            <p className={`text-2xl font-black text-${s.color}-600`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CCTV Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Camera size={20} className="text-blue-700 dark:text-blue-400" /> {t('CCTV Lalu Lintas Publik', 'Public Traffic CCTV')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CCTV.map(c => (
            <button key={c.id} onClick={() => setSelectedCctv(selectedCctv===c.id ? null : c.id)}
              className={`bg-white dark:bg-slate-800 border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition text-left
                ${selectedCctv===c.id ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-100 dark:border-slate-700'}`}>
              {/* Thumbnail simulasi */}
              <div className={`h-32 flex items-center justify-center text-4xl relative
                ${c.status==='ONLINE' ? 'bg-gray-900' : 'bg-gray-700'}`}>
                {c.status==='ONLINE' ? (
                  <div className="text-center">
                    <div className="text-5xl mb-1">{c.thumbnail}</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${KONDISI_COLOR[c.kondisi] ?? 'text-gray-400 bg-gray-100'}`}>
                      {t(c.kondisi, c.kondisiEn)}
                    </span>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <WifiOff size={24} className="mx-auto mb-1" />
                    <p className="text-xs">OFFLINE</p>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {c.status==='ONLINE'
                    ? <span className="flex items-center gap-1 text-xs bg-green-900/70 text-green-300 px-2 py-0.5 rounded-full"><Wifi size={9}/> LIVE</span>
                    : <span className="flex items-center gap-1 text-xs bg-red-900/70 text-red-300 px-2 py-0.5 rounded-full"><WifiOff size={9}/> OFFLINE</span>
                  }
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 leading-snug">{c.lokasi}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{t(c.koordinat, c.koordinatEn)}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 text-center">
          {t('Streaming langsung tersedia di terminal CCTV Dinas Perhubungan', 'Live streaming available at Transportation Agency CCTV terminal')} · {tick > 0 ? `${t('Refresh ke-', 'Refresh #')}${tick}` : t('Data diperbarui otomatis setiap 30 detik', 'Data auto-updated every 30 seconds')}
        </p>
      </section>

      {/* Kualitas Udara */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
            <Wind size={20} className="text-cyan-600 dark:text-cyan-400" /> {t('Kualitas Udara Real-Time', 'Real-Time Air Quality')}
          </h2>
          <button onClick={refresh} className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-slate-600 px-3 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition">
            <RefreshCw size={13} /> {t('Refresh Data', 'Refresh Data')}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {aq.map(d => (
            <div key={d.lokasi} className={`border rounded-2xl p-5 ${AQI_COLOR[d.status] ?? 'bg-white border-gray-100'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{d.lokasi}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${AQI_COLOR[d.status]}`}>{t(d.status, d.statusEn)}</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-gray-800">{d.aqi}</p>
                  <p className="text-xs text-gray-500">AQI</p>
                </div>
              </div>
              {/* Bar */}
              <div className="h-2 bg-gray-200 rounded-full mb-3">
                <div className={`h-full rounded-full transition-all ${AQI_BAR[d.status]}`} style={{width:`${Math.min((d.aqi/200)*100, 100)}%`}} />
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label:'PM2.5', val:`${d.pm25} μg` },
                  { label:'PM10', val:`${d.pm10} μg` },
                  { label: t('Suhu', 'Temp'), val:`${d.suhu.toFixed(0)}°C` },
                  { label: t('Kelembaban', 'Humidity'), val:`${d.kelembaban}%` },
                ].map(m => (
                  <div key={m.label} className="bg-white/60 rounded-lg p-1.5">
                    <p className="text-xs font-bold text-gray-700">{m.val}</p>
                    <p className="text-xs text-gray-400">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl p-4">
          <p className="text-xs text-gray-600 dark:text-slate-300 mb-2 font-semibold">{t('Panduan AQI:', 'AQI Guide:')}</p>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              { range:'0–50', label: t('BAIK', 'GOOD'), color:'bg-green-500' },
              { range:'51–100', label: t('SEDANG', 'MODERATE'), color:'bg-amber-500' },
              { range:'101–150', label: t('TIDAK SEHAT', 'UNHEALTHY'), color:'bg-red-500' },
              { range:'>150', label: t('BERBAHAYA', 'HAZARDOUS'), color:'bg-purple-600' },
            ].map(g => (
              <span key={g.label} className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300">
                <span className={`w-3 h-3 rounded-sm ${g.color}`} /> {g.range}: {g.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-3 text-xs text-gray-500 dark:text-slate-400">
          <ThumbsUp size={14} className="text-green-500 flex-shrink-0" />
          {t('Sumber data: Sensor IoT Badan Lingkungan Hidup Gianyar · Diperbarui setiap 10 menit', 'Data source: IoT Sensors, Gianyar Environmental Agency · Updated every 10 minutes')}
        </div>
      </section>
    </div>
  )
}
