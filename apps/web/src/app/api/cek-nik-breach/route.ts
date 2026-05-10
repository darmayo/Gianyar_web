import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

/**
 * NIK Breach Simulator API
 *
 * Model k-anonymity: client kirim 8 karakter pertama hash SHA-256 NIK.
 * Server kembalikan apakah ada match — NIK asli tidak pernah dikirim ke server.
 *
 * Database dummy untuk PoC/demonstrasi.
 * Di production: integrasikan dengan BSSN atau database internal terenkripsi.
 */

// SHA-256 dari beberapa NIK dummy (format: 16 digit, hanya untuk demo)
// NIK dummy: 5104010101010001, 5104010101010002, dll
// Prefix 8 char pertama dari hash masing-masing NIK dummy
function sha256(str: string) {
  return createHash('sha256').update(str).digest('hex')
}

// Database NIK yang pernah terdampak (format: full hash, hanya 8 char pertama dikirim client)
const BREACHED_NIK_HASHES = new Set([
  sha256('5104010101010001'), // NIK demo 1
  sha256('5104010101010002'), // NIK demo 2
  sha256('3171010101010003'), // NIK demo 3 (Jakarta)
  sha256('3578010101010004'), // NIK demo 4 (Surabaya)
  sha256('5104020202020005'), // NIK demo 5
])

// Insiden kebocoran data dummy untuk UI
const INSIDEN = [
  { nama: 'Kebocoran Database Layanan X', tanggal: '2024-03', dampak: '~12.000 NIK', sumber: 'Internal audit' },
  { nama: 'Ekspos API Tidak Terautentikasi', tanggal: '2023-11', dampak: '~3.500 NIK', sumber: 'White-hat researcher' },
]

export async function POST(req: NextRequest) {
  try {
    const { prefix } = await req.json() as { prefix: string }

    // Validasi prefix (8 char hex)
    if (!prefix || typeof prefix !== 'string' || !/^[0-9a-f]{8}$/i.test(prefix)) {
      return NextResponse.json({ error: 'Format prefix tidak valid' }, { status: 400 })
    }

    // Cari match — bandingkan prefix dengan 8 char pertama tiap hash
    const matches: string[] = []
    for (const hash of BREACHED_NIK_HASHES) {
      if (hash.startsWith(prefix.toLowerCase())) {
        // Kirim suffix (sisanya) — client yang rekonstruksi & bandingkan
        matches.push(hash.slice(8))
      }
    }

    return NextResponse.json({
      found: matches.length > 0,
      matches,
      insiden: matches.length > 0 ? INSIDEN : [],
      disclaimer: 'Data ini hanya untuk demonstrasi PoC. Di production, gunakan database terenkripsi resmi.',
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'NIK Breach Check API — gunakan POST dengan body { prefix: "8hexchars" }',
    model: 'k-anonymity (NIK tidak pernah dikirim ke server)',
  })
}
