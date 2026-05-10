'use client'
import { useState } from 'react'
import { Vote, Star, ChevronRight, CheckCircle, MessageSquare, BarChart2 } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const POLLING = [
  {
    id: 1,
    pertanyaan: 'Infrastruktur mana yang paling perlu ditingkatkan di Gianyar?',
    pertanyaanEn: 'Which infrastructure needs improvement most in Gianyar?',
    opsi: [
      { teks: 'Jalan & Jembatan', teksEn: 'Roads & Bridges', suara: 842 },
      { teks: 'Drainase & Sanitasi', teksEn: 'Drainage & Sanitation', suara: 634 },
      { teks: 'Transportasi Umum', teksEn: 'Public Transportation', suara: 421 },
      { teks: 'Fasilitas Publik (Taman, RTH)', teksEn: 'Public Facilities (Parks, Green Space)', suara: 287 },
    ],
    deadline: '30 April 2026',
    total: 2184,
    kategori: 'Infrastruktur',
    kategoriEn: 'Infrastructure',
  },
  {
    id: 2,
    pertanyaan: 'Layanan digital mana yang ingin Anda lihat di portal ini?',
    pertanyaanEn: 'Which digital service would you like to see on this portal?',
    opsi: [
      { teks: 'Pembayaran pajak online', teksEn: 'Online tax payment', suara: 1203 },
      { teks: 'Surat keterangan digital', teksEn: 'Digital official letters', suara: 956 },
      { teks: 'Pelacakan izin usaha', teksEn: 'Business permit tracking', suara: 721 },
      { teks: 'Konsultasi hukum online', teksEn: 'Online legal consultation', suara: 445 },
    ],
    deadline: '15 Mei 2026',
    total: 3325,
    kategori: 'Layanan Digital',
    kategoriEn: 'Digital Services',
  },
]

const IKM_ASPEK = [
  { aspek: 'Kemudahan Penggunaan Portal', aspekEn: 'Portal Ease of Use', label: 'Sangat Mudah' },
  { aspek: 'Kecepatan Respons Layanan', aspekEn: 'Service Response Speed', label: 'Responsif' },
  { aspek: 'Kejelasan Informasi', aspekEn: 'Information Clarity', label: 'Jelas' },
  { aspek: 'Kepuasan Keseluruhan', aspekEn: 'Overall Satisfaction', label: 'Puas' },
]

