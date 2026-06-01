import { createHmac, pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { hasPermission, type Permission, type RoleName } from '@/lib/workflow'

const COOKIE_NAME = 'gianyar_admin_session'
const SESSION_TTL_SECONDS = 8 * 60 * 60

export interface AdminUser {
  id: string
  email: string
  name: string
  role: RoleName
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') throw new Error('ADMIN_SESSION_SECRET is required in production')
    return 'dev-only-admin-session-secret-change-me'
  }
  return secret
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 210_000, 32, 'sha256').toString('hex')
  return `pbkdf2_sha256$${salt}$${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [algo, salt, hash] = stored.split('$')
  if (algo !== 'pbkdf2_sha256' || !salt || !hash) return false
  const actual = pbkdf2Sync(password, salt, 210_000, 32, 'sha256').toString('hex')
  const left = Buffer.from(actual, 'hex')
  const right = Buffer.from(hash, 'hex')
  return left.length === right.length && timingSafeEqual(left, right)
}

function sign(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url')
}

export function createSessionToken(user: AdminUser) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = Buffer.from(JSON.stringify({ sub: user.id, role: user.role, exp })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function readSessionToken(req?: NextRequest) {
  if (req) return req.cookies.get(COOKIE_NAME)?.value ?? null
  return null
}

export function verifySessionToken(token: string | null) {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature || sign(payload) !== signature) return null
  const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { sub: string; role: RoleName; exp: number }
  if (!parsed.sub || !parsed.role || parsed.exp < Math.floor(Date.now() / 1000)) return null
  return parsed
}

export async function getCurrentAdmin(req?: NextRequest): Promise<AdminUser | null> {
  const session = verifySessionToken(readSessionToken(req))
  if (!session) return null

  const result = await query<{ id: string; email: string; name: string; role: RoleName }>(
    `select u.id, u.email, u.name, r.name as role
     from users u join roles r on r.id = u.role_id
     where u.id = $1 and u.is_active = true`,
    [session.sub]
  )
  return result.rows[0] ?? null
}

export async function requireAdmin(req: NextRequest, permission?: Permission) {
  const user = await getCurrentAdmin(req)
  if (!user) return { user: null, error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (permission && !hasPermission(user.role, permission)) {
    return { user: null, error: Response.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { user, error: null }
}

export async function ensureBootstrapAdmin() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD
  if (!email || !password) return

  const existing = await query<{ count: string }>('select count(*)::text as count from users')
  if (Number(existing.rows[0]?.count ?? 0) > 0) return

  const role = await query<{ id: string }>("select id::text from roles where name = 'ADMIN'")
  const roleId = role.rows[0]?.id
  if (!roleId) throw new Error('ADMIN role missing; apply infra/db/schema.sql')

  await query(
    `insert into users (id, email, name, password_hash, role_id)
     values ($1, $2, $3, $4, $5)`,
    [randomUUID(), email.toLowerCase(), 'Administrator', hashPassword(password), roleId]
  )
}

export function sessionCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}`
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}`
}
