'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, RefreshCw, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  typing?: boolean
}

// Knowledge base chatbot — pertanyaan & jawaban seputar layanan Gianyar
const KB: { triggers: string[]; answer: string }[] = [
  {
    triggers: ['ktp', 'kartu tanda penduduk', 'e-ktp', 'identitas'],
    answer: `**Permohonan KTP Elektronik** dapat dilakukan di Dinas Kependudukan dan Pencatatan Sipil (Dukcapil) Gianyar.\n\n📋 **Syarat:**\n• Fotokopi Kartu Keluarga\n• Surat pengantar RT/RW\n• Foto terbaru 3x4 (2 lembar)\n• KTP lama (jika perpanjangan)\n\n⏱️ **Waktu proses:** 1–3 hari kerja\n📍 **Lokasi:** Jl. Ngurah Rai No. 1, Gianyar\n🕐 **Jam layanan:** Senin–Jumat 08.00–15.00 WITA\n\nAtau ambil antrian digital di [/layanan/antrian](/layanan/antrian).`,
  },
  {
    triggers: ['kartu keluarga', 'kk', 'kepala keluarga'],
    answer: `**Permohonan Kartu Keluarga** bisa diurus di kantor Dukcapil atau online.\n\n📋 **Syarat:**\n• Surat pengantar dari Desa/Kelurahan\n• KK lama (jika perubahan data)\n• Akta Nikah / Akta Kelahiran\n• Fotokopi KTP\n\n⏱️ **Waktu:** 3–5 hari kerja\n📱 **Online:** Bisa via [/layanan/kk](/layanan/kk)`,
  },
  {
    triggers: ['pajak', 'pbb', 'nop', 'sppt', 'tagihan'],
    answer: `**Cek & Bayar Pajak Bumi dan Bangunan (PBB)**\n\nCara cek tagihan:\n1. Kunjungi [/cek-pajak](/cek-pajak)\n2. Masukkan Nomor Objek Pajak (NOP)\n3. Lihat tagihan dan status pembayaran\n\n💳 **Pembayaran:** Bank BPD Bali, transfer online, atau konter pembayaran resmi\n📞 **Info:** BPKAD Gianyar (0361) 943049`,
  },
  {
    triggers: ['pengaduan', 'laporan', 'aduan', 'keluhan', 'komplain'],
    answer: `**Cara Mengajukan Pengaduan**\n\n1. Kunjungi [/pengaduan/buat](/pengaduan/buat)\n2. Isi formulir dengan detail lengkap\n3. Upload foto pendukung (opsional)\n4. Simpan nomor tiket untuk tracking\n\n📊 **Cek status:** [/pengaduan/cek](/pengaduan/cek)\n⏱️ **Respons:** Maksimal 5 hari kerja\n📞 **Darurat:** (0361) 943049`,
  },
  {
    triggers: ['antrian', 'nomor antrian', 'ambil antrian', 'queue', 'antre'],
    answer: `**Antrian Digital Dukcapil Gianyar**\n\nCara ambil nomor:\n1. Buka [/layanan/antrian](/layanan/antrian)\n2. Pilih jenis layanan\n3. Pilih tanggal & waktu\n4. Simpan kode tiket Anda\n\n✅ Tidak perlu antre fisik sejak pagi!\n📱 Cukup datang 15 menit sebelum jadwal.`,
  },
  {
    triggers: ['pariwisata', 'wisata', 'ubud', 'destinasi', 'tegalalang'],
    answer: `**Destinasi Wisata Unggulan Gianyar:**\n\n🌿 Tegalalang Rice Terrace — Sawah terasering ikonik\n🐒 Ubud Monkey Forest — Hutan kera suci\n💧 Pura Tirta Empul — Mata air suci\n🏛️ Goa Gajah — Situs arkeologi abad ke-11\n🛍️ Pasar Seni Sukawati — Belanja kerajinan\n\n📅 Jadwal event: [/pariwisata](/pariwisata)\n📞 Dinas Pariwisata: (0361) 943020`,
  },
  {
    triggers: ['darurat', 'emergency', 'ambulans', 'polisi', 'kebakaran', 'bencana'],
    answer: `🚨 **Nomor Darurat Gianyar:**\n\n🚔 **Polisi:** 110\n🚑 **Ambulans/Gawat Darurat:** 119\n🚒 **Pemadam Kebakaran:** 113\n🆘 **BPBD Gianyar:** (0361) 943049\n🏥 **RSUD Sanjiwani:** (0361) 943020\n⚡ **PLN Gianyar:** 123\n\n📍 Halaman darurat lengkap: [/darurat](/darurat)`,
  },
  {
    triggers: ['puskesmas', 'kesehatan', 'rumah sakit', 'rs', 'dokter', 'rsud'],
    answer: `**Fasilitas Kesehatan Kabupaten Gianyar:**\n\n🏥 **RSUD Sanjiwani** — RS utama Gianyar\n📞 (0361) 943020 | IGD 24 jam\n\n🏥 **Puskesmas:** Gianyar, Ubud, Tegallalang, Tampaksiring, Sukawati, Blahbatuh, Payangan\n\n🩸 **PMI Gianyar:** (0361) 943049\n\nCek ketersediaan tempat tidur & stok darah: [/kesehatan](/kesehatan)`,
  },
  {
    triggers: ['lowongan', 'kerja', 'cpns', 'pppk', 'asn', 'loker'],
    answer: `**Informasi Lowongan Kerja & Karier:**\n\n💼 Lowongan swasta area Gianyar: [/lowongan](/lowongan)\n🏛️ CPNS & PPPK Pemkab Gianyar: [/karier](/karier)\n\n📋 Pengumuman rekrutmen diumumkan di:\n• Papan pengumuman Pemkab Gianyar\n• Website resmi gianyarkab.go.id\n• Portal SSCASN (sscasn.bkn.go.id)`,
  },
  {
    triggers: ['investasi', 'bisnis', 'modal', 'umkm', 'usaha', 'perizinan'],
    answer: `**Investasi & Bisnis di Gianyar:**\n\nGianyar menawarkan peluang investasi di sektor:\n🌴 Pariwisata & Hospitality (ROI 18–25%)\n🎨 Industri Kreatif & Seni\n🌾 Agrowisata & Pertanian Organik\n\n📋 Perizinan via OSS: [oss.go.id](https://oss.go.id)\n📊 Info lengkap: [/investasi](/investasi)`,
  },
  {
    triggers: ['salam', 'halo', 'hai', 'hello', 'hi', 'selamat'],
    answer: `Halo! Saya **Asisten Digital Gianyar** 🏝️\n\nSaya bisa membantu Anda dengan informasi tentang:\n• Layanan kependudukan (KTP, KK, Akta)\n• Pajak PBB & pembayaran\n• Pengaduan & laporan\n• Pariwisata Gianyar\n• Kesehatan & fasilitas publik\n• Investasi & usaha\n• Nomor darurat\n\nSilakan ketik pertanyaan Anda!`,
  },
]

