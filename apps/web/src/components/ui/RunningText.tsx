'use client'
import { useLang } from '@/contexts/LanguageContext'

export function RunningText() {
  const { tArr, t } = useLang()

  // Ambil array ticker dari kamus terjemahan
  const TICKERS = tArr('running_text.tickers')
  const text = TICKERS.join('   •••   ')

  return (
    <div
      className="ticker-wrapper bg-yellow-400 text-blue-900 text-xs py-1.5 overflow-hidden cursor-default"
      aria-label={t('running_text.pengumuman')}
      role="status"
      aria-live="polite"
    >
      <div className="ticker-content flex animate-[ticker_35s_linear_infinite] whitespace-nowrap">
        <span className="px-4" aria-hidden="true">{text}</span>
        <span className="px-4" aria-hidden="true">{text}</span>
      </div>
      {/* Teks untuk screen reader — tidak ikut animasi */}
      <span className="sr-only">{text}</span>
    </div>
  )
}
