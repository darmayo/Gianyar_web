import { createLogger } from '@/lib/logger'

const log = createLogger('Redis')

interface RedisClient {
  get(key: string): Promise<string | null>
  set(key: string, value: string, options?: unknown): Promise<string | null>
  incr(key: string): Promise<number>
  pTTL(key: string): Promise<number>
  pExpire(key: string, milliseconds: number): Promise<boolean>
  eval(script: string, options: { keys: string[]; arguments: string[] }): Promise<unknown>
}

let clientPromise: Promise<RedisClient | null> | null = null

export async function getRedisClient() {
  const url = process.env.REDIS_URL
  if (!url) return null

  if (!clientPromise) {
    clientPromise = import('redis')
      .then(async ({ createClient }) => {
        const client = createClient({ url })
        client.on('error', (err: Error) => {
          log.warn('Redis client error', { message: err.message })
        })
        await client.connect()
        return client as unknown as RedisClient
      })
      .catch((err) => {
        clientPromise = null
        log.warn('Redis unavailable, falling back to memory store', {
          message: err instanceof Error ? err.message : String(err),
        })
        return null
      })
  }

  return clientPromise
}
