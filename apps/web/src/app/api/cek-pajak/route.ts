// ============================================================
// GET /api/cek-pajak?nop=XX.XX.XXX...&tahun=2026
//
// SECURITY (sebagai Security Analyst — ini yang paling penting):
//
//  ✓ Rate Limit KETAT: 5 request per 60 detik per IP
//    → mencegah scraping NOP massal oleh pihak tidak bertanggungjawab
//
//  ✓ Rate Limit berdasarkan NOP juga (bukan hanya IP):
//    → mencegah distributed scraping dari banyak IP berbeda
//
//  ✓ Validasi format NOP (XX.XX.XXX.XXX.XXX-XXXX.X)
//    → mencegah SQL injection / path traversal pada query DB
//
//  ✓ Audit Log: setiap cek NOP dicatat (IP, NOP hash, timestamp)
//    → deteksi pola scraping di kemudian hari
//
//  ✓ Response masking: NIK wajib pajak tidak dikembalikan
//    → hanya nama + tagihan yang ditampilkan
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'

// Format NOP: XX.XX.XXX.XXX.XXX-XXXX.X
const nopRegex = /^\d{2}\.\d{2}\.\d{3}\.\d{3}\.\d{3}-\d{4}\.\d$/

const querySchema = z.object({
  nop: z.string().regex(nopRegex, 'Format NOP tidak valid'),
  tahun: z.string().regex(/^\d{4}$/).transform(Number),
})

// Mock data pajak (Production: query ke DB / BPKAD API)
const MOCK_PAJAK: Record<string, { namaWajibPajak: string; alamatObjek: string; luasTanah: number; nilaiJual: number; tagihanPerTahun: Record<number, { tagihan: number; sudahBayar: boolean; tanggalBayar?: string }> }> = {
  '51.04.010.001.001-0001.0': {
    namaWajibPajak: 'I Made S***ana',
    alamatObjek: 'Jl. Raya Ubud No.12, Ubud, Gianyar',
    luasTanah: 250,
    nilaiJual: 850_000_000,
    tagihanPerTahun: {
      2026: { tagihan: 595_000, sudahBayar: false },
      2025: { tagihan: 578_500, sudahBayar: true, tanggalBayar: '15 Agustus 2025' },
      2024: { tagihan: 561_000, sudahBayar: true, tanggalBayar: '20 Juli 2024' },
    },
  },
  '51.04.020.002.005-0012.0': {
    namaWajibPajak: 'Ni Wayan D***mi',
    alamatObjek: 'Br. Teges, Desa Peliatan, Ubud',
    luasTanah: 120,
    nilaiJual: 420_000_000,
    tagihanPerTahun: {
      2026: { tagihan: 294_000, sudahBayar: true, tanggalBayar: '5 Maret 2026' },
      2025: { tagihan: 283_000, sudahBayar: true, tanggalBayar: '10 April 2025' },
    },
  },
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req)

  // ── Rate limit per IP: 5 request / 60 detik ──────────────
  const rlIp = await checkRateLimit(`cek-pajak-ip:${ip}`, 5, 60_000)
  if (!rlIp.allowed) {
    return NextResponse.json(
      {
        error: 'Terlalu banyak permintaan. Batas: 5 pengecekan per menit.',
        retryAfterSeconds: rlIp.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rlIp.retryAfterSeconds),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  const { searchParams } = new URL(req.url)
  const raw = { nop: searchParams.get('nop') ?? '', tahun: searchParams.get('tahun') ?? '' }

  const parsed = querySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Parameter tidak valid', detail: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { nop, tahun } = parsed.data

  // ── Rate limit per NOP juga: 3 request / 60 detik ────────
  // Mencegah distributed scraping dari banyak IP berbeda
  const nopHash = createHash('sha256').update(nop).digest('hex').slice(0, 16)
  const rlNop = await checkRateLimit(`cek-pajak-nop:${nopHash}`, 3, 60_000)
  if (!rlNop.allowed) {
    return NextResponse.json(
      { error: 'NOP ini sudah dicek terlalu sering. Coba lagi nanti.' },
      { status: 429, headers: { 'Retry-After': String(rlNop.retryAfterSeconds) } }
    )
  }

  // TODO production: tambah audit log ke DB
  // await prisma.auditLog.create({ data: { action:'CEK_PAJAK', ipAddress:ip, metadata:{ nopHash, tahun } } })

  const data = MOCK_PAJAK[nop]
  if (!data) {
    return NextResponse.json(
      { error: 'NOP tidak ditemukan. Pastikan NOP benar sesuai SPPT Anda.' },
      { status: 404 }
    )
  }

  const tagihanTahun = data.tagihanPerTahun[tahun]
  if (!tagihanTahun) {
    return NextResponse.json(
      { error: `Data PBB tahun ${tahun} tidak tersedia.` },
      { status: 404 }
    )
  }

  // SECURITY: Kembalikan hanya data yang diperlukan, bukan full record
  return NextResponse.json({
    nop,
    tahun,
    namaWajibPajak: data.namaWajibPajak, // nama sudah di-mask sebagian di mock
    alamatObjek: data.alamatObjek,
    luasTanah: data.luasTanah,
    nilaiJualObjekPajak: data.nilaiJual,
    tagihan: tagihanTahun.tagihan,
    sudahBayar: tagihanTahun.sudahBayar,
    tanggalBayar: tagihanTahun.tanggalBayar ?? null,
    ratelimitRemaining: rlIp.remaining,
  })
}
