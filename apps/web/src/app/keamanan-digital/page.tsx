'use client'
import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Smartphone, Mail, Wifi, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const TIPS = [
  {
    kategori: 'Kata Sandi & Akun',
    icon: Lock,
    warna: 'blue',
    tips: [
      { judul: 'Gunakan kata sandi panjang & unik', detail: 'Minimal 12 karakter. Kombinasikan huruf besar, kecil, angka, dan simbol. Jangan gunakan tanggal lahir atau nama keluarga.', level: 'DASAR' },
      { judul: 'Aktifkan autentikasi dua faktor (2FA)', detail: 'Tambahkan lapisan keamanan ekstra. Gunakan aplikasi authenticator (Google Authenticator/Authy) daripada SMS bila memungkinkan.', level: 'PENTING' },
      { judul: 'Jangan pakai kata sandi yang sama', detail: 'Jika satu akun bocor, akun lain ikut terancam. Gunakan password manager seperti Bitwarden (gratis) untuk menyimpan kata sandi unik setiap akun.', level: 'PENTING' },
      { judul: 'Keluar dari akun di perangkat bersama', detail: 'Setelah menggunakan komputer publik (warnet, kantor), selalu logout dan hapus riwayat browser.', level: 'DASAR' },
    ],
  },
  {
    kategori: 'Phishing & Penipuan Online',
    icon: Mail,
    warna: 'red',
    tips: [
      { judul: 'Waspada link mencurigakan di WhatsApp/SMS', detail: 'Penipu sering kirim link "Anda menang hadiah" atau "Akun Anda diblokir". Jangan klik sebelum verifikasi ke sumber resmi.', level: 'KRITIS' },
      { judul: 'Cek alamat website dengan teliti', detail: 'Situs palsu pakai domain mirip: "gianyarkab.go.id.com" atau "g0vernment.id". Pastikan ada HTTPS dan domain resmi .go.id.', level: 'PENTING' },
      { judul: 'Jangan berikan OTP ke siapapun', detail: 'Bank, pemerintah, atau platform resmi TIDAK PERNAH meminta kode OTP Anda lewat telepon atau chat.', level: 'KRITIS' },
      { judul: 'Verifikasi identitas penelepon', detail: 'Jika ada yang mengaku petugas dan minta data pribadi, tutup telepon dan hubungi nomor resmi lembaga tersebut.', level: 'PENTING' },
    ],
  },
  {
    kategori: 'Media Sosial & Privasi',
    icon: Eye,
    warna: 'purple',
    tips: [
      { judul: 'Batasi informasi pribadi di media sosial', detail: 'Tanggal lahir, alamat rumah, nomor HP, dan foto KTP di medsos adalah target empuk penipu identitas.', level: 'PENTING' },
      { judul: 'Review pengaturan privasi secara berkala', detail: 'Periksa siapa saja yang bisa melihat postingan, foto, dan informasi profil Anda. Set ke "Teman" atau "Hanya saya" untuk data sensitif.', level: 'DASAR' },
      { judul: 'Hati-hati kuis/games online', detail: '"Kuis nama panggilan masa kecil" sering digunakan untuk mencuri data yang biasa dijadikan pertanyaan keamanan akun.', level: 'PENTING' },
    ],
  },
  {
    kategori: 'Perangkat & Jaringan',
    icon: Smartphone,
    warna: 'green',
    tips: [
      { judul: 'Update sistem operasi & aplikasi rutin', detail: 'Update bukan hanya fitur baru — sebagian besar berisi patch keamanan untuk celah yang sudah ditemukan hacker.', level: 'PENTING' },
      { judul: 'Hindari WiFi publik untuk transaksi penting', detail: 'WiFi kafe, mall, atau hotel bisa diintai. Jika terpaksa, gunakan VPN terpercaya atau gunakan data seluler untuk internet banking.', level: 'PENTING' },
      { judul: 'Backup data secara rutin', detail: 'Ransomware bisa mengenkripsi semua file Anda. Backup ke cloud (Google Drive/iCloud) dan hard disk eksternal secara rutin.', level: 'DASAR' },
      { judul: 'Pasang antivirus di perangkat', detail: 'Di Android, hindari install APK dari luar Play Store. Di Windows, Windows Defender sudah cukup — pastikan selalu aktif.', level: 'DASAR' },
    ],
  },
  {
    kategori: 'WiFi & Internet',
    icon: Wifi,
    warna: 'cyan',
    tips: [
      { judul: 'Ganti password WiFi rumah secara berkala', detail: 'Gunakan enkripsi WPA3 atau minimal WPA2. Hindari nama jaringan (SSID) yang menyebut nama atau alamat Anda.', level: 'DASAR' },
      { judul: 'Nonaktifkan fitur yang tidak dipakai', detail: 'Bluetooth, NFC, dan lokasi yang dibiarkan aktif terus bisa menjadi celah. Matikan saat tidak digunakan.', level: 'DASAR' },
    ],
  },
]

