'use client'
import { useMemo, useState } from 'react'
import { MessageSquare, ThumbsUp, ChevronDown, ChevronUp, Send, Users, Calendar, MapPin } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

type Usulan = {
  id: number
  judul: string
  judulEn: string
  kategori: string
  kategoriEn: string
  kecamatan: string
  suara: number
  status: string
  statusEn: string
  deskripsi: string
  deskripsiEn: string
}

const USULAN: Usulan[] = [
  { id:1, judul:'Perbaikan Jalan Raya Tegallalang – Payangan', judulEn:'Road Repair: Tegallalang – Payangan Highway', kategori:'Infrastruktur', kategoriEn:'Infrastructure', kecamatan:'Tegallalang', suara:142, status:'DISETUJUI', statusEn:'APPROVED', deskripsi:'Jalan mengalami kerusakan parah di KM 3–7. Diperlukan perbaikan aspal dan drainase untuk kelancaran akses masyarakat dan wisatawan.', deskripsiEn:'The road is severely damaged at KM 3–7. Asphalt repair and drainage improvement are needed for public and tourist access.' },
  { id:2, judul:'Pembangunan Polindes Desa Mas', judulEn:'Construction of Village Clinic in Mas Village', kategori:'Kesehatan', kategoriEn:'Health', kecamatan:'Ubud', suara:98, status:'DIKAJI', statusEn:'UNDER REVIEW', deskripsi:'Desa Mas belum memiliki Poliklinik Desa (Polindes). Ibu hamil dan balita harus ke Puskesmas Ubud yang jaraknya 7km.', deskripsiEn:'Mas Village lacks a village clinic. Pregnant mothers and toddlers must travel 7km to Ubud Health Center.' },
  { id:3, judul:'Pengadaan Lampu Jalan Solar Panel Kecamatan Payangan', judulEn:'Solar Street Light Installation in Payangan District', kategori:'Infrastruktur', kategoriEn:'Infrastructure', kecamatan:'Payangan', suara:87, status:'DISETUJUI', statusEn:'APPROVED', deskripsi:'Sebanyak 15 titik jalan dusun di Payangan masih gelap di malam hari. Lampu solar panel hemat energi dan bebas kabel.', deskripsiEn:'15 village road spots in Payangan remain dark at night. Solar panel lights are energy-efficient and cable-free.' },
  { id:4, judul:'Pelatihan Digital Marketing UMKM Celuk', judulEn:'Digital Marketing Training for Celuk SMEs', kategori:'Ekonomi', kategoriEn:'Economy', kecamatan:'Sukawati', suara:74, status:'DIKAJI', statusEn:'UNDER REVIEW', deskripsi:'Perajin perak di Celuk kesulitan memasarkan produk secara online. Perlu pelatihan e-commerce dan media sosial.', deskripsiEn:'Silver craftsmen in Celuk struggle to market products online. E-commerce and social media training is needed.' },
  { id:5, judul:'Revitalisasi Pasar Tradisional Gianyar', judulEn:'Gianyar Traditional Market Revitalization', kategori:'Ekonomi', kategoriEn:'Economy', kecamatan:'Gianyar', suara:61, status:'PENDING', statusEn:'PENDING', deskripsi:'Pasar Gianyar butuh renovasi atap, sanitasi, dan penambahan lahan parkir agar lebih nyaman dan higienis.', deskripsiEn:'Gianyar Market needs roof renovation, sanitation, and additional parking to be more comfortable and hygienic.' },
  { id:6, judul:'Program Beasiswa SMA Berprestasi Kurang Mampu', judulEn:'Scholarship Program for Underprivileged High School Students', kategori:'Pendidikan', kategoriEn:'Education', kecamatan:'Blahbatuh', suara:55, status:'PENDING', statusEn:'PENDING', deskripsi:'Banyak siswa berprestasi dari keluarga kurang mampu di Blahbatuh terpaksa tidak melanjutkan ke SMA.', deskripsiEn:'Many high-achieving students from low-income families in Blahbatuh cannot continue to high school.' },
]

