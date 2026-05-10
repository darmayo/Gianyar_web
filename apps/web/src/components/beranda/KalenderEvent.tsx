'use client'
import { Calendar, MapPin } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

// Kategori internal key → warna Tailwind (tidak diterjemahkan — hanya untuk styling)
const WARNA: Record<string, string> = {
  Budaya:   'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  Spiritual:'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  Ekonomi:  'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  Festival: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  Publik:   'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
}

// Definisi event menggunakan kunci kamus agar bisa diterjemahkan
const EVENT_DEFS = [
  { id: 'kecak',    date: new Date('2026-04-05'), nKey: 'event_kecak',     lKey: 'event_kecak_lokasi',     kategori: 'Budaya'   },
  { id: 'odalan',   date: new Date('2026-04-10'), nKey: 'event_odalan',    lKey: 'event_odalan_lokasi',    kategori: 'Spiritual'},
  { id: 'pasar',    date: new Date('2026-04-15'), nKey: 'event_pasar',     lKey: 'event_pasar_lokasi',     kategori: 'Ekonomi'  },
  { id: 'festival', date: new Date('2026-04-25'), nKey: 'event_festival',  lKey: 'event_festival_lokasi',  kategori: 'Festival' },
  { id: 'buruh',    date: new Date('2026-05-01'), nKey: 'event_buruh',     lKey: 'event_buruh_lokasi',     kategori: 'Publik'   },
  { id: 'bali_art', date: new Date('2026-05-05'), nKey: 'event_bali_art',  lKey: 'event_bali_art_lokasi',  kategori: 'Festival' },
]

export function KalenderEvent() {
  const { t, tArr } = useLang()
  const bulan = tArr('kalender.bulan') as string[]

  const events = EVENT_DEFS.map(e => ({
    ...e,
    nama:   t(`kalender.${e.nKey}`),
    lokasi: t(`kalender.${e.lKey}`),
    // Label kategori diterjemahkan (Budaya → Culture, dst)
    kategoriLabel: t(`kalender.${e.kategori.toLowerCase()}`),
  }))

  return (
    <section aria-labelledby="kalender-heading" className="py-14 px-4 bg-amber-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 justify-center mb-2">
          <Calendar size={24} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <h2 id="kalender-heading" className="text-2xl font-bold text-gray-800 dark:text-slate-100">
            {t('kalender.title')}
          </h2>
        </div>
        <p className="text-center text-gray-500 dark:text-slate-400 mb-8">
          {t('kalender.subtitle')}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => {
            const tanggal = ev.date.getDate()
            const bulanLabel = bulan[ev.date.getMonth()] ?? ''
            return (
              <article
                key={ev.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-amber-100 dark:border-slate-700 flex gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Badge tanggal */}
                <div
                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl flex flex-col items-center justify-center shadow-md"
                  aria-label={`${tanggal} ${bulanLabel}`}
                >
                  <span className="text-xs font-semibold leading-none uppercase">{bulanLabel}</span>
                  <span className="text-2xl font-bold leading-tight">{tanggal}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${WARNA[ev.kategori] ?? 'bg-gray-100 text-gray-700'}`}>
                    {ev.kategoriLabel}
                  </span>
                  <h3 className="font-semibold text-gray-800 dark:text-slate-100 mt-1.5 text-sm leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {ev.nama}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 mt-1">
                    <MapPin size={10} aria-hidden="true" className="flex-shrink-0" />
                    {ev.lokasi}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
