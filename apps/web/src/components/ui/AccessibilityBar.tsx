'use client'

import { useEffect, useState } from 'react'
import { ZoomIn, ZoomOut, Eye, RotateCcw } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

export function AccessibilityBar() {
  const { t } = useLang()
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.style.fontSize = `${fontSize}%`
    }, 80)
    return () => clearTimeout(timer)
  }, [fontSize])

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  const increase = () => setFontSize((f) => Math.min(f + 10, 140))
  const decrease = () => setFontSize((f) => Math.max(f - 10, 80))
  const reset = () => { setFontSize(100); setHighContrast(false) }

  return (
    <div
      className="bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 py-1 px-4"
      role="toolbar"
      aria-label={t('aksesibilitas.label')}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-end gap-1 text-xs text-gray-600 dark:text-slate-400">
        <span className="mr-2 hidden sm:inline">{t('aksesibilitas.label')}</span>

        <button
          onClick={decrease}
          aria-label={t('aksesibilitas.perkecil')}
          title={t('aksesibilitas.perkecil')}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ZoomOut size={14} aria-hidden="true" />
        </button>

        <span className="w-12 text-center tabular-nums" aria-live="polite"
          aria-label={t('aksesibilitas.ukuran_label').replace('{size}', String(fontSize))}>
          {fontSize}%
        </span>

        <button
          onClick={increase}
          aria-label={t('aksesibilitas.perbesar')}
          title={t('aksesibilitas.perbesar')}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ZoomIn size={14} aria-hidden="true" />
        </button>

        <div className="w-px h-4 bg-gray-300 mx-1" aria-hidden="true" />

        <button
          onClick={() => setHighContrast((v) => !v)}
          aria-pressed={highContrast}
          aria-label={highContrast ? t('aksesibilitas.nonaktifkan_kontras') : t('aksesibilitas.aktifkan_kontras')}
          title={t('aksesibilitas.kontras')}
          className={`flex items-center gap-1 px-2 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            highContrast ? 'bg-black text-white' : 'hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
        >
          <Eye size={14} aria-hidden="true" />
          <span className="hidden sm:inline">{t('aksesibilitas.kontras')}</span>
        </button>

        <button
          onClick={reset}
          aria-label={t('aksesibilitas.reset')}
          title={t('aksesibilitas.reset')}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RotateCcw size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
