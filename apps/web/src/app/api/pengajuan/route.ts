// ============================================================
// POST /api/pengajuan — Terima submission DynamicForm
// GET  /api/pengajuan?tiket=XXX + header x-tracking-token — Cek status tiket
//
// SECURITY CHECKLIST:
//  ✓ Zod validation semua input
//  ✓ NIK di-HMAC SHA-256 dengan pepper server sebelum disimpan
//  ✓ maskFormData() dipanggil sebelum response ke klien
//  ✓ Rate limit: 10 req/menit per IP (anti-spam)
//  ✓ IDOR: cek status wajib nomorTiket + tracking token acak
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createHmac, randomBytes, randomInt, randomUUID } from 'crypto'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'
import { maskFormData } from '@/lib/field-mask'
import { query, withTransaction, type PoolClientLike } from '@/lib/db'
import { enqueueNotification } from '@/lib/notification-service'
import type { PengajuanStatus } from '@/lib/workflow'
import { hashTrackingToken, safeEqualHash } from '@/lib/tracking-token'

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
  token: z.string().min(32).max(128).regex(/^[A-Za-z0-9_-]+$/, 'Tracking token tidak valid'),
})

const documentMetaSchema = z.object({
  name: z.string().min(1).max(180),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  size: z.number().int().positive().max(10 * 1024 * 1024),
})

function logPengajuanDbError(err: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[pengajuan-db]', err instanceof Error ? err.message : String(err))
  }
}

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
  const seq = randomInt(100000, 1000000)
  return `${prefix}-${year}-${seq}`
}

// ── HMAC NIK dari dataFormulir ───────────────────────────────

const NIK_FIELD_NAMES = ['nik', 'nikKepalaKeluarga', 'nikAyah', 'nikIbu']

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

function extractAndHashNik(dataFormulir: Record<string, unknown>): string | null {
  for (const field of NIK_FIELD_NAMES) {
    const val = dataFormulir[field]
    if (typeof val === 'string' && /^\d{16}$/.test(val)) {
      // HMAC memakai pepper server; tetap perlakukan output sebagai data sensitif.
      return createHmac('sha256', getNikHashPepper()).update(val).digest('hex')
    }
  }
  return null
}

// ── Tracking Token ───────────────────────────────────────────

function generateTrackingToken(): string {
  return randomBytes(32).toString('base64url')
}

function maskName(name: string): string {
  const cleaned = name.trim()
  if (!cleaned) return ''
  return cleaned
    .split(/\s+/)
    .map((part) => part.length <= 2 ? part[0] + '*' : part[0] + '*'.repeat(Math.max(1, part.length - 2)) + part.slice(-1))
    .join(' ')
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

// Redis bila tersedia, fallback memory untuk development lokal.

interface PengajuanRecord {
  id: string
  nomorTiket: string
  trackingTokenHash: string
  jenisLayanan: string
  status: PengajuanStatus
  namaSubmitter: string
  kontakSubmitter: string
  dataFormulirMasked: Record<string, unknown> // NIK sudah di-mask
  nikHash: string | null
  deadlineAt: Date
  createdAt: Date
  tracking: Array<{ status: string; keterangan: string; createdAt: Date }>
}

async function getPengajuan(nomorTiket: string): Promise<PengajuanRecord | null> {
  const result = await query<{
    id: string
    nomor_tiket: string
    tracking_token_hash: string
    jenis_layanan: string
    status: PengajuanStatus
    nama_submitter: string
    kontak_submitter: string
    data_formulir_masked: Record<string, unknown>
    nik_hash: string | null
    deadline_at: Date
    created_at: Date
  }>(
    `select id, nomor_tiket, tracking_token_hash, jenis_layanan, status, nama_submitter,
            kontak_submitter, data_formulir_masked, nik_hash, deadline_at, created_at
     from pengajuan where nomor_tiket = $1`,
    [nomorTiket]
  )
  const row = result.rows[0]
  if (!row) return null

  const history = await query<{ status: string; keterangan: string; created_at: Date }>(
    `select to_status as status, coalesce(note, 'Status diperbarui') as keterangan, created_at
     from status_history where pengajuan_id = $1 order by created_at asc`,
    [row.id]
  )

  return {
    id: row.id,
    nomorTiket: row.nomor_tiket,
    trackingTokenHash: row.tracking_token_hash,
    jenisLayanan: row.jenis_layanan,
    status: row.status,
    namaSubmitter: row.nama_submitter,
    kontakSubmitter: row.kontak_submitter,
    dataFormulirMasked: row.data_formulir_masked,
    nikHash: row.nik_hash,
    deadlineAt: row.deadline_at,
    createdAt: row.created_at,
    tracking: history.rows.map((item) => ({
      status: item.status,
      keterangan: item.keterangan,
      createdAt: item.created_at,
    })),
  }
}

function extractDocumentMetadata(dataFormulir: Record<string, unknown>) {
  const raw = dataFormulir.dokumenPendukung ?? dataFormulir.lampiran
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => documentMetaSchema.safeParse(item))
    .filter((item): item is { success: true; data: z.infer<typeof documentMetaSchema> } => item.success)
    .map((item) => item.data)
}

