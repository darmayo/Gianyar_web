'use client'
import { useState } from 'react'
import { TrendingUp, MapPin, ExternalLink, Building2, Star, ChevronRight, Search } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const SEKTOR = [
  { nama:'Pariwisata & Hospitality', namaEn:'Tourism & Hospitality', potensi:'Rp 4,2 T', roi:'18–25%', lahan:'Tersedia 340 ha', lahanEn:'340 ha Available', risiko:'Rendah', risikoEn:'Low', deskripsi:'Akomodasi butik, glamping eco-resort, wellness retreat. Tingkat hunian rata-rata 78% sepanjang tahun.', deskripsiEn:'Boutique accommodation, eco-resort glamping, wellness retreat. Average occupancy rate of 78% year-round.', highlight:true },
  { nama:'Kerajinan & Industri Kreatif', namaEn:'Crafts & Creative Industry', potensi:'Rp 1,8 T', roi:'15–22%', lahan:'Kawasan Sukawati & Celuk', lahanEn:'Sukawati & Celuk Area', risiko:'Rendah', risikoEn:'Low', deskripsi:'Perhiasan perak, ukiran kayu, batik, anyaman lontar. Ekspor ke 45 negara. Didukung balai latihan kerja.', deskripsiEn:'Silver jewelry, wood carving, batik, palm weaving. Export to 45 countries. Supported by job training centers.' },
  { nama:'Agrowisata & Pertanian', namaEn:'Agrotourism & Agriculture', potensi:'Rp 890 M', roi:'12–18%', lahan:'Tegallalang, Payangan (890 ha)', lahanEn:'Tegallalang, Payangan (890 ha)', risiko:'Rendah–Menengah', risikoEn:'Low–Medium', deskripsi:'Sawah terasering wisata, coffee plantation, organic farm. Permintaan agrowisata naik 34% YoY.', deskripsiEn:'Terraced rice field tourism, coffee plantation, organic farm. Agrotourism demand up 34% YoY.' },
  { nama:'Teknologi & Digital', namaEn:'Technology & Digital', potensi:'Rp 560 M', roi:'20–40%', lahan:'Kawasan digital Gianyar', lahanEn:'Gianyar Digital Zone', risiko:'Menengah', risikoEn:'Medium', deskripsi:'Digital nomad hub, co-working space premium, startup studio. Infrastruktur fiber optik terpasang.', deskripsiEn:'Digital nomad hub, premium co-working space, startup studio. Fiber optic infrastructure installed.' },
  { nama:'Pendidikan & Seni Budaya', namaEn:'Education & Cultural Arts', potensi:'Rp 420 M', roi:'10–15%', lahan:'Ubud & sekitarnya', lahanEn:'Ubud & surroundings', risiko:'Rendah', risikoEn:'Low', deskripsi:'Sekolah seni internasional, retreat budaya, pusat bahasa, museum interaktif.', deskripsiEn:'International art schools, cultural retreats, language centers, interactive museums.' },
  { nama:'Energi Terbarukan', namaEn:'Renewable Energy', potensi:'Rp 1,1 T', roi:'14–20%', lahan:'Payangan & Tegallalang', lahanEn:'Payangan & Tegallalang', risiko:'Rendah', risikoEn:'Low', deskripsi:'Solar farm, micro-hydro, biogas. Dukungan insentif pajak daerah hingga 5 tahun.', deskripsiEn:'Solar farm, micro-hydro, biogas. Regional tax incentive support up to 5 years.' },
]

const INSENTIF = [
  { id: 1, id_text: 'Keringanan pajak daerah hingga 5 tahun untuk investasi di sektor prioritas', en_text: 'Regional tax relief up to 5 years for priority sector investments' },
  { id: 2, id_text: 'Kemudahan perizinan 1 pintu via OSS (Online Single Submission)', en_text: 'Single-door licensing via OSS (Online Single Submission)' },
  { id: 3, id_text: 'Lahan siap pakai dengan sertifikat HGB & HGU tersedia', en_text: 'Ready-to-use land with HGB & HGU certificates available' },
  { id: 4, id_text: 'Bantuan fasilitasi tenaga kerja lokal terlatih', en_text: 'Facilitation assistance for trained local workforce' },
  { id: 5, id_text: 'Dukungan infrastruktur: jalan akses, listrik, air bersih', en_text: 'Infrastructure support: access roads, electricity, clean water' },
  { id: 6, id_text: 'Program pendampingan dari Dinas Penanaman Modal DPMPTSP', en_text: 'Mentoring program from the Investment Office (DPMPTSP)' },
]

const UMKM_UNGGULAN = [
  { nama:'Celuk Silver Craft', produk:'Perhiasan perak & emas', produkEn:'Silver & gold jewelry', omzet:'Rp 4,2 M/bln', ekspor:true, wa:'6281234567890', rating:4.9 },
  { nama:'Ubud Batik Artisan', produk:'Batik tulis & cap premium', produkEn:'Premium hand-drawn & stamped batik', omzet:'Rp 2,8 M/bln', ekspor:true, wa:'6281234567891', rating:4.8 },
  { nama:'Mas Wood Carving', produk:'Ukiran kayu seni', produkEn:'Art wood carving', omzet:'Rp 3,5 M/bln', ekspor:true, wa:'6281234567892', rating:4.7 },
  { nama:'Gianyar Organic Farm', produk:'Sayuran organik & herbal', produkEn:'Organic vegetables & herbs', omzet:'Rp 1,9 M/bln', ekspor:false, wa:'6281234567893', rating:4.6 },
  { nama:'Dapur Bali Bu Ketut', produk:'Bumbu & makanan tradisional', produkEn:'Traditional spices & food', omzet:'Rp 1,4 M/bln', ekspor:false, wa:'6281234567894', rating:4.8 },
  { nama:'Tegallalang Agrotour', produk:'Paket wisata sawah & rafting', produkEn:'Rice field & rafting tour packages', omzet:'Rp 5,1 M/bln', ekspor:false, wa:'6281234567895', rating:4.9 },
]

