// ============================================================
// Rate Limiter — in-memory untuk Next.js API Routes
//
// SECURITY: Mencegah scraping NIK melalui endpoint cek pajak/bansos.
// Production → ganti dengan Redis INCR/EXPIRE (sudah tersedia di infra).
//
// Contoh:
//   const { allowed, retryAfter } = checkRateLimit(`cek-pajak:${ip}`, 5, 60_000)
//   if (!allowed) return Response 429
// ============================================================

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Singleton store — persist across warm function invocations
const store = new Map<string, RateLimitEntry>()

// Bersihkan entry kadaluarsa setiap 5 menit agar tidak bocor memori
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

/**
 * @param key         Kunci unik, misal: `"cek-pajak:192.168.1.1"`
 * @param maxRequests Maksimal request dalam jendela waktu
 * @param windowMs    Jendela waktu dalam milidetik
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt, retryAfterSeconds: 0 }
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, resetAt: entry.resetAt, retryAfterSeconds }
  }

  entry.count++
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
    retryAfterSeconds: 0,
  }
}

/** Ambil IP dari request (termasuk header proxy) */
export function getClientIp(req: Request): string {
  const headers = new Headers((req as Request).headers)
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}
