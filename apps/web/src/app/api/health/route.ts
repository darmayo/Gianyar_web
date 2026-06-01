import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkPrivateStorageHealth } from '@/lib/storage'

export async function GET() {
  const checks: Record<string, { ok: boolean; message?: string }> = {}

  try {
    await query('select 1')
    checks.database = { ok: true }
  } catch (err) {
    checks.database = { ok: false, message: err instanceof Error ? err.message : 'database unavailable' }
  }

  try {
    const storage = await checkPrivateStorageHealth()
    checks.storage = { ok: true, message: storage.provider }
  } catch (err) {
    checks.storage = { ok: false, message: err instanceof Error ? err.message : 'private storage unavailable' }
  }

  const ok = Object.values(checks).every((item) => item.ok)
  return NextResponse.json({ ok, checks }, { status: ok ? 200 : 503 })
}
