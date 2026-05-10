'use client'
import { useState } from 'react'
import { Star, Bell, FileText, CreditCard, CheckCircle, Clock, AlertCircle, ChevronRight, X, LogIn } from 'lucide-react'

const MOCK_USER = { nama:'I Made Surya', email:'made.surya@gmail.com', nik:'3104××××××××××01', noHp:'0812-XXXX-XXXX', kecamatan:'Ubud' }

const LAYANAN = [
  { tiket:'KTP-2026-112233', jenis:'KTP Elektronik', status:'SELESAI', tanggal:'15 Mar 2026', catatan:'KTP siap diambil di loket Dukcapil Gianyar' },
  { tiket:'KK-2026-445566', jenis:'Kartu Keluarga', status:'DIPROSES', tanggal:'28 Mar 2026', catatan:'Sedang diverifikasi petugas' },
  { tiket:'ADU-2026-778899', jenis:'Pengaduan Infrastruktur', status:'DIVERIFIKASI', tanggal:'1 Apr 2026', catatan:'Lapangan sudah dikonfirmasi' },
]

const PAJAK = [
  { objek:'Rumah tinggal, Ubud', tahun:2026, tagihan:312000, status:'BELUM_BAYAR', jatuhTempo:'31 Agt 2026' },
  { objek:'Rumah tinggal, Ubud', tahun:2025, tagihan:298000, status:'LUNAS', tanggalBayar:'12 Jul 2025' },
  { objek:'Rumah tinggal, Ubud', tahun:2024, tagihan:287000, status:'LUNAS', tanggalBayar:'20 Jun 2024' },
]

const NOTIF_AWAL = [
  { id:1, ikon:'⏰', judul:'Jatuh Tempo Pajak PBB 2026', isi:'Tagihan PBB Anda sebesar Rp 312.000 jatuh tempo 31 Agustus 2026.', waktu:'2 jam lalu', dibaca:false, aksi:{ label:'Cek Pajak', href:'/cek-pajak' } },
  { id:2, ikon:'📋', judul:'KTP Elektronik Selesai', isi:'KTP Anda (KTP-2026-112233) sudah selesai dan siap diambil di Dukcapil Gianyar.', waktu:'1 hari lalu', dibaca:false, aksi:{ label:'Detail', href:'/pengaduan/cek' } },
  { id:3, ikon:'💉', judul:'Jadwal Vaksinasi di Puskesmas Ubud', isi:'Posyandu & vaksinasi Polio untuk anak 0–5 tahun: 15 April 2026 pukul 08.00–12.00 WITA.', waktu:'3 hari lalu', dibaca:true, aksi:null },
  { id:4, ikon:'📢', judul:'Operasi Pasar Murah Kec. Ubud', isi:'Operasi pasar murah Ramadan digelar 10 April 2026 di Lapangan Ubud.', waktu:'5 hari lalu', dibaca:true, aksi:null },
]

const STATUS_COLOR: Record<string,string> = {
  SELESAI:'bg-green-100 text-green-700', DIPROSES:'bg-blue-100 text-blue-700',
  DIVERIFIKASI:'bg-amber-100 text-amber-700', PENDING:'bg-gray-100 text-gray-600',
}
const STATUS_ICON: Record<string, React.ElementType> = {
  SELESAI: CheckCircle, DIPROSES: Clock, DIVERIFIKASI: Clock, PENDING: AlertCircle,
}

function fmt(n: number) { return `Rp ${n.toLocaleString('id-ID')}` }

