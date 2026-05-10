import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware — Anti-fingerprinting, Security Headers, & Request Logging
 *
 * Fitur:
 *  1. Strip header fingerprint Next.js (Wappalyzer/Shodan prevention)
 *  2. Tambah security headers
 *  3. Tandai request dengan request-id untuk tracking
 *  4. Catat 404 via header x-log-404 (diproses oleh page not-found.tsx)
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl
  const isDev = process.env.NODE_ENV !== 'production'

  // ── Request ID untuk tracing ────────────────────────────────
  const requestId = crypto.randomUUID().slice(0, 8)
  response.headers.set('X-Request-Id', requestId)

  // ── Strip Next.js fingerprint headers ──────────────────────
  response.headers.delete('x-nextjs-cache')
  response.headers.delete('x-nextjs-stale-time')
  response.headers.delete('x-nextjs-matched-path')
  response.headers.delete('x-nextjs-page')
  response.headers.delete('x-powered-by')

  // Timpa Server header dengan nilai generik
  response.headers.set('Server', 'Webserver')

  // ── Tambahan security headers ───────────────────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // ── Log semua request di development ───────────────────────
  if (isDev) {
    const method = request.method
    const url = pathname + (request.nextUrl.search ?? '')
    const referer = request.headers.get('referer') ?? '—'
    const ua = (request.headers.get('user-agent') ?? '').slice(0, 60)
    // Log ke stdout — akan terlihat di terminal dev server
    if (!pathname.startsWith('/api/logs') && !pathname.startsWith('/_next')) {
      process.stdout.write(
        `\x1b[90m[proxy]\x1b[0m ${method} ${url} ref=${referer} ${ua}\n`
      )
    }
  }

  return response
}

// Jalankan middleware di semua route kecuali static files & API internal
export const config = {
  matcher: [
    /*
     * Match semua request kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml, manifest.json
     * - File statis umum (png, jpg, svg, dll)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|ttf|eot)).*)',
  ],
}
