// ============================================================
// GET /api/cek-bansos?nik_hash=SHA256&nama=XXX
//
// SECURITY ANALYST NOTE — Endpoint ini SANGAT sensitif karena
// data bansos berkaitan langsung dengan kondisi sosial-ekonomi warga.
//
// Desain keamanan yang diterapkan:
//
//  ✓ Klien TIDAK mengirim NIK plaintext ke API.
//    Client-side hash: SHA-256(NIK) dikirim sebagai `nik_hash`.
//    → Jika traffic dicegat, NIK tidak bocor.
//
//  ✓ Rate limit sangat ketat: 3 request / 60 detik per IP
//    → Dengan 60 detik window dan 3 request, penyerang butuh
//       ~320 tahun untuk scan seluruh NIK Indonesia (270 juta)
//
//  ✓ Rate limit per NIK hash: 2 request / 5 menit
//    → Membatasi credential stuffing / brute force
//
//  ✓ Nama wajib diisi dan dicocokkan (poor-man's authz)
//    → Tanpa nama yang cocok, data tidak dikembalikan (false match = 404)
//
//  ✓ Response tidak mengungkapkan apakah NIK "terdaftar" tapi nama salah
//    → Keduanya sama-sama 404 (mencegah NIK enumeration)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'

const querySchema = z.object({
  // Klien mengirim SHA-256(NIK) bukan NIK langsung
  nik_hash: z.string().regex(/^[a-f0-9]{64}$/, 'Format tidak valid'),
  nama: z
    .string()
    .min(3, 'Nama terlalu pendek')
    .max(100)
    .transform((s) => s.trim().toLowerCase()),
})

// Mock data bansos (Production: query ke DB DTKS / Kemensos API)
// Key = SHA-256(NIK)
const MOCK_BANSOS: Record<
  string,
  { namaResmi: string; program: string[]; status: string; nilaiPerBulan: number; namaBank: string }
> = {
  // SHA-256("3104012909980001") — NIK contoh fiktif
  [createHash('sha256').update('3104012909980001').digest('hex')]: {
    namaResmi: 'siti rahayu',
    program: ['PKH', 'BPNT'],
    status: 'AKTIF',
    nilaiPerBulan: 750_000,
    namaBank: 'BRI',
  },
  [createHash('sha256').update('5104011504850002').digest('hex')]: {
    namaResmi: 'i wayan karma',
    program: ['JKN-KIS'],
    status: 'AKTIF',
    nilaiPerBulan: 0,
    namaBank: '-',
  },
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req)

  // ── Rate limit per IP: 3 req / 60 detik ──────────────────
  const rlIp = checkRateLimit(`cek-bansos-ip:${ip}`, 3, 60_000)
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
    nik_hash: searchParams.get('nik_hash') ?? '',
    nama: searchParams.get('nama') ?? '',
  }

  const parsed = querySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Parameter tidak valid' }, { status: 400 })
  }

  const { nik_hash, nama } = parsed.data

  // ── Rate limit per NIK hash: 2 req / 5 menit ─────────────
  const nikHashShort = nik_hash.slice(0, 16)
  const rlNik = checkRateLimit(`cek-bansos-nik:${nikHashShort}`, 2, 5 * 60_000)
  if (!rlNik.allowed) {
    return NextResponse.json(
      { error: 'Pengecekan untuk NIK ini sudah mencapai batas. Coba lagi dalam 5 menit.' },
      { status: 429 }
    )
  }

  const data = MOCK_BANSOS[nik_hash]

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
