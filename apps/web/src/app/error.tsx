'use client'
// ============================================================
// Error Boundary — Tangkap runtime error di halaman
// Next.js memanggil ini saat ada uncaught error di route.
// ============================================================
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'
import { logger } from '@/lib/logging/app-logger'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Catat error ke logging system
    logger.error(
      `Runtime error: ${error.message}`,
      error,
      {
        digest: error.digest,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      }
    )
  }, [error])

  const isDev = process.env.NODE_ENV !== 'production'

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Ilustrasi */}
        <div className="relative mb-8 mx-auto w-40 h-40">
          <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full" />
          <div className="absolute inset-4 bg-red-200 dark:bg-red-800/30 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle
              size={64}
              className="text-red-500 dark:text-red-400"
              aria-hidden="true"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mb-4 leading-relaxed">
          Terjadi kesalahan tak terduga pada halaman ini. Tim kami sudah diberitahu.
          Coba muat ulang halaman atau kembali ke beranda.
        </p>

        {/* Detail error — hanya di development */}
        {isDev && (
          <details className="mb-6 text-left bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <summary className="text-sm font-semibold text-red-700 dark:text-red-400 cursor-pointer">
              Detail Error (dev only)
            </summary>
            <div className="mt-3 space-y-1.5">
              <p className="text-xs font-mono text-red-700 dark:text-red-300">
                <strong>Name:</strong> {error.name}
              </p>
              <p className="text-xs font-mono text-red-700 dark:text-red-300 break-all">
                <strong>Message:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-red-600 dark:text-red-400">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
              {error.stack && (
                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40 mt-2 leading-relaxed whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCcw size={18} aria-hidden="true" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <Home size={18} aria-hidden="true" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