export default function PartisipasiPage() {
  const { t } = useLang()
  const [voted, setVoted] = useState<Record<number, number>>({})
  const [ikmRating, setIkmRating] = useState<Record<string, number>>({})
  const [ikmHover, setIkmHover] = useState<Record<string, number>>({})
  const [ikmSubmitted, setIkmSubmitted] = useState(false)
  const [aspirasiForm, setAspirasiForm] = useState({ topik:'', isi:'', nama:'' })
  const [aspirasiSubmitted, setAspirasiSubmitted] = useState(false)

  function handleVote(pollId: number, opsiIdx: number) {
    if (voted[pollId] !== undefined) return
    setVoted(p => ({...p, [pollId]: opsiIdx}))
  }

  function submitIkm() {
    if (Object.keys(ikmRating).length < IKM_ASPEK.length) return
    setIkmSubmitted(true)
  }

  async function submitAspirasi(e: React.FormEvent) {
    e.preventDefault()
    if (!aspirasiForm.topik || !aspirasiForm.isi.trim()) return
    setAspirasiSubmitted(true)
  }

  const TOPIK_LIST = [
    { id: 'Infrastruktur', en: 'Infrastructure' },
    { id: 'Pendidikan', en: 'Education' },
    { id: 'Kesehatan', en: 'Health' },
    { id: 'Pariwisata', en: 'Tourism' },
    { id: 'UMKM & Ekonomi', en: 'SMEs & Economy' },
    { id: 'Lingkungan Hidup', en: 'Environment' },
    { id: 'Tata Kelola Pemerintahan', en: 'Government Governance' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
          <Vote size={24} className="text-purple-700 dark:text-purple-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t('Partisipasi Publik', 'Public Participation')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t('Suara Anda penting untuk pembangunan Gianyar yang lebih baik', 'Your voice matters for a better Gianyar')}</p>
        </div>
      </div>

      {/* Polling Aktif */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <BarChart2 size={20} className="text-purple-600 dark:text-purple-400" /> {t('Polling Aktif', 'Active Polls')}
        </h2>
        <div className="space-y-5">
          {POLLING.map(poll => {
            const myVote = voted[poll.id]
            const hasVoted = myVote !== undefined
            const maxSuara = Math.max(...poll.opsi.map(o => o.suara + (hasVoted && poll.opsi.indexOf(o)===myVote ? 1 : 0)))
            return (
              <div key={poll.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold px-2 py-0.5 rounded-full">{t(poll.kategori, poll.kategoriEn)}</span>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 mt-2">{t(poll.pertanyaan, poll.pertanyaanEn)}</h3>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">{t('Berakhir', 'Ends')} {poll.deadline}</span>
                </div>
                <div className="space-y-2">
                  {poll.opsi.map((opsi, idx) => {
                    const suara = opsi.suara + (hasVoted && idx === myVote ? 1 : 0)
                    const pct = hasVoted ? Math.round((suara / (poll.total + 1)) * 100) : 0
                    const isMyVote = hasVoted && idx === myVote
                    return (
                      <button key={idx} onClick={() => handleVote(poll.id, idx)}
                        disabled={hasVoted}
                        className={`w-full text-left rounded-xl border transition overflow-hidden
                          ${isMyVote ? 'border-purple-400' : hasVoted ? 'border-gray-100 dark:border-slate-700' : 'border-gray-200 dark:border-slate-600 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-slate-700'}
                          ${hasVoted ? 'cursor-default' : 'cursor-pointer'}`}>
                        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {isMyVote && <CheckCircle size={14} className="text-purple-600 flex-shrink-0" />}
                            <span className={`text-sm ${isMyVote ? 'font-semibold text-purple-700' : 'text-gray-700 dark:text-slate-300'}`}>{t(opsi.teks, opsi.teksEn)}</span>
                          </div>
                          {hasVoted && <span className="text-xs font-bold text-gray-500 dark:text-slate-400">{pct}%</span>}
                        </div>
                        {hasVoted && (
                          <div className="h-1.5 bg-gray-100 dark:bg-slate-700">
                            <div className={`h-full transition-all duration-500 ${isMyVote ? 'bg-purple-500' : 'bg-blue-300'}`}
                              style={{width:`${(suara/maxSuara)*100}%`}} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">{poll.total.toLocaleString('id-ID')} {t('suara', 'votes')}{hasVoted ? ` · ${t('Anda sudah memilih', 'You have voted')}` : ` · ${t('Pilih untuk melihat hasil', 'Vote to see results')}`}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* IKM Survey */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Star size={20} className="text-amber-500" /> {t('Survei Kepuasan Layanan (IKM)', 'Service Satisfaction Survey (IKM)')}
        </h2>
        <div className="bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-2xl p-6">
          {ikmSubmitted ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
              <p className="font-bold text-gray-800 dark:text-slate-100">{t('Terima kasih atas penilaian Anda!', 'Thank you for your rating!')}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t('Masukan Anda sangat berarti untuk peningkatan layanan.', 'Your feedback is valuable for service improvement.')}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-5">
                {IKM_ASPEK.map(a => (
                  <div key={a.aspek} className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-sm text-gray-700 dark:text-slate-300 flex-1">{t(a.aspek, a.aspekEn)}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button"
                          onClick={() => setIkmRating(p=>({...p,[a.aspek]:s}))}
                          onMouseEnter={() => setIkmHover(p=>({...p,[a.aspek]:s}))}
                          onMouseLeave={() => setIkmHover(p=>({...p,[a.aspek]:0}))}
                          aria-label={`${s} ${t('bintang', 'stars')}`} className="focus:outline-none">
                          <Star size={24} fill={(ikmHover[a.aspek]||ikmRating[a.aspek]||0)>=s?'#f59e0b':'none'}
                            className={(ikmHover[a.aspek]||ikmRating[a.aspek]||0)>=s?'text-amber-400':'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={submitIkm}
                disabled={Object.keys(ikmRating).length < IKM_ASPEK.length}
                className="w-full py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-400 disabled:opacity-50 transition">
                {t('Kirim Penilaian', 'Submit Rating')}
              </button>
            </>
          )}
        </div>
      </section>

      {/* Aspirasi */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-green-600 dark:text-green-400" /> {t('Sampaikan Aspirasi', 'Share Your Aspiration')}
        </h2>
        <div className="bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-slate-700 rounded-2xl p-6">
          {aspirasiSubmitted ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
              <p className="font-bold text-gray-800 dark:text-slate-100">{t('Aspirasi terkirim!', 'Aspiration submitted!')}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t('Aspirasi Anda akan dikaji dan menjadi bahan pertimbangan kebijakan.', 'Your aspiration will be reviewed and considered for policy decisions.')}</p>
              <button onClick={() => { setAspirasiSubmitted(false); setAspirasiForm({topik:'',isi:'',nama:''}) }}
                className="mt-4 px-5 py-2 bg-green-700 text-white rounded-xl text-sm hover:bg-green-600 transition">
                {t('Kirim Aspirasi Lain', 'Submit Another Aspiration')}
              </button>
            </div>
          ) : (
            <form onSubmit={submitAspirasi} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('Topik', 'Topic')} <span className="text-red-500">*</span></label>
                <select value={aspirasiForm.topik} onChange={e=>setAspirasiForm(p=>({...p,topik:e.target.value}))}
                  className="w-full border border-green-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">-- {t('Pilih Topik', 'Select Topic')} --</option>
                  {TOPIK_LIST.map(topik => (
                    <option key={topik.id} value={topik.id}>{t(topik.id, topik.en)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('Aspirasi', 'Aspiration')} <span className="text-red-500">*</span></label>
                <textarea rows={4} value={aspirasiForm.isi} onChange={e=>setAspirasiForm(p=>({...p,isi:e.target.value}))}
                  placeholder={t('Tulis aspirasi atau saran Anda untuk pemerintah Gianyar...', 'Write your aspiration or suggestion for the Gianyar government...')}
                  className="w-full border border-green-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('Nama (opsional)', 'Name (optional)')}</label>
                <input type="text" value={aspirasiForm.nama} onChange={e=>setAspirasiForm(p=>({...p,nama:e.target.value}))}
                  placeholder={t('Nama Anda', 'Your Name')}
                  className="w-full border border-green-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <button type="submit" disabled={!aspirasiForm.topik || !aspirasiForm.isi.trim()}
                className="w-full py-2.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-600 disabled:opacity-50 transition">
                {t('Kirim Aspirasi', 'Submit Aspiration')}
              </button>
            </form>
          )}
        </div>
        <div className="mt-3 text-center">
          <a href="/musrenbang" className="text-sm text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
            {t('Atau usulkan program via Musrenbang Digital', 'Or propose a program via Digital Musrenbang')} <ChevronRight size={14} />
          </a>
        </div>
      </section>
    </div>
  )
}
