// ============================================================
// Server Logger — Tulis log ke file (Node.js only)
// JANGAN import di Client Components — hanya untuk API Routes,
// Server Components, dan middleware.
//
// Log disimpan di: /tmp/gianyar-logs/ (dev)
// Format file    : errors-YYYY-MM-DD.jsonl (1 entry per baris)
// ============================================================

import type { LogEntry } from './app-logger'

const LOG_DIR = process.env.LOG_DIR ?? '/tmp/gianyar-logs'
const MAX_FILE_SIZE_MB = Number(process.env.LOG_MAX_FILE_MB ?? '5')
const MAX_LOG_LINE_BYTES = 4096

function getLogPath(type: 'error' | 'access' | 'all') {
  const date = new Date().toISOString().slice(0, 10)
  return `${LOG_DIR}/${type}-${date}.jsonl`
}

/**
 * Tulis entry log ke file JSONL (JSON Lines).
 * Aman dipanggil berkali-kali — berhenti menulis saat file harian mencapai batas.
 */
export async function writeLog(entry: LogEntry): Promise<void> {
  // Hanya jalan di Node.js (server side)
  if (typeof process === 'undefined' || typeof require === 'undefined') return

  try {
    const fs = await import('fs/promises')

    // Buat direktori jika belum ada
    await fs.mkdir(LOG_DIR, { recursive: true })

    const type = entry.level === 'error' ? 'error' : 'all'
    const filePath = getLogPath(type)
    let line = JSON.stringify(entry) + '\n'
    if (Buffer.byteLength(line, 'utf8') > MAX_LOG_LINE_BYTES) {
      line = JSON.stringify({
        level: entry.level,
        message: entry.message.slice(0, 500),
        timestamp: entry.timestamp,
        context: entry.context,
        url: entry.url?.slice(0, 300),
        data: '[truncated]',
        error: entry.error
          ? {
              name: entry.error.name.slice(0, 100),
              message: entry.error.message.slice(0, 500),
            }
          : undefined,
      }) + '\n'
    }

    // Cegah disk flooding: jangan buat file/rotasi tanpa batas.
    try {
      const stats = await fs.stat(filePath)
      if (stats.size + Buffer.byteLength(line, 'utf8') > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return
      }
    } catch {
      // File belum ada — tidak apa-apa
    }

    await fs.appendFile(filePath, line, 'utf8')
  } catch {
    // Jangan crash app karena logging gagal
  }
}

/**
 * Baca log error terbaru dari file.
 * Dipakai oleh /api/errors untuk menampilkan dashboard.
 */
export async function readRecentErrors(maxLines = 100): Promise<LogEntry[]> {
  try {
    const fs = await import('fs/promises')

    const filePath = getLogPath('error')
    let content: string
    try {
      content = await fs.readFile(filePath, 'utf8')
    } catch {
      // Coba hari sebelumnya
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      try {
        content = await fs.readFile(`${LOG_DIR}/error-${yesterday}.jsonl`, 'utf8')
      } catch {
        return []
      }
    }

    const lines = content.trim().split('\n').filter(Boolean)
    const recent = lines.slice(-maxLines)

    return recent
      .map(line => {
        try { return JSON.parse(line) as LogEntry } catch { return null }
      })
      .filter((e): e is LogEntry => e !== null)
      .reverse() // terbaru di atas
  } catch {
    return []
  }
}

/**
 * Baca log akses (semua level) terbaru.
 */
export async function readRecentLogs(maxLines = 200): Promise<LogEntry[]> {
  try {
    const fs = await import('fs/promises')
    const filePath = getLogPath('all')
    const content = await fs.readFile(filePath, 'utf8')
    const lines = content.trim().split('\n').filter(Boolean)
    return lines
      .slice(-maxLines)
      .map(line => {
        try { return JSON.parse(line) as LogEntry } catch { return null }
      })
      .filter((e): e is LogEntry => e !== null)
      .reverse()
  } catch {
    return []
  }
}

/**
 * Hitung statistik error hari ini.
 */
export async function getErrorStats(): Promise<{
  total: number
  byLevel: Record<string, number>
  byContext: Record<string, number>
  recent: LogEntry[]
}> {
  const logs = await readRecentLogs(500)
  const byLevel: Record<string, number> = {}
  const byContext: Record<string, number> = {}

  for (const entry of logs) {
    byLevel[entry.level] = (byLevel[entry.level] ?? 0) + 1
    if (entry.context) {
      byContext[entry.context] = (byContext[entry.context] ?? 0) + 1
    }
  }

  return {
    total: logs.length,
    byLevel,
    byContext,
    recent: logs.slice(0, 20),
  }
}
