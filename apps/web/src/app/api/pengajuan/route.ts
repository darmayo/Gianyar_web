// ============================================================
// POST /api/pengajuan — Terima submission DynamicForm
// GET  /api/pengajuan?tiket=XXX — Cek status tiket
//
// SECURITY CHECKLIST:
//  ✓ Zod validation semua input
//  ✓ NIK di-hash SHA-256 sebelum disimpan (plaintext tidak disimpan)
//  ✓ maskFormData() dipanggil sebelum response ke klien
//  ✓ Rate limit: 10 req/menit per IP (anti-spam)
//  ✓ IDOR: cek nomorTiket exact-match saja (tidak ada enumerable ID)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'
import { maskFormData } from '@/lib/field-mask'

// ── Validasi Input ───────────────────────────────────────────

const submitSchema = z.object({
  jenisLayanan: z.string().min(2).max(50).regex(/^[A-Z_]+$/, 'Format tidak valid'),
  namaSubmitter: z.string().min(2).max(100).transform(s => s.trim()),
  kontakSubmitter: z.string().min(5).max(100).transform(s => s.trim()),
  dataFormulir: z.record(z.unknown()).refine(
    (obj) => Object.keys(obj).length <= 30,
    'Terlalu banyak field'
  ),
})

const cekTiketSchema = z.object({
  tiket: z.string().regex(
    /^[A-Z]{2,10}-\d{4}-\d{6}$/,
    'Format tiket tidak valid (contoh: KTP-2026-123456)'
  ),
})

// ── Ticket Generator ─────────────────────────────────────────

const PREFIX_MAP: Record<string, string> = {
  KTP: 'KTP',
  KK: 'KK',
  AKTA_LAHIR: 'AKT',
  PINDAH_DOMISILI: 'PDH',
  PERIZINAN: 'IZN',
  BANSOS: 'BNS',
  PAJAK_PBB: 'PJK',
  SURAT_KERJA: 'SRT',
  PENGADUAN: 'ADU',
}

function generateNomorTiket(jenisLayanan: string): string {
  const prefix = PREFIX_MAP[jenisLayanan] ?? jenisLayanan.slice(0, 3).toUpperCase()
  const year = new Date().getFullYear()
  const seq = Math.floor(100000 + Math.random() * 900000)
  return `${prefix}-${year}-${seq}`
}

// ── Hash NIK dari dataFormulir ───────────────────────────────

const NIK_FIELD_NAMES = ['nik', 'nikKepalaKeluarga', 'nikAyah', 'nikIbu']

function extractAndHashNik(dataFormulir: Record<string, unknown>): string | null {
  for (const field of NIK_FIELD_NAMES) {
    const val = dataFormulir[field]
    if (typeof val === 'string' && /^\d{16}$/.test(val)) {
      // SECURITY: Hanya hash yang disimpan — NIK plaintext tidak pernah ke DB
      return createHash('sha256').update(val).digest('hex')
    }
  }
  return null
}

// ── SLA Calculator ────────────────────────────────────────────

const SLA_DAYS: Record<string, number> = {
  KTP: 5, KK: 5, AKTA_LAHIR: 3, PINDAH_DOMISILI: 3,
  PERIZINAN: 7, BANSOS: 7, PAJAK_PBB: 1, SURAT_KERJA: 2,
}

function calculateDeadline(jenisLayanan: string): Date {
  const days = SLA_DAYS[jenisLayanan] ?? 7
  const deadline = new Date()
  // Tambah hari kerja (skip Sabtu/Minggu)
  let added = 0
  while (added < days) {
    deadline.setDate(deadline.getDate() + 1)
    const dow = deadline.getDay()
    if (dow !== 0 && dow !== 6) added++
  }
  return deadline
}

// ── In-memory store (dev/demo) ────────────────────────────────
// Production: ganti dengan Prisma client di packages/db

interface PengajuanRecord {
  id: string
  nomorTiket: string
  jenisLayanan: string
  status: 'PENDING' | 'DIVERIFIKASI' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'
  namaSubmitter: string
  kontakSubmitter: string
  dataFormulirMasked: Record<string, unknown> // NIK sudah di-mask
  nikHash: string | null
  deadlineAt: Date
  createdAt: Date
  tracking: Array<{ status: string; keterangan: string; createdAt: Date }>
}

const STORE = new Map<string, PengajuanRecord>()

// ── POST /api/pengajuan ───────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit: 10 permohonan / 60 detik per IP
  const ip = getClientIp(req)
  const rl = checkRateLimit(`pengajuan:${ip}`, 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak permohonan. Coba lagi dalam beberapa saat.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rl.retryAfterSeconds),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  // Parse & validasi body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', detail: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { jenisLayanan, namaSubmitter, kontakSubmitter, dataFormulir } = parsed.data

  // Hash NIK jika ada
  const nikHash = extractAndHashNik(dataFormulir as Record<string, unknown>)

  // Mask data formulir sebelum disimpan (untuk response ke klien)
  const dataFormulirMasked = maskFormData(dataFormulir) as Record<string, unknown>

  // Generate tiket unik
  const nomorTiket = generateNomorTiket(jenisLayanan)
  const deadlineAt = calculateDeadline(jenisLayanan)

  const record: PengajuanRecord = {
    id: crypto.randomUUID(),
    nomorTiket,
    jenisLayanan,
    status: 'PENDING',
    namaSubmitter,
    kontakSubmitter,
    dataFormulirMasked,
    nikHash,
    deadlineAt,
    createdAt: new Date(),
    tracking: [
      { status: 'PENDING', keterangan: 'Permohonan diterima oleh sistem', createdAt: new Date() },
    ],
  }

  STORE.set(nomorTiket, record)

  return NextResponse.json(
    {
      nomorTiket,
      jenisLayanan,
      status: 'PENDING',
      deadlineAt: deadlineAt.toISOString(),
      pesan: `Permohonan ${jenisLayanan} berhasil dikirim. Nomor tiket: ${nomorTiket}`,
    },
    { status: 201 }
  )
}

// ── GET /api/pengajuan?tiket=XXX ──────────────────────────────

export async function GET(req: NextRequest) {
  // Rate limit cek tiket: 20 req / 60 detik
  const ip = getClientIp(req)
  const rl = checkRateLimit(`cek-tiket:${ip}`, 20, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
    )
  }

  const { searchParams } = new URL(req.url)
  const rawTiket = searchParams.get('tiket') ?? ''

  const parsed = cekTiketSchema.safeParse({ tiket: rawTiket })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Format tiket tidak valid' }, { status: 400 })
  }

  const record = STORE.get(parsed.data.tiket)
  if (!record) {
    // SECURITY: Jangan bedakan "tidak ada" vs "ada tapi bukan milik Anda"
    // — keduanya 404 untuk mencegah enumeration
    return NextResponse.json({ error: 'Tiket tidak ditemukan' }, { status: 404 })
  }

  // Kembalikan tanpa dataFormulir detail (hanya status + tracking)
  return NextResponse.json({
    nomorTiket: record.nomorTiket,
    jenisLayanan: record.jenisLayanan,
    status: record.status,
    namaSubmitter: record.namaSubmitter,
    deadlineAt: record.deadlineAt,
    createdAt: record.createdAt,
    tracking: record.tracking,
  })
}
