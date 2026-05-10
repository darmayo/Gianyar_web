'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Shield, Lock, Bell, Instagram, Facebook, Youtube, Twitter } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const SOSMED = [
  { label: 'Instagram', href: 'https://instagram.com/gianyarkab', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com/gianyarkab', Icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com/@gianyarkab', Icon: Youtube },
  { label: 'X (Twitter)', href: 'https://x.com/gianyarkab', Icon: Twitter },
]

const LINK_TERKAIT = [
  { label: 'LPSE Gianyar', href: 'https://lpse.gianyarkab.go.id', descId: 'Pengadaan Barang & Jasa', descEn: 'Public Procurement' },
  { label: 'JDIH Gianyar', href: 'https://jdih.gianyarkab.go.id', descId: 'Produk Hukum Daerah', descEn: 'Regional Legal Products' },
  { label: 'Open Data', href: 'https://data.gianyarkab.go.id', descId: 'Data Terbuka Pemerintah', descEn: 'Government Open Data' },
  { label: 'PPID', href: 'https://ppid.gianyarkab.go.id', descId: 'Informasi Publik', descEn: 'Public Information' },
]

function NewsletterForm() {
  const { t } = useLang()
  const [val, setVal] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const trimmed = val.trim()
    if (!trimmed) {
      setError(t('footer.newsletter_error_kosong'))
      return
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    const isWA = /^(\+62|62|0)[0-9]{8,13}$/.test(trimmed.replace(/[\s\-()]/g, ''))
    if (!isEmail && !isWA) {
      setError(t('footer.newsletter_error_format'))
      return
    }
    setDone(true)
  }

  return done ? (
    <p className="text-xs text-green-400 font-medium flex items-center gap-1.5">
      <span aria-hidden="true">✓</span> {t('footer.newsletter_sukses')} <strong className="truncate">{val}</strong>
    </p>
  ) : (
    <form onSubmit={submit} className="mt-2" noValidate>
      {error && (
        <p role="alert" className="text-xs text-red-400 mb-1.5 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
      <div className="flex gap-2">
        <label htmlFor="newsletter-input" className="sr-only">{t('footer.newsletter_title')}</label>
        <input
          id="newsletter-input"
          type="text"
          value={val}
          onChange={e => { setVal(e.target.value); setError('') }}
          placeholder={t('footer.newsletter_placeholder')}
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-error' : undefined}
          className="flex-1 bg-blue-900 border border-blue-700 rounded-lg px-3 py-2 text-xs text-white placeholder-blue-400 focus:outline-none focus:ring-1 focus:ring-yellow-300 min-w-0"
        />
        <button type="submit" className="flex-shrink-0 bg-yellow-400 text-blue-900 font-bold text-xs px-3 py-2 rounded-lg hover:bg-yellow-300 transition focus:outline-none focus:ring-2 focus:ring-yellow-300">
          {t('footer.newsletter_btn')}
        </button>
      </div>
    </form>
  )
}

export function Footer() {
  const { t } = useLang()

  const layananItems = [
    { id: 'ktp',    label: t('layanan.ktp') },
    { id: 'kk',     label: t('layanan.kk') },
    { id: 'akta',   label: t('layanan.akta') },
    { id: 'izin',   label: t('layanan.perizinan') },
    { id: 'aduan',  label: t('layanan.pengaduan') },
    { id: 'antri',  label: t('nav.submenu.antrian_digital') },
  ]

  return (
    <footer className="bg-blue-950 text-white mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Kolom 1: Identitas */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 font-black">
                GYR
              </div>
              <div>
                <p className="font-bold">{t('footer.nama')}</p>
                <p className="text-xs text-blue-400">{t('footer.sub')}</p>
              </div>
            </div>
            <p className="text-sm text-blue-300 leading-relaxed mb-4">
              {t('footer.deskripsi')}
            </p>
            {/* Social Media */}
            <div className="flex gap-3 mt-3">
              {SOSMED.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('Ikuti kami di', 'Follow us on')} ${s.label}`}
                  className="w-9 h-9 bg-blue-800 hover:bg-yellow-400 hover:text-blue-900 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  <s.Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 2: Layanan */}
          <div>
            <h3 className="font-semibold mb-4 text-yellow-300">{t('footer.layanan_publik')}</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              {layananItems.map((item) => (
                <li key={item.id}>
                  <Link href="/layanan" className="hover:text-white transition focus:outline-none focus:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Link Terkait */}
          <div>
            <h3 className="font-semibold mb-4 text-yellow-300">{t('footer.portal_terkait')}</h3>
            <ul className="space-y-3 text-sm">
              {LINK_TERKAIT.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-white transition focus:outline-none focus:underline"
                  >
                    {l.label}
                    <span className="block text-xs text-blue-500">{t(l.descId, l.descEn)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div>
            <h3 className="font-semibold mb-4 text-yellow-300">{t('footer.kontak')}</h3>
            <address className="not-italic text-sm text-blue-300 space-y-3">
              <p className="flex gap-2">
                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-yellow-400" aria-hidden="true" />
                Jl. Ngurah Rai No. 1, Gianyar, Bali 80511
              </p>
              <p className="flex gap-2">
                <Phone size={16} className="flex-shrink-0 mt-0.5 text-yellow-400" aria-hidden="true" />
                <a href="tel:+62361943049" className="hover:text-white transition">(0361) 943049</a>
              </p>
              <p className="flex gap-2">
                <Mail size={16} className="flex-shrink-0 mt-0.5 text-yellow-400" aria-hidden="true" />
                <a href="mailto:info@gianyarkab.go.id" className="hover:text-white transition break-all">
                  info@gianyarkab.go.id
                </a>
              </p>
            </address>

            <a
              href="https://maps.google.com/?q=Kantor+Bupati+Gianyar+Bali"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-xs bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-label={t('footer.maps')}
            >
              <MapPin size={12} aria-hidden="true" />
              {t('footer.maps')}
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-blue-900 mt-10 pt-8 mb-6">
          <div className="max-w-md mx-auto text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:max-w-none gap-6">
            <div className="mb-3 sm:mb-0">
              <p className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-white mb-0.5">
                <Bell size={14} className="text-yellow-400" /> {t('footer.newsletter_title')}
              </p>
              <p className="text-xs text-blue-400">{t('footer.newsletter_sub')}</p>
            </div>
            <div className="sm:w-80 flex-shrink-0">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Security badges + bottom links */}
        <div className="border-t border-blue-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-blue-400">
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-green-400" aria-hidden="true" />
              <span>{t('footer.ssl')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={12} className="text-green-400" aria-hidden="true" />
              <span>{t('footer.pdp')}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-blue-400 justify-center">
            <Link href="/kebijakan-privasi" className="hover:text-white transition focus:outline-none focus:underline">
              {t('footer.kebijakan')}
            </Link>
            <Link href="/syarat-ketentuan" className="hover:text-white transition focus:outline-none focus:underline">
              {t('footer.syarat')}
            </Link>
            <Link href="/aksesibilitas" className="hover:text-white transition focus:outline-none focus:underline">
              {t('footer.aksesibilitas')}
            </Link>
            <Link href="/sitemap" className="hover:text-white transition focus:outline-none focus:underline">
              {t('footer.peta_situs')}
            </Link>
            <Link href="/bug-bounty" className="hover:text-white transition focus:outline-none focus:underline flex items-center gap-1">
              <Shield size={11} aria-hidden="true" />
              Bug Bounty
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-blue-500 mt-4">
          © {new Date().getFullYear()} {t('footer.hak_cipta')}
        </div>
      </div>
    </footer>
  )
}
