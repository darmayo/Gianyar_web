'use client'
import { useState, useEffect, useCallback } from 'react'
import { X, AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react'

export type ToastType = 'darurat' | 'info' | 'sukses' | 'pengumuman'

export interface ToastItem {
  id: string
  type: ToastType
  judul: string
  pesan: string
  durasi?: number // ms, 0 = permanent
}

const STYLE: Record<ToastType, { bg: string; border: string; icon: React.ElementType; iconClass: string }> = {
  darurat:     { bg: 'bg-red-50',    border: 'border-red-400',    icon: AlertTriangle,  iconClass: 'text-red-600' },
  info:        { bg: 'bg-blue-50',   border: 'border-blue-300',   icon: Info,           iconClass: 'text-blue-600' },
  sukses:      { bg: 'bg-green-50',  border: 'border-green-300',  icon: CheckCircle,    iconClass: 'text-green-600' },
  pengumuman:  { bg: 'bg-amber-50',  border: 'border-amber-400',  icon: Bell,           iconClass: 'text-amber-600' },
}

// Contoh pengumuman darurat — di production ini bisa dari API/CMS
const CONTOH_TOASTS: ToastItem[] = [
  {
    id: 'drrt-1',
    type: 'darurat',
    judul: 'Penutupan Jalan Sementara',
    pesan: 'Jl. Raya Ubud ditutup 5–6 Apr 2026 pkl 06.00–22.00 karena Upacara Ngaben Massal.',
    durasi: 0,
  },
]

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>(CONTOH_TOASTS)

  const dismiss = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    toasts.forEach(t => {
      if (t.durasi && t.durasi > 0) {
        const timer = setTimeout(() => dismiss(t.id), t.durasi)
        return () => clearTimeout(timer)
      }
    })
  }, [toasts, dismiss])

  if (toasts.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Notifikasi"
      aria-live="polite"
      className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
    >
      {toasts.map(toast => {
        const s = STYLE[toast.type]
        const Icon = s.icon
        return (
          <div
            key={toast.id}
            role="alert"
            className={`${s.bg} ${s.border} border rounded-2xl p-4 shadow-lg flex items-start gap-3 animate-in slide-in-from-right-4 duration-300`}
          >
            <Icon size={18} className={`${s.iconClass} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm">{toast.judul}</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toast.pesan}</p>
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Tutup notifikasi"
              className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
