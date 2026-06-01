import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req, 'pengajuan:read')
  if (auth.error) return auth.error

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const layanan = searchParams.get('layanan')
  const prioritas = searchParams.get('prioritas')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  const exportCsv = searchParams.get('export') === 'csv'

  const where: string[] = []
  const values: unknown[] = []
  function add(condition: string, value: unknown) {
    values.push(value)
    where.push(condition.replace('?', `$${values.length}`))
  }

  if (status) add('p.status = ?', status)
  if (layanan) add('p.jenis_layanan = ?', layanan)
  if (prioritas) add('p.prioritas = ?', prioritas)
  if (dateFrom) add('p.created_at >= ?', dateFrom)
  if (dateTo) add('p.created_at <= ?', dateTo)

  const result = await query<{
    id: string
    nomor_tiket: string
    jenis_layanan: string
    status: string
    prioritas: string
    deadline_at: Date
    created_at: Date
    assigned_name: string | null
  }>(
    `select p.id, p.nomor_tiket, p.jenis_layanan, p.status, p.prioritas,
            p.deadline_at, p.created_at, u.name as assigned_name
     from pengajuan p
     left join users u on u.id = p.assigned_to
     ${where.length ? `where ${where.join(' and ')}` : ''}
     order by p.created_at desc
     limit 200`,
    values
  )

  if (exportCsv) {
    const lines = [
      'nomor_tiket,jenis_layanan,status,prioritas,assigned_to,created_at,deadline_at',
      ...result.rows.map((row) => [
        row.nomor_tiket,
        row.jenis_layanan,
        row.status,
        row.prioritas,
        row.assigned_name ?? '',
        row.created_at.toISOString(),
        row.deadline_at.toISOString(),
      ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')),
    ]
    return new NextResponse(lines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="pengajuan.csv"',
      },
    })
  }

  return NextResponse.json({ data: result.rows })
}
