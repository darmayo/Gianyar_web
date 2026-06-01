import { Pool, type QueryResult, type QueryResultRow } from 'pg'

let pool: Pool | null = null

export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url && process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required in production')
  }
  return url
}

export function getPool() {
  const url = getDatabaseUrl()
  if (!url) throw new Error('DATABASE_URL is required for persistent operations')

  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: Number(process.env.DB_POOL_MAX ?? 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
  }

  return pool
}

export async function query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, values)
}

export async function withTransaction<T>(fn: (client: PoolClientLike) => Promise<T>) {
  const client = await getPool().connect()
  try {
    await client.query('begin')
    const result = await fn(client)
    await client.query('commit')
    return result
  } catch (err) {
    await client.query('rollback')
    throw err
  } finally {
    client.release()
  }
}

export interface PoolClientLike {
  query<T extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<T>>
}
