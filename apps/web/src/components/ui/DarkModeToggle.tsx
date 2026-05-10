'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  // Init dari localStorage atau sistem — baca setelah mount (SSR-safe)
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'true' : prefersDark
    document.documentElement.classList.toggle('dark', isDark)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('darkMode', String(next))
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      title={dark ? 'Mode Terang' : 'Mode Gelap'}
      className="flex items-center gap-1 p-2 rounded hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
    >
      {dark
        ? <Sun size={16} className="text-yellow-300" />
        : <Moon size={16} className="text-blue-200" />
      }
    </button>
  )
}
