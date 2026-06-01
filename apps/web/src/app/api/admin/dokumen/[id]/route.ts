import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { query } from '@/lib/db'
import { readPrivateDocument, sanitizeFileName, type StorageProvider } from '@/lib/storage'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req, 'documents:read')
  if (auth.error || !auth.user) return auth.error
  const { id } = await params

  const result = await query<{ id: string; original_name: string; storage_key: string; storage_provider: string; mime_type: string; size_bytes: number }>(
    'select id, original_name, storage_key, storage_provider, mime_type, size_bytes from dokumen where id = $1',
    [id]
  )
  const doc = result.rows[0]
  if (!doc) return NextResponse.json({ error: 'Dokumen tidak ditemukan' }, { status: 404 })

  let body: Buffer
  try {
    body = await readPrivateDocument(doc.storage_key, doc.storage_provider as StorageProvider)
  } catch {
    return NextResponse.json({ error: 'File dokumen tidak tersedia' }, { status: 404 })
  }

  await query(
    `insert into audit_logs (id, actor_user_id, action, entity_type, entity_id, metadata)
     values ($1,$2,'DOCUMENT_OPENED','dokumen',$3,$4)`,
    [randomUUID(), auth.user.id, doc.id, JSON.stringify({ provider: doc.storage_provider, sizeBytes: doc.size_bytes })]
  )

  return new NextResponse(new Uint8Array(body), {
    headers: {
      'Content-Type': doc.mime_type,
      'Content-Length': String(body.length),
      'Content-Disposition': `attachment; filename="${sanitizeFileName(doc.original_name)}"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
