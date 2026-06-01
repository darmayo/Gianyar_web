'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Search, Globe, ChevronDown, AlertTriangle } from 'lucide-react'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'
import { useLang } from '@/contexts/LanguageContext'

// ── Mega Menu Structure ──────────────────────────────────────────
const MEGA_MENU = [
  {
    label: 'Profil', labelEn: 'About',
    items: [
      { href: '/profil',       label: 'Profil Daerah',      labelEn: 'Regional Profile',       sub: 'Sejarah & visi misi',    subEn: 'History & vision' },
      { href: '/pimpinan',     label: 'Pimpinan Daerah',    labelEn: 'Regional Leaders',       sub: 'Bupati, Wakil & SKPD',   subEn: 'Regent, Deputy & SKPD' },
      { href: '/organisasi',   label: 'Struktur Organisasi',labelEn: 'Org Structure',          sub: 'Perangkat daerah',       subEn: 'Regional apparatus' },
      { href: '/produk-hukum', label: 'Produk Hukum (JDIH)',labelEn: 'Legal Products (JDIH)', sub: 'Perda, Perbup, SK',       subEn: 'Regulations & decrees' },
    ],
  },
  {
    label: 'Layanan', labelEn: 'Services',
    items: [
      { href: '/layanan',          label: 'Dashboard Layanan', labelEn: 'Services Dashboard',  sub: 'Semua layanan',           subEn: 'All services' },
      { href: '/layanan/formulir', label: 'Formulir Pintar',   labelEn: 'Smart Forms',         sub: '8 jenis layanan',         subEn: '8 service types' },
      { href: '/layanan/ktp',      label: 'Permohonan KTP',    labelEn: 'ID Card Application', sub: 'e-KTP Dukcapil',          subEn: 'e-ID Dukcapil' },
      { href: '/layanan/kk',       label: 'Kartu Keluarga',    labelEn: 'Family Card',         sub: 'Buat/update KK',          subEn: 'Create/update' },
      { href: '/layanan/antrian',  label: 'Antrian Digital',   labelEn: 'Digital Queue',       sub: 'Ambil nomor antrian',     subEn: 'Get queue number' },
      { href: '/cek-pajak',        label: 'Cek Pajak PBB',     labelEn: 'Property Tax Check',  sub: 'Tagihan & status bayar',  subEn: 'Bills & payment status' },
    ],
  },
  {
    label: 'Informasi', labelEn: 'Info',
    items: [
      { href: '/berita',     label: 'Berita & Pengumuman', labelEn: 'News & Announcements', sub: 'Info terbaru',                subEn: 'Latest info' },
      { href: '/pariwisata', label: 'Pariwisata',          labelEn: 'Tourism',              sub: 'Destinasi, event & virtual tour', subEn: 'Destinations, events & virtual tour' },
      { href: '/umkm',       label: 'Direktori UMKM',      labelEn: 'SME Directory',        sub: 'Produk lokal unggulan',       subEn: 'Local featured products' },
      { href: '/lowongan',   label: 'Lowongan Kerja',      labelEn: 'Job Vacancies',        sub: 'Loker area Gianyar',          subEn: 'Jobs in Gianyar area' },
      { href: '/karier',     label: 'Karier & Relawan',    labelEn: 'Career & Volunteer',   sub: 'CPNS, PPPK, magang',          subEn: 'Civil service, PPPK, internship' },
      { href: '/investasi',  label: 'Investasi & Bisnis',  labelEn: 'Investment & Business',sub: 'Peluang investasi Gianyar',   subEn: 'Investment opportunities' },
    ],
  },
  {
    label: 'Data & Transparansi', labelEn: 'Data',
    items: [
      { href: '/statistik',   label: 'Statistik Publik',    labelEn: 'Public Statistics',    sub: 'Grafik & indikator',         subEn: 'Charts & indicators' },
      { href: '/transparansi',label: 'Transparansi APBD',   labelEn: 'Budget Transparency',  sub: 'Anggaran & realisasi',       subEn: 'Budget & realization' },
      { href: '/satu-data',   label: 'Satu Data Gianyar',   labelEn: 'One Data Gianyar',     sub: 'Big data sektoral',          subEn: 'Sectoral big data' },
      { href: '/peta',        label: 'Peta Digital (GIS)',  labelEn: 'Digital Map (GIS)',    sub: 'UMKM, wisata, infrastruktur', subEn: 'SME, tourism, infrastructure' },
      { href: '/smart-city',  label: 'Smart City',          labelEn: 'Smart City',           sub: 'CCTV & kualitas udara IoT',  subEn: 'CCTV & IoT air quality' },
      { href: '/kesehatan',   label: 'Kesehatan Publik',    labelEn: 'Public Health',        sub: 'RS, PMI & Puskesmas',        subEn: 'Hospitals, PMI & Puskesmas' },
    ],
  },
  {
    label: 'Interaksi', labelEn: 'Engage',
    items: [
      { href: '/pengaduan/buat',  label: 'Buat Pengaduan',      labelEn: 'Submit Complaint',       sub: 'SP4N-LAPOR Gianyar',         subEn: 'SP4N-LAPOR Gianyar' },
      { href: '/partisipasi',     label: 'Partisipasi Publik',   labelEn: 'Public Participation',   sub: 'Polling & IKM',              subEn: 'Polling & IKM' },
      { href: '/musrenbang',      label: 'Musrenbang Digital',   labelEn: 'Digital Musrenbang',     sub: 'Usulkan program',            subEn: 'Propose programs' },
      { href: '/faq',             label: 'FAQ',                  labelEn: 'FAQ',                    sub: 'Pertanyaan umum',            subEn: 'Frequently asked questions' },
      { href: '/keamanan-digital',label: 'Panduan Aman Digital', labelEn: 'Digital Safety Guide',  sub: 'Cyber hygiene & keamanan',   subEn: 'Cyber hygiene & security' },
      { href: '/chatbot',         label: 'Asisten Virtual AI',   labelEn: 'AI Virtual Assistant',  sub: 'Tanya layanan & informasi',  subEn: 'Ask about services & info' },
    ],
  },
]

