import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword, requireAdmin } from '@/lib/admin-auth'
import { query } from '@/lib/db'

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(12).max(200),
  role: z.enum(['ADMIN', 'OPERATOR', 'VERIFIKATOR', 'VIEWER']),
})

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req, 'users:manage')
  if (auth.error) return auth.error

  const result = await query(
    `select u.id, u.email, u.name, r.name as role, u.is_active, u.created_at
     from users u join roles r on r.id = u.role_id
     order by u.created_at desc`
  )
  return NextResponse.json({ data: result.rows })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req, 'users:manage')
  if (auth.error || !auth.user) return auth.error

  const parsed = createUserSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Payload user tidak valid' }, { status: 400 })

  const role = await query<{ id: string }>('select id::text from roles where name = $1', [parsed.data.role])
  if (!role.rows[0]) return NextResponse.json({ error: 'Role tidak ditemukan' }, { status: 400 })

  const id = randomUUID()
  await query(
    `insert into users (id, email, name, password_hash, role_id)
     values ($1,$2,$3,$4,$5)`,
    [id, parsed.data.email.toLowerCase(), parsed.data.name, hashPassword(parsed.data.password), role.rows[0].id]
  )
  await query(
    `insert into audit_logs (id, actor_user_id, action, entity_type, entity_id, metadata)
     values ($1,$2,'USER_CREATED','user',$3,$4)`,
    [randomUUID(), auth.user.id, id, JSON.stringify({ role: parsed.data.role })]
  )

  return NextResponse.json({ id }, { status: 201 })
}
