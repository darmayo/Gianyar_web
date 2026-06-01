import { randomUUID } from 'crypto'
import type { PoolClientLike } from '@/lib/db'

export async function enqueueNotification(
  db: PoolClientLike,
  input: {
    pengajuanId: string
    recipient: string
    subject: string
    body: string
    channel?: 'EMAIL' | 'WHATSAPP' | 'IN_APP'
  }
) {
  await db.query(
    `insert into notifications (id, pengajuan_id, channel, recipient, subject, body, status, retry_count)
     values ($1, $2, $3, $4, $5, $6, 'PENDING', 0)`,
    [
      randomUUID(),
      input.pengajuanId,
      input.channel ?? 'EMAIL',
      input.recipient,
      input.subject,
      input.body,
    ]
  )
}
