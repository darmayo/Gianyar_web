'use client'

import { useCallback, useEffect, useState } from 'react'

type Row = {
  id: string
  nomor_tiket: string
  jenis_layanan: string
  status: string
  prioritas: string
  assigned_name: string | null
  created_at: string
  deadline_at: string
}

type Detail = {
  data: Row & { data_formulir_masked: Record<string, unknown>; rejection_reason?: string; revision_note?: string }
  history: Array<{ id: string; from_status: string | null; to_status: string; note: string | null; created_at: string }>
  comments: Array<{ id: string; comment: string; actor_name: string; created_at: string }>
  documents: Array<{ id: string; original_name: string; mime_type: string; size_bytes: number }>
}

const STATUSES = ['DIAJUKAN', 'MENUNGGU_VERIFIKASI', 'PERLU_REVISI', 'DIPROSES', 'SELESAI', 'DITOLAK']

export function AdminDashboard() {
  const [rows, setRows] = useState<Row[]>([])
  const [detail, setDetail] = useState<Detail | null>(null)
  const [status, setStatus] = useState('')
  const [layanan, setLayanan] = useState('')
  const [comment, setComment] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const qs = new URLSearchParams()
    if (status) qs.set('status', status)
    if (layanan) qs.set('layanan', layanan)
    const res = await fetch(`/api/admin/pengajuan?${qs}`)
    if (res.status === 401) {
      window.location.href = '/admin/login'
      return
    }
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? 'Gagal memuat pengajuan')
    setRows(body.data)
  }, [layanan, status])

  async function open(id: string) {
    const res = await fetch(`/api/admin/pengajuan/${id}`)
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? 'Gagal memuat detail')
    setDetail(body)
    setNewStatus(body.data.status)
  }

  async function update() {
    if (!detail) return
    setError('')
    const res = await fetch(`/api/admin/pengajuan/${detail.data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, internalComment: comment || undefined }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(body.error ?? 'Gagal memperbarui')
      return
    }
    setComment('')
    await open(detail.data.id)
    await load()
  }

  useEffect(() => {
    let active = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load().catch((err) => {
      if (active) setError(err instanceof Error ? err.message : 'Gagal memuat data')
    })
    return () => { active = false }
  }, [load])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Pengajuan</h1>
          <p className="text-sm text-gray-500">Operasional petugas, verifikasi, audit, dan laporan.</p>
        </div>
        <button onClick={() => { window.location.href = '/api/admin/pengajuan?export=csv' }} className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Export CSV</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">Semua status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input value={layanan} onChange={(e) => setLayanan(e.target.value.toUpperCase())} placeholder="Layanan" className="border rounded-lg px-3 py-2 text-sm" />
        <button onClick={() => load().catch((err) => setError(String(err)))} className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm">Filter</button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}

      <div className="grid lg:grid-cols-[1fr_420px] gap-5">
        <div className="border rounded-xl overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left p-3">Tiket</th>
                <th className="text-left p-3">Layanan</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Petugas</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} onClick={() => open(row.id).catch((err) => setError(String(err)))} className="border-t cursor-pointer hover:bg-blue-50">
                  <td className="p-3 font-mono">{row.nomor_tiket}</td>
                  <td className="p-3">{row.jenis_layanan}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3">{row.assigned_name ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="border rounded-xl bg-white p-4 min-h-80">
          {!detail ? (
            <p className="text-sm text-gray-500">Pilih pengajuan untuk melihat detail.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Nomor Tiket</p>
                <p className="font-mono font-bold">{detail.data.nomor_tiket}</p>
              </div>
              <pre className="text-xs bg-gray-50 rounded-lg p-3 overflow-auto max-h-48">{JSON.stringify(detail.data.data_formulir_masked, null, 2)}</pre>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Update Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Catatan internal" className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
              <button onClick={update} className="w-full py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold">Simpan Perubahan</button>
              <div>
                <p className="font-semibold text-sm mb-2">Riwayat</p>
                <ol className="space-y-2 text-xs">
                  {detail.history.map((item) => <li key={item.id}>{item.to_status} - {new Date(item.created_at).toLocaleString('id-ID')}</li>)}
                </ol>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Dokumen</p>
                {detail.documents.length === 0 ? (
                  <p className="text-xs text-gray-500">Belum ada dokumen.</p>
                ) : (
                  <ul className="space-y-2">
                    {detail.documents.map((doc) => (
                      <li key={doc.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate">{doc.original_name} ({doc.mime_type})</span>
                        <button
                          type="button"
                          onClick={() => window.open(`/api/admin/dokumen/${doc.id}`, '_blank', 'noopener,noreferrer')}
                          className="shrink-0 rounded border border-gray-300 px-2 py-1 hover:bg-gray-50"
                        >
                          Unduh
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
