'use client'

import { useState } from 'react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'Login gagal')
      window.location.href = '/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Admin</h1>
      <p className="text-sm text-gray-500 mb-6">Akses petugas, verifikator, auditor, dan admin.</p>
      <form onSubmit={submit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2" autoComplete="username" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-900 text-white rounded-lg py-2.5 font-semibold disabled:opacity-60">
          {loading ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </main>
  )
}