const LEVEL_COLOR: Record<string, string> = {
  KRITIS: 'bg-red-100 text-red-700',
  PENTING: 'bg-amber-100 text-amber-700',
  DASAR: 'bg-blue-100 text-blue-700',
}

const WARNA_MAP: Record<string, { border: string, bg: string, icon: string, badge: string }> = {
  blue:   { border: 'border-blue-200',   bg: 'bg-blue-50',   icon: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700' },
  red:    { border: 'border-red-200',    bg: 'bg-red-50',    icon: 'text-red-700',    badge: 'bg-red-100 text-red-700' },
  purple: { border: 'border-purple-200', bg: 'bg-purple-50', icon: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  green:  { border: 'border-green-200',  bg: 'bg-green-50',  icon: 'text-green-700',  badge: 'bg-green-100 text-green-700' },
  cyan:   { border: 'border-cyan-200',   bg: 'bg-cyan-50',   icon: 'text-cyan-700',   badge: 'bg-cyan-100 text-cyan-700' },
}

export default function KeamananDigitalPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setExpanded(p => ({ ...p, [key]: !p[key] }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield size={24} className="text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panduan Keamanan Digital</h1>
          <p className="text-sm text-gray-500">Cyber Hygiene untuk warga Kabupaten Gianyar</p>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 my-6 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-800">Waspada Penipuan Digital!</p>
          <p className="text-sm text-amber-700">Jumlah kasus phishing, penipuan belanja online, dan kejahatan siber terus meningkat. Lindungi diri Anda dengan memahami langkah-langkah keamanan digital berikut.</p>
        </div>
      </div>

      {/* Level legend */}
      <div className="flex flex-wrap gap-3 mb-6 text-xs">
        <span className="font-semibold text-gray-500">Tingkat prioritas:</span>
        {Object.entries(LEVEL_COLOR).map(([k, v]) => (
          <span key={k} className={`px-2 py-0.5 rounded-full font-bold ${v}`}>{k}</span>
        ))}
      </div>

      {/* Tips by category */}
      <div className="space-y-4 mb-10">
        {TIPS.map(kategori => {
          const Icon = kategori.icon
          const warna = WARNA_MAP[kategori.warna]
          const isOpen = expanded[kategori.kategori] !== false // default open

          return (
            <div key={kategori.kategori} className={`border rounded-2xl overflow-hidden ${warna.border}`}>
              <button
                onClick={() => toggle(kategori.kategori)}
                className={`w-full flex items-center justify-between p-4 ${warna.bg} hover:brightness-95 transition text-left`}>
                <div className="flex items-center gap-3">
                  <Icon size={20} className={warna.icon} />
                  <h2 className="font-bold text-gray-800">{kategori.kategori}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${warna.badge}`}>{kategori.tips.length} tips</span>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>

              {isOpen && (
                <div className="divide-y divide-gray-100 bg-white">
                  {kategori.tips.map((tip, i) => (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle size={16} className={`${warna.icon} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-gray-800 text-sm">{tip.judul}</h3>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${LEVEL_COLOR[tip.level]}`}>{tip.level}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{tip.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Nomor darurat siber */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Shield size={20} /> Laporkan Kejahatan Siber
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { nama: 'BSSN (Badan Siber)', kontak: '021-2798-0101', sub: 'Insiden siber nasional' },
            { nama: 'Bareskrim Polri', kontak: '021-7218-485', sub: 'Penipuan & kejahatan digital' },
            { nama: 'Kominfo Aduan', kontak: 'aduankonten.id', sub: 'Konten negatif & hoaks' },
          ].map(k => (
            <div key={k.nama} className="bg-blue-800 rounded-xl p-3">
              <p className="font-semibold text-sm">{k.nama}</p>
              <p className="text-blue-200 text-xs">{k.sub}</p>
              <p className="text-yellow-300 font-bold mt-1">{k.kontak}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="grid sm:grid-cols-2 gap-3">
        <a href="/bug-bounty" className="flex items-center gap-3 bg-white border border-purple-200 rounded-xl p-4 hover:shadow-md transition group">
          <Shield size={20} className="text-purple-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 group-hover:text-purple-700 text-sm">Temukan celah keamanan portal?</p>
            <p className="text-xs text-gray-400">Laporkan lewat Program Bug Bounty kami</p>
          </div>
          <ExternalLink size={14} className="ml-auto text-gray-300" />
        </a>
        <a href="/bug-bounty#breach" className="flex items-center gap-3 bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition group">
          <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 group-hover:text-red-700 text-sm">Cek Kebocoran Data</p>
            <p className="text-xs text-gray-400">Periksa apakah email Anda terdampak</p>
          </div>
          <ExternalLink size={14} className="ml-auto text-gray-300" />
        </a>
      </div>
    </div>
  )
}