// Secondary bar links
const UTIL_LINKS = [
  { href: '/cek-pajak',    label: 'Cek Pajak',      labelEn: 'Property Tax' },
  { href: '/lowongan',     label: 'Lowongan Kerja', labelEn: 'Job Vacancies' },
  { href: '/bpbd',         label: 'BPBD',           labelEn: 'BPBD' },
  { href: '/umkm',         label: 'UMKM',           labelEn: 'SME' },
  { href: '/transparansi', label: 'Transparansi',   labelEn: 'Transparency' },
  { href: '/peta',         label: 'Peta Digital',   labelEn: 'Digital Map' },
  { href: '/satu-data',    label: 'Satu Data',      labelEn: 'One Data' },
  { href: '/partisipasi',  label: 'Partisipasi',    labelEn: 'Participate' },
  { href: '/verifikasi',   label: 'Verifikasi Dok.',labelEn: 'Doc Verify' },
  { href: '/faq',          label: 'FAQ',            labelEn: 'FAQ' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { lang, setLang, t: L } = useLang()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-megamenu]')) setActiveMenu(null)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  function openMenu(label: string) {
    if (menuTimer.current) clearTimeout(menuTimer.current)
    setActiveMenu(label)
  }
  function closeMenu() {
    menuTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    const safe = query.trim().replace(/[<>"'&]/g, '').substring(0, 100)
    router.push(`/cari?q=${encodeURIComponent(safe)}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* ── Main Nav ── */}
      <nav aria-label={L('Navigasi utama', 'Main navigation')} className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold hover:opacity-90 transition flex-shrink-0" aria-label="Portal Kabupaten Gianyar — Beranda">
            <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 font-black text-xs" aria-hidden>GYR</div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight">{L('Kabupaten Gianyar', 'Gianyar Regency')}</div>
              <div className="text-xs text-blue-300 font-normal">{L('Pemerintah Daerah', 'Local Government')}</div>
            </div>
          </Link>

          {/* Desktop mega-menu */}
          <ul className="hidden lg:flex items-center gap-0.5 ml-3 flex-1" role="list" data-megamenu>
            {MEGA_MENU.map(menu => (
              <li key={menu.label} className="relative" data-megamenu>
                <button
                  onMouseEnter={() => openMenu(menu.label)}
                  onMouseLeave={closeMenu}
                  onClick={() => setActiveMenu(v => v === menu.label ? null : menu.label)}
                  aria-expanded={activeMenu === menu.label}
                  className="flex items-center gap-1 px-2.5 py-2 text-sm rounded hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 whitespace-nowrap"
                >
                  {L(menu.label, menu.labelEn)}
                  <ChevronDown size={13} className={`transition-transform ${activeMenu === menu.label ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {activeMenu === menu.label && (
                  <div
                    onMouseEnter={() => openMenu(menu.label)}
                    onMouseLeave={closeMenu}
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 min-w-[240px] z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
                    data-megamenu
                  >
                    {menu.items.map(item => (
                      <Link key={item.href} href={item.href}
                        onClick={() => setActiveMenu(null)}
                        className="flex items-start gap-2 px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 transition group">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">{L(item.label, item.labelEn)}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500">{L(item.sub, item.subEn)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}

            {/* Darurat — merah, prominent */}
            <li className="ml-1">
              <Link href="/darurat"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-red-600 hover:bg-red-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 whitespace-nowrap">
                <AlertTriangle size={14} />
                {L('Darurat', 'Emergency')}
              </Link>
            </li>
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button onClick={() => setSearchOpen(v => !v)} aria-label={L('Buka pencarian', 'Open search')} aria-expanded={searchOpen}
              className="p-2 rounded hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-yellow-300">
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <DarkModeToggle />
            <button onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              aria-label={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
              className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-semibold hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-yellow-300">
              <Globe size={14} aria-hidden />{lang === 'id' ? 'EN' : 'ID'}
            </button>
            <button aria-label={open ? L('Tutup menu','Close menu') : L('Buka menu','Open menu')} aria-expanded={open}
              aria-controls="mobile-menu" onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-yellow-300">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-blue-800 bg-blue-950">
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 py-3 flex gap-2" role="search">
              <label htmlFor="search-input" className="sr-only">{L('Cari di portal Gianyar','Search Gianyar portal')}</label>
              <input id="search-input" ref={searchRef} type="search" value={query} onChange={e => setQuery(e.target.value)}
                placeholder={L('Cari layanan, pajak, lowongan, bencana...','Search services, tax, jobs, emergency...')}
                maxLength={100}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-900 text-white placeholder-blue-300 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm" />
              <button type="submit" className="px-5 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300">
                {L('Cari','Search')}
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* ── Secondary Bar (Desktop) ── */}
      <div className="hidden lg:block bg-blue-950 border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-0.5 py-1 overflow-x-auto">
          {UTIL_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className="text-xs text-blue-400 hover:text-yellow-300 transition py-1 px-2.5 rounded hover:bg-blue-900 whitespace-nowrap">
              {L(l.label, l.labelEn)}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0 pl-4 border-l border-blue-800">
            <Link href="/layanan/antrian" className="text-xs text-yellow-300 hover:text-yellow-200 font-semibold py-1 px-2 whitespace-nowrap">
              ⚡ {L('Antrian Digital','Digital Queue')}
            </Link>
            <Link href="/akun/profil" className="text-xs text-blue-400 hover:text-yellow-300 transition py-1 px-2 whitespace-nowrap">
              {L('Akun Saya','My Account')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {open && (
        <div id="mobile-menu" className="bg-blue-900 border-t border-blue-800 lg:hidden max-h-[80vh] overflow-y-auto">
          {/* Darurat first on mobile */}
          <div className="px-4 pt-3 pb-1">
            <Link href="/darurat" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-500 transition">
              <AlertTriangle size={16} /> {L('🚨 Kontak Darurat','🚨 Emergency')}
            </Link>
          </div>

          <ul role="list" className="px-4 py-2 space-y-0.5">
            {MEGA_MENU.map(menu => (
              <li key={menu.label}>
                <button onClick={() => setMobileExpanded(v => v === menu.label ? null : menu.label)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded text-sm text-white font-medium hover:bg-blue-800 transition">
                  {L(menu.label, menu.labelEn)}
                  <ChevronDown size={14} className={`transition-transform ${mobileExpanded === menu.label ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded === menu.label && (
                  <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-blue-700 pl-3">
                    {menu.items.map(item => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => { setOpen(false); setMobileExpanded(null) }}
                          className="block px-2 py-1.5 rounded text-sm text-blue-300 hover:text-white hover:bg-blue-800 transition">
                          {L(item.label, item.labelEn)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="border-t border-blue-800 px-4 py-3 space-y-0.5">
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide px-3 mb-1">{L('Layanan Cepat', 'Quick Services')}</p>
            {UTIL_LINKS.slice(0, 6).map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-3 py-1.5 rounded text-sm text-blue-300 hover:bg-blue-800 hover:text-white transition">
                {L(l.label, l.labelEn)}
              </Link>
            ))}
            <Link href="/layanan/antrian" onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded text-sm text-yellow-300 font-semibold hover:bg-blue-800 transition">
              ⚡ {L('Antrian Digital','Digital Queue')}
            </Link>
            <Link href="/akun/profil" onClick={() => setOpen(false)}
              className="block px-3 py-1.5 rounded text-sm text-blue-300 hover:bg-blue-800 hover:text-white transition">
              {L('Akun Saya','My Account')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
