import { createHash, timingSafeEqual } from 'crypto'

export function hashTrackingToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function safeEqualHash(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}
