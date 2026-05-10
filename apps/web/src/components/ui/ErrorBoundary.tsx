'use client'

import React from 'react'
import { createLogger } from '@/lib/logger'

const log = createLogger('ErrorBoundary')

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  context?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    log.error(
      `UI Error${this.props.context ? ` di ${this.props.context}` : ''}`,
      error,
      { componentStack: errorInfo.componentStack }
    )
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role="alert"
          className="p-6 bg-red-50 border border-red-200 rounded-xl text-center"
        >
          <p className="text-red-700 font-semibold mb-1">Terjadi Kesalahan</p>
          <p className="text-sm text-red-500 mb-4">
            Komponen ini tidak dapat ditampilkan. Silakan muat ulang halaman.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="text-left text-xs bg-red-100 p-3 rounded mt-3">
              <summary className="cursor-pointer font-mono text-red-800">
                {this.state.error.name}: {this.state.error.message}
              </summary>
              <pre className="mt-2 overflow-auto text-red-700 whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Muat Ulang
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
