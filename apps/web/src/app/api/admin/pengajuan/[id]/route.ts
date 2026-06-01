import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { query, withTransaction } from '@/lib/db'
import { enqueueNotification } from '@/lib/notification-service'
import { PENGAJUAN_STATUSES } from '@/lib/workflow'

const patchSchema = z.object({
  status: z.enum(PENGAJUAN_STATUSES).optional(),
  assignedTo: z.string().uuid().nullable().optional(),
  internalComment: z.string().min(1).max(2000).optional(),
  rejectionReason: z.string().max(1000).optional(),
  revisionNote: z.string().max(1000).optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req, 'pengajuan:read')
  if (auth.error) return auth.error
  const { id } = await params

  const detail = await query(
    `select p.id, p.nomor_tiket, p.jenis_layanan, p.status, p.prioritas, p.nama_submitter,
            p.kontak_submitter, p.data_formulir_masked, p.deadline_at, p.assigned_to,
            p.rejection_reason, p.revision_note, p.created_at, p.updated_at, u.name as assigned_name
     from pengajuan p left join users u on u.id = p.assigned_to
     where p.id = $1`,
    [id]
  )
  if (!detail.rows[0]) return NextResponse.json({ error: 'Pengajuan tidak ditemukan' }, { status: 404 })

  const [history, comments, documents] = await Promise.all([
    query('select id, from_status, to_status, note, actor_user_id, created_at from status_history where pengajuan_id = $1 order by created_at asc', [id]),
    query('select c.id, c.comment, c.created_at, u.name as actor_name from internal_comments c join users u on u.id = c.actor_user_id where c.pengajuan_id = $1 order by c.created_at desc', [id]),
    query('select id, original_name, mime_type, size_bytes, created_at from dokumen where pengajuan_id = $1 order by created_at desc', [id]),
  ])

  return NextResponse.json({ data: detail.rows[0], history: history.rows, comments: comments.rows, documents: documents.rows })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req, 'pengajuan:update')
  if (auth.error || !auth.user) return auth.error
  const { id } = await params

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Payload tidak valid' }, { status: 400 })

  const updated = await withTransaction(async (db) => {
    const current = await db.query<{ status: string; kontak_submitter: string; nomor_tiket: string }>(
      'select status, kontak_submitter, nomor_tiket from pengajuan where id = $1 for update',
      [id]
    )
    const row = current.rows[0]
    if (!row) return null

    await db.query(
      `update pengajuan
       set status = coalesce($1, status),
           assigned_to = case when $2::uuid is null then assigned_to else $2::uuid end,
           rejection_reason = coalesce($3, rejection_reason),
           revision_note = coalesce($4, revision_note),
           updated_at = now()
       where id = $5`,
      [parsed.data.status ?? null, parsed.data.assignedTo ?? null, parsed.data.rejectionReason ?? null, parsed.data.revisionNote ?? null, id]
    )

    if (parsed.data.status && parsed.data.status !== row.status) {
      await db.query(
        `insert into status_history (id, pengajuan_id, from_status, to_status, note, actor_user_id)
         values ($1,$2,$3,$4,$5,$6)`,
        [randomUUID(), id, row.status, parsed.data.status, parsed.data.revisionNote ?? parsed.data.rejectionReason ?? null, auth.user.id]
      )

      if (['PERLU_REVISI', 'SELESAI', 'DITOLAK'].includes(parsed.data.status)) {
        await enqueueNotification(db, {
          pengajuanId: id,
          recipient: row.kontak_submitter,
          subject: `Status ${row.nomor_tiket}: ${parsed.data.status}`,
          body: `Status pengajuan ${row.nomor_tiket} berubah menjadi ${parsed.data.status}.`,
        })
      }
    }

    if (parsed.data.internalComment) {
      await db.query(
        `insert into internal_comments (id, pengajuan_id, actor_user_id, comment)
         values ($1,$2,$3,$4)`,
        [randomUUID(), id, auth.user.id, parsed.data.internalComment]
      )
    }

    await db.query(
      `insert into audit_logs (id, actor_user_id, action, entity_type, entity_id, metadata)
       values ($1,$2,'PENGAJUAN_UPDATED','pengajuan',$3,$4)`,
      [randomUUID(), auth.user.id, id, JSON.stringify({ status: parsed.data.status, assignedTo: parsed.data.assignedTo })]
    )

    return { ok: true }
  })

  if (!updated) return NextResponse.json({ error: 'Pengajuan tidak ditemukan' }, { status: 404 })
  return NextResponse.json(updated)
}
