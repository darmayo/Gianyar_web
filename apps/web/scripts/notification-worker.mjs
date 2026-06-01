import process from 'node:process'
import nodemailer from 'nodemailer'
import pg from 'pg'

const { Pool } = pg

const databaseUrl = process.env.DATABASE_URL
const dryRun = process.env.NOTIFICATION_DRY_RUN === 'true' || process.argv.includes('--dry-run')
if (!databaseUrl) {
  console.error('[notification-worker] DATABASE_URL is required')
  process.exit(1)
}

const pool = new Pool({ connectionString: databaseUrl, max: 2 })

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM)
}

function createTransporter() {
  if (!smtpConfigured()) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })
}

async function main() {
  const limit = Number(process.env.NOTIFICATION_WORKER_BATCH ?? 20)
  const transporter = createTransporter()
  const client = await pool.connect()
  try {
    await client.query('begin')
    const result = await client.query(
      `select id, channel, recipient, subject, body, retry_count
       from notifications
       where status in ('PENDING', 'FAILED') and retry_count < 5
       order by created_at asc
       limit $1
       for update skip locked`,
      [limit]
    )

    for (const row of result.rows) {
      try {
        if (row.channel !== 'EMAIL') throw new Error('Only EMAIL channel is supported by this worker')
        if (dryRun) {
          await client.query(
            `update notifications set status = 'SENT', sent_at = now(), last_error = null, error_message = null
             where id = $1`,
            [row.id]
          )
          continue
        }
        if (!transporter) throw new Error('SMTP is not configured')

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: row.recipient,
          subject: row.subject,
          text: row.body,
        })
        await client.query(
          `update notifications set status = 'SENT', sent_at = now(), last_error = null, error_message = null
           where id = $1`,
          [row.id]
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : 'notification failed'
        await client.query(
          `update notifications
           set status = 'FAILED', retry_count = retry_count + 1, last_error = $2, error_message = $2
           where id = $1`,
          [row.id, message.slice(0, 500)]
        )
      }
    }

    await client.query('commit')
    console.log(`[notification-worker] processed=${result.rowCount}`)
  } catch (err) {
    await client.query('rollback')
    console.error('[notification-worker] failed:', err instanceof Error ? err.message : 'unknown error')
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
