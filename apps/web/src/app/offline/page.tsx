'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">📡</div>
      <h1 className="text-3xl font-bold mb-3">Tidak Ada Koneksi Internet</h1>
      <p className="text-blue-200 mb-8 max-w-sm">
        Anda sedang offline. Berikut nomor darurat yang bisa dihubungi:
      </p>

      <div className="grid sm:grid-cols-2 gap-3 w-full max-w-md mb-8">
        {[
          { nama: 'Polisi', nomor: '110', icon: '🚔' },
          { nama: 'Ambulans / 119', nomor: '119', icon: '🚑' },
          { nama: 'Pemadam Kebakaran', nomor: '113', icon: '🚒' },
          { nama: 'BPBD Gianyar', nomor: '(0361) 943049', icon: '🆘' },
          { nama: 'RSUD Sanjiwani', nomor: '(0361) 943020', icon: '🏥' },
          { nama: 'PLN 123', nomor: '123', icon: '⚡' },
        ].map((k) => (
          <a key={k.nama} href={`tel:${k.nomor.replace(/[^0-9]/g, '')}`}
            className="bg-blue-800 hover:bg-blue-700 rounded-xl p-4 flex items-center gap-3 transition">
            <span className="text-2xl">{k.icon}</span>
            <div className="text-left">
              <p className="font-semibold text-sm">{k.nama}</p>
              <p className="text-blue-300 font-bold">{k.nomor}</p>
            </div>
          </a>
        ))}
      </div>

      <button onClick={() => window.location.reload()}
        className="bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition">
        Coba Lagi
      </button>
      <p className="text-blue-400 text-xs mt-4">Portal Resmi Pemerintah Kabupaten Gianyar</p>
    </div>
  )
}
