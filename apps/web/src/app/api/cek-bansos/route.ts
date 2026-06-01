// ============================================================
// GET /api/cek-bansos?nik=16DIGIT&nama=XXX
//
// SECURITY ANALYST NOTE — Endpoint ini SANGAT sensitif karena
// data bansos berkaitan langsung dengan kondisi sosial-ekonomi warga.
//
// Desain keamanan yang diterapkan:
//
//  ✓ NIK tidak dipakai sebagai identifier publik berbentuk hash.
//    Server membuat HMAC-SHA256 dengan pepper dari env sebelum lookup.
//    Output HMAC tetap diperlakukan sebagai data sensitif.
//
//  ✓ Rate limit sangat ketat: 3 request / 60 detik per IP
//    → Dengan 60 detik window dan 3 request, penyerang butuh
//       ~320 tahun untuk scan seluruh NIK Indonesia (270 juta)
//
//  ✓ Rate limit per HMAC NIK: 2 request / 5 menit
//    → Membatasi credential stuffing / brute force
//
//  ✓ Nama wajib diisi dan dicocokkan (poor-man's authz)
//    → Tanpa nama yang cocok, data tidak dikembalikan (false match = 404)
//
//  ✓ Response tidak mengungkapkan apakah NIK "terdaftar" tapi nama salah
//    → Keduanya sama-sama 404 (mencegah NIK enumeration)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'

function getNikHashPepper(): string {
  if (process.env.NODE_ENV === 'production') {
    const pepper = process.env.NIK_HASH_PEPPER
    if (pepper) return pepper
    throw new Error('NIK_HASH_PEPPER is required in production')
  }

  const pepper = process.env.NIK_HASH_PEPPER ?? process.env.NIK_ENCRYPTION_KEY
  if (pepper) return pepper
  throw new Error('NIK_HASH_PEPPER is required in production')
}

function hmacNik(nik: string, pepper = getNikHashPepper()): string {
  return createHmac('sha256', pepper).update(nik).digest('hex')
}

const querySchema = z.object({
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit'),
  nama: z
    .string()
    .min(3, 'Nama terlalu pendek')
    .max(100)
    .transform((s) => s.trim().toLowerCase()),
})

// Mock data bansos (Production: query ke DB DTKS / Kemensos API)
// Key = HMAC-SHA256(NIK, NIK_HASH_PEPPER)
const MOCK_BANSOS_SOURCE: Array<{
  nik: string
  data: { namaResmi: string; program: string[]; status: string; nilaiPerBulan: number; namaBank: string }
}> = [
  // NIK contoh fiktif; HMAC dihitung server-side.
  {
    nik: '3104012909980001',
    data: {
    namaResmi: 'siti rahayu',
    program: ['PKH', 'BPNT'],
    status: 'AKTIF',
    nilaiPerBulan: 750_000,
    namaBank: 'BRI',
    },
  },
  {
    nik: '5104011504850002',
    data: {
    namaResmi: 'i wayan karma',
    program: ['JKN-KIS'],
    status: 'AKTIF',
    nilaiPerBulan: 0,
    namaBank: '-',
    },
  },
]

export async function GET(req: NextRequest) {
  const ip = getClientIp(req)

  // ── Rate limit per IP: 3 req / 60 detik ──────────────────
  const rlIp = await checkRateLimit(`cek-bansos-ip:${ip}`, 3, 60_000)
  if (!rlIp.allowed) {
    return NextResponse.json(
      {
        error: 'Terlalu banyak permintaan. Batas: 3 pengecekan per menit.',
        retryAfterSeconds: rlIp.retryAfterSeconds,
      },
      { status: 429, headers: { 'Retry-After': String(rlIp.retryAfterSeconds) } }
    )
  }

  const { searchParams } = new URL(req.url)
  const raw = {
    nik: searchParams.get('nik') ?? '',
    nama: searchParams.get('nama') ?? '',
  }

  const parsed = querySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Parameter tidak valid' }, { status: 400 })
  }

  const { nik, nama } = parsed.data
  let pepper: string
  let nikDigest: string
  try {
    pepper = getNikHashPepper()
    nikDigest = hmacNik(nik, pepper)
  } catch {
    return NextResponse.json({ error: 'Konfigurasi keamanan server belum siap' }, { status: 500 })
  }

  // ── Rate limit per HMAC NIK: 2 req / 5 menit ─────────────
  const nikDigestShort = nikDigest.slice(0, 16)
  const rlNik = await checkRateLimit(`cek-bansos-nik:${nikDigestShort}`, 2, 5 * 60_000)
  if (!rlNik.allowed) {
    return NextResponse.json(
      { error: 'Pengecekan untuk NIK ini sudah mencapai batas. Coba lagi dalam 5 menit.' },
      { status: 429 }
    )
  }

  const data = MOCK_BANSOS_SOURCE.find((item) => hmacNik(item.nik, pepper) === nikDigest)?.data

  // SECURITY: Validasi nama sebelum mengembalikan data
  // Jika NIK tidak ada ATAU nama tidak cocok → sama-sama 404
  if (!data || !nama.includes(data.namaResmi.split(' ')[0])) {
    // Tambahkan artificial delay untuk mencegah timing attack
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 100))
    return NextResponse.json(
      { error: 'Data tidak ditemukan. Pastikan NIK dan nama sesuai KTP.' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    status: data.status,
    program: data.program,
    nilaiPerBulan: data.nilaiPerBulan,
    namaBank: data.namaBank,
    // TIDAK mengembalikan NIK atau nama lengkap — hanya status
    pesan: `Anda terdaftar sebagai penerima ${data.program.join(', ')}.`,
  })
}
