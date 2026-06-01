import process from 'node:process'
import nodemailer from 'nodemailer'

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_FROM) {
  console.log('[smtp-smoke] skipped: SMTP env is not complete')
  process.exit(0)
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER && process.env.SMTP_PASS
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
})

try {
  await transporter.verify()
  console.log('[smtp-smoke] ok')
} catch (err) {
  console.error('[smtp-smoke] failed:', err instanceof Error ? err.message : 'unknown error')
  process.exit(1)
}