const STATUS_COLOR: Record<string,string> = {
  DISETUJUI: 'bg-green-100 text-green-700',
  DIKAJI: 'bg-amber-100 text-amber-700',
  PENDING: 'bg-gray-100 text-gray-500',
}

const KATEGORI_COLOR: Record<string,string> = {
  Infrastruktur: 'bg-blue-100 text-blue-700',
  Kesehatan: 'bg-red-100 text-red-700',
  Ekonomi: 'bg-orange-100 text-orange-700',
  Pendidikan: 'bg-purple-100 text-purple-700',
}

const KECAMATAN = ['Gianyar','Ubud','Sukawati','Blahbatuh','Tampaksiring','Tegallalang','Payangan']
const KATEGORI_LIST = [
  { id: 'Infrastruktur', en: 'Infrastructure' },
  { id: 'Kesehatan', en: 'Health' },
  { id: 'Pendidikan', en: 'Education' },
  { id: 'Ekonomi', en: 'Economy' },
  { id: 'Lingkungan', en: 'Environment' },
  { id: 'Sosial', en: 'Social' },
]

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

export default function MusrenbangPage() {
  const { t } = useLang()
  const [voted, setVoted] = useState<Set<number>>(() => new Set(readJson<number[]>('musrenbang:voted', [])))
  const [expanded, setExpanded] = useState<number|null>(null)
  const [form, setForm] = useState({judul:'',kategori:'',kecamatan:'',deskripsi:'',nama:'',noHp:''})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localUsulan, setLocalUsulan] = useState<Usulan[]>(() => readJson('musrenbang:usulan', []))

  const allUsulan = useMemo(() => [...localUsulan, ...USULAN], [localUsulan])

  function handleVote(id: number) {
    setVoted(p => {
      const next = new Set(p)
      if (next.has(id)) next.delete(id); else next.add(id)
      localStorage.setItem('musrenbang:voted', JSON.stringify(Array.from(next)))
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.judul.trim() || !form.kategori || !form.kecamatan || !form.deskripsi.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const item: Usulan = {
      id: Date.now(),
      judul: form.judul,
      judulEn: form.judul,
      kategori: form.kategori,
      kategoriEn: form.kategori,
      kecamatan: form.kecamatan,
      suara: 1,
      status: 'PENDING',
      statusEn: 'PENDING',
      deskripsi: form.deskripsi,
      deskripsiEn: form.deskripsi,
    }
    const next = [item, ...localUsulan].slice(0, 20)
    setLocalUsulan(next)
    localStorage.setItem('musrenbang:usulan', JSON.stringify(next))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageSquare size={24} className="text-green-700 dark:text-green-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t('Musrenbang Digital', 'Digital Development Planning')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t('Musyawarah Perencanaan Pembangunan — Kabupaten Gianyar 2026', 'Development Planning Deliberation — Gianyar Regency 2026')}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 my-6">
        <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-3">
          <Users size={20} className="text-blue-700 dark:text-blue-400" />
          <div><p className="text-xs text-gray-500 dark:text-slate-400">{t('Partisipan', 'Participants')}</p><p className="text-lg font-bold text-gray-800 dark:text-slate-100">1.248</p></div>
        </div>
        <div className="bg-green-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-3">
          <MessageSquare size={20} className="text-green-700 dark:text-green-400" />
          <div><p className="text-xs text-gray-500 dark:text-slate-400">{t('Usulan Masuk', 'Proposals Submitted')}</p><p className="text-lg font-bold text-gray-800 dark:text-slate-100">93</p></div>
        </div>
        <div className="bg-amber-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-3">
          <Calendar size={20} className="text-amber-700 dark:text-amber-400" />
          <div><p className="text-xs text-gray-500 dark:text-slate-400">{t('Batas Usulan', 'Submission Deadline')}</p><p className="text-sm font-bold text-gray-800 dark:text-slate-100">30 Apr 2026</p></div>
        </div>
      </div>

      {/* Usulan Populer */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Usulan Masyarakat', 'Community Proposals')}</h2>
        <div className="space-y-3">
          {allUsulan.map(u => (
            <div key={u.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-start gap-4">
                <button onClick={() => handleVote(u.id)}
                  className={`flex flex-col items-center px-3 py-2 rounded-xl border transition flex-shrink-0 ${voted.has(u.id)?'bg-blue-900 text-white border-blue-900':'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-blue-400'}`}>
                  <ThumbsUp size={16} />
                  <span className="text-xs font-bold mt-0.5">{u.suara + (voted.has(u.id)?1:0)}</span>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${KATEGORI_COLOR[u.kategori]??'bg-gray-100 text-gray-600'}`}>{t(u.kategori, u.kategoriEn)}</span>
                    <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin size={9}/> {u.kecamatan}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[u.status]}`}>{t(u.status, u.statusEn)}</span>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm">{t(u.judul, u.judulEn)}</p>
                  {expanded === u.id && <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 leading-relaxed">{t(u.deskripsi, u.deskripsiEn)}</p>}
                </div>
                <button onClick={() => setExpanded(expanded===u.id?null:u.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  {expanded===u.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form Usulan */}
      <section className="bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-1 flex items-center gap-2"><Send size={18} className="text-green-700 dark:text-green-400" /> {t('Sampaikan Usulan Anda', 'Submit Your Proposal')}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">{t('Usulan akan diverifikasi sebelum ditampilkan', 'Proposals will be verified before being displayed')}</p>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <ThumbsUp size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="font-bold text-gray-800 dark:text-slate-100 mb-1">{t('Usulan Terkirim!', 'Proposal Submitted!')}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{t('Tim kami akan memverifikasi usulan Anda dalam 2 hari kerja.', 'Our team will verify your proposal within 2 working days.')}</p>
            <button onClick={() => { setSubmitted(false); setForm({judul:'',kategori:'',kecamatan:'',deskripsi:'',nama:'',noHp:''}) }}
              className="mt-4 px-5 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition">
              {t('Kirim Usulan Lain', 'Submit Another Proposal')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('Judul Usulan', 'Proposal Title')} <span className="text-red-500">*</span></label>
              <input type="text" value={form.judul} onChange={e=>setForm(p=>({...p,judul:e.target.value}))} placeholder={t('Singkat dan jelas', 'Brief and clear')}
                className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('Kategori', 'Category')} <span className="text-red-500">*</span></label>
                <select value={form.kategori} onChange={e=>setForm(p=>({...p,kategori:e.target.value}))}
                  className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">-- {t('Pilih', 'Select')} --</option>
                  {KATEGORI_LIST.map(k=><option key={k.id} value={k.id}>{t(k.id, k.en)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('Kecamatan', 'District')} <span className="text-red-500">*</span></label>
                <select value={form.kecamatan} onChange={e=>setForm(p=>({...p,kecamatan:e.target.value}))}
                  className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">-- {t('Pilih', 'Select')} --</option>
                  {KECAMATAN.map(k=><option key={k} value={k}>{t('Kec.', 'Dist.')} {k}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('Deskripsi Usulan', 'Proposal Description')} <span className="text-red-500">*</span></label>
              <textarea rows={3} value={form.deskripsi} onChange={e=>setForm(p=>({...p,deskripsi:e.target.value}))}
                placeholder={t('Jelaskan masalah dan solusi yang diusulkan...', 'Explain the problem and proposed solution...')}
                className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('Nama (opsional)', 'Name (optional)')}</label>
                <input type="text" value={form.nama} onChange={e=>setForm(p=>({...p,nama:e.target.value}))} placeholder={t('Nama Anda', 'Your Name')}
                  className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('No. HP (opsional)', 'Phone No. (optional)')}</label>
                <input type="tel" value={form.noHp} onChange={e=>setForm(p=>({...p,noHp:e.target.value.replace(/\D/g,'').slice(0,15)}))} placeholder="08xxxxxxxxxx"
                  className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <button type="submit" disabled={loading || !form.judul.trim() || !form.kategori || !form.kecamatan || !form.deskripsi.trim()}
              className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-600 disabled:opacity-60 transition">
              {loading ? t('Mengirim...', 'Sending...') : t('Kirim Usulan', 'Submit Proposal')}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