async function trySavePengajuan(db: PoolClientLike, record: PengajuanRecord, documents: ReturnType<typeof extractDocumentMetadata>, ip: string): Promise<boolean> {
  const result = await db.query(
    `insert into pengajuan (
       id, nomor_tiket, tracking_token_hash, jenis_layanan, status, nama_submitter,
       kontak_submitter, data_formulir_masked, nik_hash, deadline_at
     ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     on conflict (nomor_tiket) do nothing`,
    [
      record.id,
      record.nomorTiket,
      record.trackingTokenHash,
      record.jenisLayanan,
      record.status,
      record.namaSubmitter,
      record.kontakSubmitter,
      JSON.stringify(record.dataFormulirMasked),
      record.nikHash,
      record.deadlineAt,
    ]
  )
  if (result.rowCount !== 1) return false

  await db.query(
    `insert into status_history (id, pengajuan_id, from_status, to_status, note)
     values ($1,$2,null,$3,$4)`,
    [randomUUID(), record.id, record.status, 'Pengajuan diterima oleh sistem']
  )

  await db.query(
    `insert into audit_logs (id, action, entity_type, entity_id, ip_address, metadata)
     values ($1,'PENGAJUAN_CREATED','pengajuan',$2,$3,$4)`,
    [randomUUID(), record.id, ip, JSON.stringify({ jenisLayanan: record.jenisLayanan, documentCount: documents.length })]
  )

  await enqueueNotification(db, {
    pengajuanId: record.id,
    recipient: record.kontakSubmitter,
    subject: `Pengajuan ${record.jenisLayanan} diterima`,
    body: `Pengajuan ${record.nomorTiket} telah diterima dan menunggu verifikasi.`,
  })

  return true
}

// ── POST /api/pengajuan ───────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit: 10 permohonan / 60 detik per IP
  const ip = getClientIp(req)
  const rl = await checkRateLimit(`pengajuan:${ip}`, 10, 60_000)
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

  // HMAC NIK jika ada
  let nikHash: string | null
  try {
    nikHash = extractAndHashNik(dataFormulir as Record<string, unknown>)
  } catch {
    return NextResponse.json({ error: 'Konfigurasi keamanan server belum siap' }, { status: 500 })
  }

  // Mask data formulir sebelum disimpan (untuk response ke klien)
  const dataFormulirMasked = maskFormData(dataFormulir) as Record<string, unknown>

  const deadlineAt = calculateDeadline(jenisLayanan)
  const documents = extractDocumentMetadata(dataFormulir as Record<string, unknown>)

  let trackingToken = ''
  let record: PengajuanRecord | null = null
  try {
    record = await withTransaction(async (db) => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const nomorTiket = generateNomorTiket(jenisLayanan)
        trackingToken = generateTrackingToken()
        const candidate: PengajuanRecord = {
          id: randomUUID(),
          nomorTiket,
          trackingTokenHash: hashTrackingToken(trackingToken),
          jenisLayanan,
          status: 'DIAJUKAN',
          namaSubmitter,
          kontakSubmitter,
          dataFormulirMasked,
          nikHash,
          deadlineAt,
          createdAt: new Date(),
          tracking: [
            { status: 'DIAJUKAN', keterangan: 'Pengajuan diterima oleh sistem', createdAt: new Date() },
          ],
        }

        if (await trySavePengajuan(db, candidate, documents, ip)) return candidate
      }
      return null
    })
  } catch (err) {
    logPengajuanDbError(err)
    return NextResponse.json({ error: 'Database pengajuan belum siap' }, { status: 503 })
  }

  if (!record) {
    return NextResponse.json(
      { error: 'Gagal membuat nomor tiket unik. Coba lagi.' },
      { status: 503 }
    )
  }

  return NextResponse.json(
    {
      nomorTiket: record.nomorTiket,
      trackingToken,
      statusUrl: '/pengaduan/cek',
      jenisLayanan,
      status: record.status,
      deadlineAt: deadlineAt.toISOString(),
      pesan: `Permohonan ${jenisLayanan} berhasil dikirim. Nomor tiket: ${record.nomorTiket}`,
    },
    { status: 201 }
  )
}

// ── GET /api/pengajuan?tiket=XXX + x-tracking-token ───────────

export async function GET(req: NextRequest) {
  // Rate limit cek tiket: 20 req / 60 detik
  const ip = getClientIp(req)
  const rl = await checkRateLimit(`cek-tiket:${ip}`, 20, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
    )
  }

  const { searchParams } = new URL(req.url)
  const rawTiket = searchParams.get('tiket') ?? ''
  const rawToken = req.headers.get('x-tracking-token') ?? ''

  const parsed = cekTiketSchema.safeParse({ tiket: rawTiket, token: rawToken })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Format tiket atau token tidak valid' }, { status: 400 })
  }

  let record: PengajuanRecord | null
  try {
    record = await getPengajuan(parsed.data.tiket)
  } catch (err) {
    logPengajuanDbError(err)
    return NextResponse.json({ error: 'Database pengajuan belum siap' }, { status: 503 })
  }
  if (!record || !record.trackingTokenHash || !safeEqualHash(hashTrackingToken(parsed.data.token), record.trackingTokenHash)) {
    // Jangan bedakan tiket tidak ada vs token salah untuk mencegah enumeration.
    return NextResponse.json({ error: 'Tiket tidak ditemukan' }, { status: 404 })
  }

  // Kembalikan tanpa dataFormulir detail (hanya status + tracking)
  return NextResponse.json({
    nomorTiket: record.nomorTiket,
    jenisLayanan: record.jenisLayanan,
    status: record.status,
    namaSubmitter: maskName(record.namaSubmitter),
    deadlineAt: record.deadlineAt,
    createdAt: record.createdAt,
    tracking: record.tracking,
  })
}
