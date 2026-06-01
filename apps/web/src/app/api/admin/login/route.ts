import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'
import { createSessionToken, ensureBootstrapAdmin, sessionCookie, verifyPassword } from '@/lib/admin-auth'
import { query } from '@/lib/db'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = await checkRateLimit(`admin-login:${ip}`, 5, 15 * 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak percobaan login' }, { status: 429 })
  }

  await ensureBootstrapAdmin()

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Login tidak valid' }, { status: 400 })

  const result = await query<{ id: string; email: string; name: string; password_hash: string; role: 'ADMIN' | 'OPERATOR' | 'VERIFIKATOR' | 'VIEWER' }>(
    `select u.id, u.email, u.name, u.password_hash, r.name as role
     from users u join roles r on r.id = u.role_id
     where lower(u.email) = lower($1) and u.is_active = true`,
    [parsed.data.email]
  )
  const user = result.rows[0]
  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
    return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
  }

  const token = createSessionToken(user)
  const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  response.headers.append('Set-Cookie', sessionCookie(token))
  return response
}
