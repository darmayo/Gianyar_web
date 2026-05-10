/**
 * apply-patches.mjs
 *
 * Dijalankan via postinstall — patch node_modules/next untuk
 * menyembunyikan versi dari window.next.version (dibaca Wappalyzer).
 *
 * Berlaku di DEV mode (Turbopack) maupun production.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..', '..', '..') // monorepo root
const NEXT_CLIENT = join(ROOT, 'node_modules', 'next', 'dist', 'client')
const LEAFLET_DIST = join(ROOT, 'node_modules', 'leaflet', 'dist')

const PATCHES = [
  {
    file: join(NEXT_CLIENT, 'app-bootstrap.js'),
    from: /const version = "[\d]+\.[\d]+\.[\d]+";/g,
    to: 'const version = "";',
    description: 'app-bootstrap.js — window.next.version (Turbopack/dev)',
  },
  {
    file: join(NEXT_CLIENT, 'index.js'),
    from: /const version = "[\d]+\.[\d]+\.[\d]+";(\s*let router;)/g,
    to: 'const version = "";$1',
    description: 'index.js — version export (pages router)',
  },

  // ── Leaflet version fingerprinting ────────────────────────────
  // Wappalyzer mendeteksi Leaflet via string "1.9.4" di bundle JS.
  // Hapus dari semua distribusi agar versi tidak bocor.
  {
    file: join(LEAFLET_DIST, 'leaflet-src.esm.js'),
    from: /var version = "[\d]+\.[\d]+\.[\d]+";/g,
    to: 'var version = "";',
    description: 'leaflet-src.esm.js — L.version (ESM bundle)',
  },
  {
    file: join(LEAFLET_DIST, 'leaflet-src.js'),
    from: /var version = "[\d]+\.[\d]+\.[\d]+";/g,
    to: 'var version = "";',
    description: 'leaflet-src.js — var version (UMD bundle)',
  },
  {
    file: join(LEAFLET_DIST, 'leaflet.js'),
    from: /t\.version="[\d]+\.[\d]+\.[\d]+"/g,
    to: 't.version=""',
    description: 'leaflet.js — t.version (minified bundle)',
  },
]

console.log('\n🔒 Applying Next.js anti-fingerprint patches...\n')

let success = 0
let skipped = 0

for (const patch of PATCHES) {
  if (!existsSync(patch.file)) {
    console.log(`  ⚠️  Tidak ditemukan: ${patch.description}`)
    skipped++
    continue
  }

  let content = readFileSync(patch.file, 'utf8')

  // Cek apakah sudah di-patch (versi sudah "")
  if (content.includes('const version = "";') || content.includes('var version = "";') || content.includes('t.version=""')) {
    console.log(`  ✓  Sudah di-patch: ${patch.description}`)
    success++
    continue
  }

  const patched = content.replace(patch.from, patch.to)

  if (patched === content) {
    console.log(`  ⚠️  Pattern tidak cocok: ${patch.description}`)
    skipped++
    continue
  }

  writeFileSync(patch.file, patched, 'utf8')
  console.log(`  ✅ Berhasil: ${patch.description}`)
  success++
}

console.log(`\n── Hasil: ${success} patch diterapkan, ${skipped} dilewati ──\n`)
