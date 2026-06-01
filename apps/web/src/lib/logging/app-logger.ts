// ============================================================
// App Logger — Logging sistem terpusat
//
// Fitur:
//  - Level: debug | info | warn | error
//  - Konteks per module (API:cek-pajak, Page:berita, dll)
//  - Di dev: console berwarna
//  - Di prod: JSON structured → kirim ke /api/logs
//  - Stack trace sanitized (tidak bocorkan path prod)
//  - Catat setiap 404, 500, redirect, error boundary
//
// Cara pakai:
//   import { logger } from '@/lib/logging/app-logger'
//   logger.info('Halaman dibuka', { url: '/' })
//   logger.error('Gagal fetch', error, { context: 'berita' })
//
//   import { createLogger } from '@/lib/logging/app-logger'
//   const log = createLogger('API:cek-pajak')
//   log.warn('Rate limit hampir tercapai', { ip: '...' })
// ============================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  url?: string
  data?: unknown
  error?: {
    name: string
    message: string
    stack?: string
  }
}

// ── Format terminal berwarna (dev) ─────────────────────────
const COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m',
  info:  '\x1b[32m',
  warn:  '\x1b[33m',
  error: '\x1b[31m',
}
const RESET = '\x1b[0m'
const BOLD  = '\x1b[1m'

function formatDev(entry: LogEntry): string {
  const color = COLORS[entry.level]
  const ctx   = entry.context ? `\x1b[90m[${entry.context}]\x1b[0m ` : ''
  const url   = entry.url ? ` \x1b[90m→ ${entry.url}\x1b[0m` : ''
  const time  = entry.timestamp.slice(11, 23)
  const data  = entry.data ? `\n  \x1b[90mdata:\x1b[0m ${JSON.stringify(entry.data, null, 2)}` : ''
  const err   = entry.error
    ? `\n  \x1b[31m${entry.error.name}: ${entry.error.message}\x1b[0m${
        entry.error.stack ? `\n  \x1b[90m${entry.error.stack.split('\n').slice(1, 4).join('\n  ')}\x1b[0m` : ''
      }`
    : ''
  return `${BOLD}${color}${entry.level.toUpperCase().padEnd(5)}${RESET} \x1b[90m${time}\x1b[0m ${ctx}${entry.message}${url}${data}${err}`
}

// ── Kirim ke endpoint logging (prod / dev errors) ──────────
let pendingLogs: LogEntry[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

function scheduleSend(entry: LogEntry) {
  pendingLogs.push(entry)
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    const batch = [...pendingLogs]
    pendingLogs = []
    flushTimer = null
    if (typeof window === 'undefined') return
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: batch }),
      signal: AbortSignal.timeout(4000),
    }).catch(() => {})
  }, 200)
}

// ── Core log function ───────────────────────────────────────
function log(
  level: LogLevel,
  message: string,
  context?: string,
  data?: unknown,
  error?: Error | unknown,
  url?: string,
) {
  const isDev = process.env.NODE_ENV !== 'production'

  // Sanitize error stack di produksi
  const errorPayload = error
    ? (() => {
        const e = error instanceof Error ? error : new Error(String(error))
        return {
          name: e.name,
          message: e.message,
          stack: isDev ? e.stack : e.stack?.split('\n').slice(0, 3).join('\n'),
        }
      })()
    : undefined

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    url,
    data: data ?? undefined,
    error: errorPayload,
  }

  // ── Output ke console ───────────────────────────────────
  if (isDev) {
    const formatted = formatDev(entry)
    switch (level) {
      case 'debug': console.debug(formatted); break
      case 'info':  console.info(formatted);  break
      case 'warn':  console.warn(formatted);  break
      case 'error': console.error(formatted); break
    }
  } else {
    // Produksi: JSON structured
    console[level === 'debug' ? 'log' : level](JSON.stringify(entry))
  }

  // Browser tidak membawa secret LOG_INGEST_TOKEN; endpoint ingest production
  // hanya untuk internal/server-side writer agar tidak terbuka publik.
  if (typeof window !== 'undefined') {
    if (isDev && (level === 'error' || level === 'warn')) {
      scheduleSend(entry)
    }
  }
}

// ── Factory: buat logger per konteks ───────────────────────
export function createLogger(context?: string) {
  return {
    debug: (msg: string, data?: unknown) =>
      log('debug', msg, context, data),
    info: (msg: string, data?: unknown, url?: string) =>
      log('info', msg, context, data, undefined, url),
    warn: (msg: string, data?: unknown) =>
      log('warn', msg, context, data),
    error: (msg: string, error?: Error | unknown, data?: unknown) =>
      log('error', msg, context, data, error),
  }
}

// ── Default logger (tanpa konteks) ─────────────────────────
export const logger = createLogger()

// ── Helper untuk Next.js API Routes ────────────────────────
export function logApiError(
  route: string,
  error: unknown,
  req?: { method?: string; url?: string },
) {
  const apiLog = createLogger(`API:${route}`)
  apiLog.error(
    `${req?.method ?? 'UNKNOWN'} ${req?.url ?? route} gagal`,
    error,
    { route, method: req?.method },
  )
}

// ── Helper untuk log 404 ────────────────────────────────────
export function log404(url: string, referrer?: string) {
  const notFoundLog = createLogger('404')
  notFoundLog.warn('Halaman tidak ditemukan', { url, referrer })
}

// ── Helper untuk log redirect ───────────────────────────────
export function logRedirect(from: string, to: string) {
  const redirectLog = createLogger('Redirect')
  redirectLog.info(`Redirect: ${from} → ${to}`, { from, to })
}
