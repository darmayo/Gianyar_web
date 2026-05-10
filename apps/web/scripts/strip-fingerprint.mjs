/**
 * strip-fingerprint.mjs
 *
 * Dijalankan SETELAH `next build` untuk menghapus string versi Next.js
 * dari compiled JS bundle di .next/static/
 *
 * Cara kerja Wappalyzer mendeteksi versi:
 *   1. Regex: `"next":"16.2.2"` di dalam JS chunk (TARGET UTAMA)
 *   2. Regex: `next@16.2.2` di dalam JS bundle
 *   3. Pattern: `/_next/` di URL (diatasi via Nginx rewrite)
 *   4. `__NEXT_DATA__` di HTML (tidak bisa dihapus tanpa breaking app)
 *
 * Script ini mengatasi poin 1 & 2.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join, extname, relative } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const NEXT_STATIC = join(ROOT, '.next', 'static')
const NEXT_SERVER = join(ROOT, '.next', 'server')

// ── Replacement patterns ────────────────────────────────────────────
// Setiap pattern: { regex, replacement }
// Diurutkan dari paling spesifik ke paling umum
const PATTERNS = [
  // ── TARGET UTAMA: window.next={version:"16.2.2"} ──────────────
  // Ini yang dibaca Wappalyzer untuk mendeteksi versi Next.js
  // Diinject Next.js ke setiap halaman via chunk JS client
  { regex: /window\.next\s*=\s*\{version:"[\d]+\.[\d]+\.[\d]+"/g,
            replacement: 'window.next={version:"0.0.0"' },
  { regex: /window\.next\s*=\s*\{version:'[\d]+\.[\d]+\.[\d]+'/g,
            replacement: "window.next={version:'0.0.0'" },

  // ── Pattern versi di JSON embedded ────────────────────────────
  { regex: /"version":"[\d]+\.[\d]+\.[\d]+"/g,      replacement: '"version":"0.0.0"' },
  { regex: /"next":"[\d]+\.[\d]+\.[\d]+"/g,         replacement: '"next":"0.0.0"' },
  { regex: /"nextVersion":"[\d]+\.[\d]+\.[\d]+"/g,  replacement: '"nextVersion":"0.0.0"' },

  // ── Pattern string literal ─────────────────────────────────────
  { regex: /next@[\d]+\.[\d]+\.[\d]+/g,             replacement: 'next@0.0.0' },
  { regex: /Next\.js\s+[\d]+\.[\d]+\.[\d]+/g,       replacement: 'Next.js' },
  { regex: /next\/[\d]+\.[\d]+\.[\d]+/g,            replacement: 'next/0.0.0' },

  // ── X-Powered-By di runtime bundle ────────────────────────────
  { regex: /X-Powered-By:\s*Next\.js/gi,            replacement: 'X-Powered-By: Webserver' },
]

// ── File walker ─────────────────────────────────────────────────────
function walkDir(dir, callback) {
  let files
  try { files = readdirSync(dir) } catch { return }
  for (const file of files) {
    const fullPath = join(dir, file)
    try {
      const stat = statSync(fullPath)
      if (stat.isDirectory()) walkDir(fullPath, callback)
      else callback(fullPath)
    } catch { /* skip unreadable */ }
  }
}

// ── Main ─────────────────────────────────────────────────────────────
let totalFiles = 0
let modifiedFiles = 0
let replacements = 0

function processDir(dir, label) {
  walkDir(dir, (filePath) => {
    const ext = extname(filePath)
    if (ext !== '.js' && ext !== '.json') return

    let content
    try { content = readFileSync(filePath, 'utf8') } catch { return }

    totalFiles++
    let newContent = content
    let changed = false

    for (const { regex, replacement } of PATTERNS) {
      const before = newContent
      newContent = newContent.replace(regex, () => {
        replacements++
        changed = true
        return replacement
      })
      // Reset lastIndex for global regexes (safety)
      regex.lastIndex = 0
    }

    if (changed) {
      try {
        writeFileSync(filePath, newContent, 'utf8')
        modifiedFiles++
        console.log(`  ✓ ${relative(ROOT, filePath)}`)
      } catch (e) {
        console.error(`  ✗ Failed to write ${filePath}: ${e.message}`)
      }
    }
  })
}

console.log('\n🔒 Strip Fingerprint — Memulai penghapusan versi dari bundle...\n')

processDir(NEXT_STATIC, 'static')
processDir(NEXT_SERVER, 'server')

console.log(`\n──────────────────────────────────────────`)
console.log(`📁 Total file diperiksa : ${totalFiles}`)
console.log(`✏️  File dimodifikasi    : ${modifiedFiles}`)
console.log(`🔄 Total penggantian    : ${replacements}`)

if (modifiedFiles === 0) {
  console.log('\n⚠️  Tidak ada string versi ditemukan.')
  console.log('   Kemungkinan sudah bersih atau pola bundle berubah.')
} else {
  console.log('\n✅ Selesai! Versi Next.js berhasil disembunyikan dari bundle.')
  console.log('   Catatan: /_next/ path masih bisa dideteksi — gunakan Nginx')
  console.log('   rewrite ke /_s/ untuk menyembunyikan path signature.')
}

console.log('──────────────────────────────────────────\n')