const SARAN_PERTANYAAN = [
  'Bagaimana cara membuat KTP?',
  'Di mana cek tagihan pajak PBB?',
  'Nomor darurat Gianyar apa saja?',
  'Destinasi wisata terbaik di Gianyar?',
  'Cara mengajukan pengaduan?',
]

function findAnswer(query: string): string {
  const q = query.toLowerCase()
  for (const item of KB) {
    if (item.triggers.some(t => q.includes(t))) {
      return item.answer
    }
  }
  return `Maaf, saya belum memiliki informasi spesifik tentang "${query}".\n\nCoba tanyakan tentang:\n• Layanan KTP, KK, atau kependudukan\n• Pajak PBB\n• Pengaduan masyarakat\n• Pariwisata Gianyar\n• Fasilitas kesehatan\n• Nomor darurat\n\nAtau hubungi langsung: **📞 (0361) 943049** atau via [WhatsApp](/)`
}

function renderMarkdown(text: string) {
  // Simple markdown rendering
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold mb-1">{line.slice(2, -2)}</p>
      }
      if (line.startsWith('• ')) {
        return <p key={i} className="ml-3">• {line.slice(2)}</p>
      }
      if (line.match(/^\d\./)) {
        return <p key={i} className="ml-3">{line}</p>
      }
      if (line === '') return <br key={i} />
      // Handle inline bold
      const parts = line.split(/\*\*([^*]+)\*\*/)
      return (
        <p key={i} className="leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      )
    })
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Halo! Saya **Asisten Digital Gianyar** 🏝️\n\nSaya bisa membantu Anda dengan informasi layanan pemerintah Kabupaten Gianyar. Ketik pertanyaan Anda atau pilih topik di bawah!`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const query = (text ?? input).trim()
    if (!query || loading) return

    // eslint-disable-next-line react-hooks/purity
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query }
    const typingMsg: Message = { id: 'typing', role: 'assistant', content: '', typing: true }

    setMessages(p => [...p, userMsg, typingMsg])
    setInput('')
    setLoading(true)

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800))

    const answer = findAnswer(query)

    // Simulate streaming — reveal text char by char
    setMessages(p => p.filter(m => m.id !== 'typing').concat({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      typing: true,
    }))

    let revealed = ''
    const chars = answer.split('')
    for (let i = 0; i < chars.length; i++) {
      revealed += chars[i]
      const snap = revealed
      setMessages(p => p.map(m => m.typing ? { ...m, content: snap } : m))
      if (i % 3 === 0) await new Promise(r => setTimeout(r, 8))
    }

    setMessages(p => p.map(m => m.typing ? { ...m, typing: false } : m))
    setLoading(false)
  }

  function reset() {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: `Halo! Saya **Asisten Digital Gianyar** 🏝️\n\nSaya bisa membantu Anda dengan informasi layanan pemerintah Kabupaten Gianyar. Ketik pertanyaan Anda atau pilih topik di bawah!`,
    }])
    setInput('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot size={22} className="text-blue-700" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 flex items-center gap-2">
              Asisten Digital Gianyar
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} /> Beta
              </span>
            </h1>
            <p className="text-xs text-gray-400">Tanya apa saja tentang layanan Kabupaten Gianyar</p>
          </div>
        </div>
        <button onClick={reset} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400" title="Reset percakapan">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700 mb-4 flex items-start gap-2">
        <Sparkles size={12} className="flex-shrink-0 mt-0.5" />
        Ini adalah chatbot berbasis aturan (rule-based). Untuk info kompleks, hubungi petugas langsung.
      </div>

      {/* Chat area */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="h-[420px] overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${msg.role === 'user' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                {msg.role === 'user'
                  ? <User size={14} className="text-white" />
                  : <Bot size={14} className="text-blue-700" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-blue-900 text-white rounded-tr-sm'
                  : 'bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100'}`}>
                {msg.role === 'assistant'
                  ? <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                  : msg.content}
                {msg.typing && msg.content === '' && (
                  <span className="inline-flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Saran pertanyaan */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {SARAN_PERTANYAAN.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full transition">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ketik pertanyaan Anda..."
            disabled={loading}
            className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="w-10 h-10 bg-blue-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-800 disabled:opacity-40 transition flex-shrink-0">
            <Send size={16} />
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-gray-400">
        Asisten ini menggunakan data layanan resmi Pemkab Gianyar.
        Untuk keperluan hukum, gunakan kanal resmi.
      </p>
    </div>
  )
}
