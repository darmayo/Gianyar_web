// ============================================================
// Logger — Structured logging untuk debugging cepat
// Di dev: warna + detail di console
// Di prod: JSON structured untuk log aggregator (Loki/Datadog)
// ============================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  data?: unknown
  error?: {
    name: string
    message: string
    stack?: string
  }
}

const COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m', // cyan
  info:  '\x1b[32m', // green
  warn:  '\x1b[33m', // yellow
  error: '\x1b[31m', // red
}
const RESET = '\x1b[0m'

function formatEntry(entry: LogEntry): string {
  const isDev = process.env.NODE_ENV !== 'production'

  if (isDev) {
    const color = COLORS[entry.level]
    const ctx = entry.context ? `[${entry.context}] ` : ''
    const data = entry.data ? `\n  data: ${JSON.stringify(entry.data, null, 2)}` : ''
    const err = entry.error ? `\n  error: ${entry.error.name}: ${entry.error.message}\n  ${entry.error.stack ?? ''}` : ''
    return `${color}${entry.level.toUpperCase()}${RESET} ${entry.timestamp} ${ctx}${entry.message}${data}${err}`
  }

  // Production: JSON structured (mudah di-parse Loki/Grafana)
  return JSON.stringify(entry)
}

function createLogger(context?: string) {
  function log(level: LogLevel, message: string, data?: unknown, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    }

    const formatted = formatEntry(entry)

    switch (level) {
      case 'debug': console.debug(formatted); break
      case 'info':  console.info(formatted);  break
      case 'warn':  console.warn(formatted);  break
      case 'error': console.error(formatted); break
    }

    // Di production: kirim ke endpoint logging (opsional)
    if (level === 'error' && process.env.NODE_ENV === 'production') {
      reportToServer(entry).catch(() => {})
    }
  }

  async function reportToServer(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        signal: AbortSignal.timeout(3000),
      })
    } catch {
      // Jangan throw — logging tidak boleh crash app
    }
  }

  return {
    debug: (msg: string, data?: unknown) => log('debug', msg, data),
    info:  (msg: string, data?: unknown) => log('info',  msg, data),
    warn:  (msg: string, data?: unknown) => log('warn',  msg, data),
    error: (msg: string, error?: Error, data?: unknown) => log('error', msg, data, error),
  }
}

// Default logger tanpa context
export const logger = createLogger()

// Logger dengan context spesifik
export { createLogger }

// Helper untuk Next.js API routes
export function logApiError(route: string, error: unknown, req?: { method?: string; url?: string }) {
  const log = createLogger(`API:${route}`)
  const err = error instanceof Error ? error : new Error(String(error))
  log.error(`${req?.method ?? 'UNKNOWN'} ${req?.url ?? route} gagal`, err, {
    route,
    method: req?.method,
  })
}
