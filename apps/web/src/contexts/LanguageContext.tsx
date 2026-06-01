'use client'
// ============================================================
// LanguageContext — Provider bahasa untuk Client Components
//
// Fitur:
//  - t(key)          → terjemahan berdasarkan key (baru, direkomendasikan)
//  - t(id, en)       → terjemahan inline (lama, backward-compatible)
//  - tArr(key)       → ambil array string dari kamus
//  - lang            → 'id' | 'en'
//  - setLang(l)      → ganti bahasa + simpan ke localStorage
//
// Cara pakai di Client Component:
//   import { useLang } from '@/contexts/LanguageContext'
//   const { t, tArr, lang } = useLang()
//   t('hero.judul')           // → 'Layanan Publik'
//   t('Teks lama', 'Old text') // → backward-compatible
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getT, getTArray, type Lang } from '@/i18n'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** Terjemahan berdasarkan key (baru) ATAU inline id/en (lama) */
  t: (keyOrId: string, en?: string) => string
  /** Ambil array string dari kamus */
  tArr: (key: string) => string[]
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'id',
  setLang: () => {},
  t: (k) => k,
  tArr: () => [],
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id')

  // Baca preferensi bahasa dari localStorage setelah mount (SSR-safe)
  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved === 'id' || saved === 'en') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(saved)
    }
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Buat translator yang cache per perubahan lang
  const translator = useCallback((key: string, fallback?: string) => getT(lang)(key, fallback), [lang])
  const arrayTranslator = useCallback((key: string) => getTArray(lang)(key), [lang])

  /**
   * t(key)           → cari di kamus i18n berdasarkan dotted key
   * t('id', 'en')    → backward-compatible inline mode
   *
   * Cara membedakan: jika ada argumen `en` dan keyOrId tidak mengandung
   * titik, berarti mode inline (lama). Jika ada titik → mode key baru.
   */
  const t = useCallback((keyOrId: string, en?: string): string => {
    // Mode key (baru): ada titik atau tidak ada argumen en
    if (!en || keyOrId.includes('.')) {
      return translator(keyOrId, en)
    }
    // Mode inline (lama): t('Teks ID', 'English text')
    return lang === 'id' ? keyOrId : en
  }, [lang, translator])

  const tArr = useCallback((key: string): string[] => {
    return arrayTranslator(key)
  }, [arrayTranslator])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tArr }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}

/** Hook shorthand — cukup import useT untuk dapat fungsi t() */
export function useT() {
  const { t, tArr, lang } = useContext(LanguageContext)
  return { t, tArr, lang }
}