export default function InvestasiPage() {
  const { t } = useLang()
  const [cari, setCari] = useState('')
  const filtered = UMKM_UNGGULAN.filter(u =>
    !cari || u.nama.toLowerCase().includes(cari.toLowerCase()) || u.produk.toLowerCase().includes(cari.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
          <TrendingUp size={24} className="text-emerald-700 dark:text-emerald-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t('Investasi & Bisnis', 'Investment & Business')}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t('Peluang investasi dan usaha di Kabupaten Gianyar, Bali', 'Investment and business opportunities in Gianyar Regency, Bali')}</p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-4 gap-3 my-6">
        {[
          { label: t('Total Investasi 2025', 'Total Investment 2025'), value:'Rp 8,4 T', sub:'+12% YoY' },
          { label: t('Proyek Aktif', 'Active Projects'), value:'247', sub: t('Berbagai sektor', 'Various sectors') },
          { label: t('Tenaga Kerja', 'Workforce'), value:'48.200', sub: t('Terlibat langsung', 'Directly involved') },
          { label: t('Rata-rata ROI', 'Average ROI'), value:'17,4%', sub: t('Per tahun', 'Per year') },
        ].map(k => (
          <div key={k.label} className="bg-emerald-50 dark:bg-slate-800 rounded-2xl p-4">
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{k.value}</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">{k.label}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Sektor Investasi */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{t('Sektor Investasi Unggulan', 'Key Investment Sectors')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEKTOR.map(s => (
            <div key={s.nama} className={`bg-white dark:bg-slate-800 border rounded-2xl p-5 shadow-sm hover:shadow-md transition ${s.highlight ? 'border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-200 dark:ring-emerald-800' : 'border-gray-100 dark:border-slate-700'}`}>
              {s.highlight && <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full mb-2 inline-block">⭐ {t('Prioritas', 'Priority')}</span>}
              <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-2">{t(s.nama, s.namaEn)}</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 leading-relaxed">{t(s.deskripsi, s.deskripsiEn)}</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t('Potensi', 'Potential'), val: s.potensi },
                  { label: t('ROI/thn', 'ROI/yr'), val: s.roi },
                  { label: t('Lokasi', 'Location'), val: t(s.lahan, s.lahanEn) },
                  { label: t('Risiko', 'Risk'), val: t(s.risiko, s.risikoEn) },
                ].map(d => (
                  <div key={d.label} className="bg-gray-50 dark:bg-slate-900 rounded-lg p-2">
                    <p className="text-xs text-gray-400 dark:text-slate-500">{d.label}</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-slate-300">{d.val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Insentif & Kemudahan */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-blue-700 dark:text-blue-400" /> {t('Insentif & Kemudahan Berinvestasi', 'Investment Incentives & Facilitation')}
        </h2>
        <div className="bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl p-6">
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {INSENTIF.map(i => (
              <div key={i.id} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>{t(i.id_text, i.en_text)}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://oss.go.id" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm bg-blue-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-800 transition font-medium">
              <ExternalLink size={14} /> {t('Daftar Izin via OSS', 'Register License via OSS')}
            </a>
            <a href="/layanan/formulir?jenis=PERIZINAN"
              className="flex items-center gap-2 text-sm border border-blue-900 dark:border-blue-600 text-blue-900 dark:text-blue-400 px-5 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition font-medium">
              <MapPin size={14} /> {t('Perizinan Lokal Gianyar', 'Gianyar Local Licensing')}
            </a>
          </div>
        </div>
      </section>

      {/* Katalog UMKM */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{t('Katalog UMKM Unggulan', 'Featured SME Catalog')}</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" value={cari} onChange={e=>setCari(e.target.value)} placeholder={t('Cari produk...', 'Search product...')}
              className="border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-48" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(u => (
            <div key={u.nama} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-slate-100">{u.nama}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{t(u.produk, u.produkEn)}</p>
                </div>
                {u.ekspor && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">🌍 {t('Ekspor', 'Export')}</span>}
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Star size={12} fill="#f59e0b" className="text-amber-400" />
                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{u.rating}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">{t('Omzet:', 'Revenue:')} {u.omzet}</span>
              </div>
              <a href={`https://wa.me/${u.wa}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-green-600 text-white text-xs font-medium rounded-xl hover:bg-green-500 transition">
                💬 {t('Hubungi via WhatsApp', 'Contact via WhatsApp')}
              </a>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="/umkm" className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
            {t('Lihat semua UMKM Gianyar', 'View all Gianyar SMEs')} <ChevronRight size={14} />
          </a>
        </div>
      </section>
    </div>
  )
}
