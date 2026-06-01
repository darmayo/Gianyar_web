import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { query, withTransaction } from '@/lib/db'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'
import { storePrivateDocument } from '@/lib/storage'
import { hashTrackingToken, safeEqualHash } from '@/lib/tracking-token'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = await checkRateLimit(`upload-dokumen:${ip}`, 10, 60 * 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Batas upload dokumen tercapai' }, { status: 429 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Form upload tidak valid' }, { status: 400 })
  }

  const tiket = String(form.get('tiket') ?? '')
  const token = req.headers.get('x-tracking-token') ?? ''
  const file = form.get('file')
  if (!/^[A-Z]{2,10}-\d{4}-\d{6}$/.test(tiket) || !/^[A-Za-z0-9_-]{32,128}$/.test(token)) {
    return NextResponse.json({ error: 'Tiket atau token tidak valid' }, { status: 400 })
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File wajib diunggah' }, { status: 400 })
  }

  const lookup = await query<{ id: string; tracking_token_hash: string }>(
    'select id, tracking_token_hash from pengajuan where nomor_tiket = $1',
    [tiket]
  )
  const pengajuan = lookup.rows[0]
  if (!pengajuan || !safeEqualHash(hashTrackingToken(token), pengajuan.tracking_token_hash)) {
    return NextResponse.json({ error: 'Pengajuan tidak ditemukan' }, { status: 404 })
  }

  let stored
  try {
    stored = await storePrivateDocument(file, pengajuan.id)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload ditolak' }, { status: 400 })
  }

  const documentId = randomUUID()
  await withTransaction(async (db) => {
    await db.query(
      `insert into dokumen (id, pengajuan_id, original_name, storage_key, storage_provider, mime_type, size_bytes, checksum_sha256)
       values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        documentId,
        pengajuan.id,
        stored.originalName,
        stored.storageKey,
        stored.storageProvider,
        stored.mimeType,
        stored.sizeBytes,
        stored.checksumSha256,
      ]
    )
    await db.query(
      `insert into audit_logs (id, action, entity_type, entity_id, ip_address, metadata)
       values ($1,'DOCUMENT_UPLOADED','dokumen',$2,$3,$4)`,
      [randomUUID(), documentId, ip, JSON.stringify({ pengajuanId: pengajuan.id, mimeType: stored.mimeType, sizeBytes: stored.sizeBytes })]
    )
  })

  return NextResponse.json({
    id: documentId,
    originalName: stored.originalName,
    mimeType: stored.mimeType,
    sizeBytes: stored.sizeBytes,
  }, { status: 201 })
}
