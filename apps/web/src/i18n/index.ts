// ============================================================
// i18n Engine — Sistem Terjemahan Terpusat
//
// Cara pakai:
//
//   // 1. Di Server Component atau file biasa:
//   import { getT } from '@/i18n'
//   const t = getT('id') // atau 'en'
//   t('hero.judul')       // → 'Layanan Publik'
//
//   // 2. Di Client Component (dengan hook):
//   import { useT } from '@/i18n'
//   const t = useT()
//   t('hero.judul')       // → otomatis pakai bahasa aktif
//
//   // 3. Backward compatible dengan pola lama t(id, en):
//   import { useLang } from '@/contexts/LanguageContext'
//   const { t } = useLang()  // masih bisa dipakai
//
// Menambah teks baru:
//   1. Tambah key di src/i18n/locales/id.ts
//   2. Tambah key yang sama di src/i18n/locales/en.ts
//   3. Pakai dengan t('namespace.key')
// ============================================================

import { id } from './locales/id'
import { en } from './locales/en'

export type Lang = 'id' | 'en'
export type Translations = typeof id

// Flatten nested object ke dotted key: { 'hero.judul': 'Layanan Publik', ... }
type DotPath<T, Prefix extends string = ''> = T extends string | readonly string[]
  ? Prefix
  : T extends object
  ? {
      [K in keyof T]: DotPath<T[K], Prefix extends '' ? `${string & K}` : `${Prefix}.${string & K}`>
    }[keyof T]
  : never

export type TranslationKey = DotPath<Translations>

// Resolve dotted path ke value di object
function resolve(obj: Record<string, unknown>, path: string): string | string[] | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  if (typeof current === 'string') return current
  if (Array.isArray(current) && current.every(x => typeof x === 'string')) return current as string[]
  return undefined
}

const DICTS: Record<Lang, Record<string, unknown>> = {
  id: id as unknown as Record<string, unknown>,
  en: en as unknown as Record<string, unknown>,
}

/**
 * getT — Buat fungsi translator untuk bahasa tertentu.
 * Cocok untuk Server Components dan utility functions.
 *
 * @example
 * const t = getT('id')
 * t('hero.judul')       // 'Layanan Publik'
 * t('kalender.bulan.3') // 'Apr'
 */
export function getT(lang: Lang) {
  return function t(key: string, fallback?: string): string {
    const val = resolve(DICTS[lang], key)
    if (typeof val === 'string') return val
    // Jika tidak ditemukan: coba bahasa default (id), lalu fallback
    if (lang !== 'id') {
      const idVal = resolve(DICTS.id, key)
      if (typeof idVal === 'string') return idVal
    }
    if (fallback) return fallback
    // Kembalikan key sebagai fallback terakhir (memudahkan debug)
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Key tidak ditemukan: "${key}" (lang: ${lang})`)
    }
    return key
  }
}

/**
 * getTArray — Ambil array string dari kamus.
 *
 * @example
 * const t = getTArray('id')
 * t('running_text.tickers') // string[]
 */
export function getTArray(lang: Lang) {
  return function tArr(key: string): string[] {
    const val = resolve(DICTS[lang], key)
    if (Array.isArray(val)) return val
    const idVal = resolve(DICTS.id, key)
    if (Array.isArray(idVal)) return idVal
    return []
  }
}

/**
 * getTranslations — Ambil semua kamus untuk satu bahasa.
 * Berguna jika perlu akses langsung ke objek terjemahan.
 */
export function getTranslations(lang: Lang): Translations {
  return (lang === 'en' ? en : id) as unknown as Translations
}

// Re-export kamus mentah untuk keperluan khusus
export { id as idTranslations, en as enTranslations }