export default function ProfilAkunPage() {
  const [tab, setTab] = useState<'layanan'|'pajak'|'notif'>('layanan')
  const [notifs, setNotifs] = useState(NOTIF_AWAL)
  const [ikmRating, setIkmRating] = useState(0)
  const [ikmHover, setIkmHover] = useState(0)
  const [ikmDone, setIkmDone] = useState(false)
  const unread = notifs.filter(n => !n.dibaca).length

  function hapus(id: number) { setNotifs(p => p.filter(n => n.id !== id)) }
  function baca(id: number) { setNotifs(p => p.map(n => n.id===id ? {...n, dibaca:true} : n)) }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-800 rounded-full flex items-center justify-center text-xl font-black flex-shrink-0">
          {MOCK_USER.nama.split(' ').map(w=>w[0]).slice(0,2).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-lg">{MOCK_USER.nama}</p>
            <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full font-semibold">✓ Terverifikasi</span>
          </div>
          <p className="text-blue-300 text-sm">{MOCK_USER.email}</p>
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-blue-300">
            <span>NIK: {MOCK_USER.nik}</span>
            <span>Kec. {MOCK_USER.kecamatan}</span>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <button onClick={() => setTab('notif')} className="p-2.5 bg-blue-800 hover:bg-blue-700 rounded-xl transition" aria-label="Notifikasi">
            <Bell size={20} />
          </button>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">{unread}</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {[
          { key:'layanan', label:'Layanan Saya', icon:FileText },
          { key:'pajak', label:'Riwayat Pajak', icon:CreditCard },
          { key:'notif', label: unread > 0 ? `Notifikasi (${unread})` : 'Notifikasi', icon:Bell },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition
              ${tab===t.key ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Layanan */}
      {tab === 'layanan' && (
        <div className="space-y-3">
          {LAYANAN.map(l => {
            const Icon = STATUS_ICON[l.status] ?? Clock
            return (
              <div key={l.tiket} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${STATUS_COLOR[l.status]}`}>
                      <Icon size={10} />{l.status}
                    </span>
                    <h3 className="font-semibold text-gray-800 mt-1">{l.jenis}</h3>
                  </div>
                  <span className="font-mono text-xs text-gray-400">{l.tiket}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{l.catatan}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Diajukan: {l.tanggal}</span>
                  <a href="/pengaduan/cek" className="text-blue-600 hover:underline flex items-center gap-0.5 font-medium">
                    Cek Status <ChevronRight size={11} />
                  </a>
                </div>
              </div>
            )
          })}
          <a href="/layanan/formulir"
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-blue-200 text-blue-700 rounded-2xl text-sm hover:bg-blue-50 transition font-medium">
            + Ajukan Layanan Baru
          </a>
        </div>
      )}

      {/* Tab Pajak */}
      {tab === 'pajak' && (
        <div className="space-y-3">
          {PAJAK.map((p, i) => (
            <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border ${p.status==='BELUM_BAYAR'?'border-amber-200':'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status==='LUNAS'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>
                    {p.status==='LUNAS' ? '✓ LUNAS' : '⚠ BELUM BAYAR'}
                  </span>
                  <h3 className="font-semibold text-gray-800 mt-1">PBB Tahun {p.tahun}</h3>
                  <p className="text-xs text-gray-400">{p.objek}</p>
                </div>
                <p className={`text-xl font-black ${p.status==='BELUM_BAYAR'?'text-amber-600':'text-gray-700'}`}>{fmt(p.tagihan)}</p>
              </div>
              {p.status==='BELUM_BAYAR' ? (
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs text-amber-600">Jatuh tempo: {p.jatuhTempo}</p>
                  <a href="/cek-pajak" className="text-xs bg-amber-500 text-white px-4 py-1.5 rounded-xl hover:bg-amber-400 transition font-medium">Bayar Sekarang</a>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Dibayar: {(p as {tanggalBayar?: string}).tanggalBayar}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab Notifikasi */}
      {tab === 'notif' && (
        <div className="space-y-3">
          {notifs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bell size={36} className="mx-auto mb-2 opacity-30" />
              <p>Tidak ada notifikasi</p>
            </div>
          ) : notifs.map(n => (
            <div key={n.id} onClick={() => baca(n.id)}
              className={`border rounded-2xl p-4 shadow-sm cursor-pointer transition hover:shadow-md
                ${!n.dibaca ? 'border-blue-200 bg-blue-50/40' : 'border-gray-100 bg-white'}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{n.ikon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!n.dibaca?'text-blue-900':'text-gray-800'}`}>{n.judul}</p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!n.dibaca && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                      <button onClick={e=>{e.stopPropagation();hapus(n.id)}} className="text-gray-300 hover:text-gray-500 transition" aria-label="Hapus">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.isi}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-400">{n.waktu}</span>
                    {n.aksi && (
                      <a href={n.aksi.href} onClick={e=>e.stopPropagation()}
                        className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-0.5">
                        {n.aksi.label} <ChevronRight size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {notifs.some(n=>n.dibaca) && (
            <button onClick={() => setNotifs(p => p.filter(n => !n.dibaca))}
              className="text-xs text-gray-400 hover:text-red-500 transition w-full text-center py-2">
              Hapus semua yang sudah dibaca
            </button>
          )}
        </div>
      )}

      {/* IKM */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h2 className="font-bold text-amber-800 mb-1 flex items-center gap-2"><Star size={16}/> Indeks Kepuasan Masyarakat</h2>
        {ikmDone ? (
          <p className="text-green-700 font-semibold text-sm">Terima kasih! Penilaian {ikmRating}/5 bintang telah dikirim.</p>
        ) : (
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button"
                onClick={() => { setIkmRating(s); setIkmDone(true) }}
                onMouseEnter={() => setIkmHover(s)} onMouseLeave={() => setIkmHover(0)}
                className="focus:outline-none transition-transform hover:scale-110" aria-label={`${s} bintang`}>
                <Star size={28} fill={(ikmHover||ikmRating)>=s?'#f59e0b':'none'}
                  className={(ikmHover||ikmRating)>=s?'text-amber-400':'text-gray-300'} />
              </button>
            ))}
            <span className="text-sm text-amber-700 ml-1">{ikmHover ? `${ikmHover}/5` : 'Seberapa puas Anda?'}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs text-gray-400">Login dengan Google / NIK akan tersedia segera</p>
        <button className="flex items-center gap-2 text-xs text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
          <LogIn size={14} /> Masuk / Daftar
        </button>
      </div>
    </div>
  )
}
