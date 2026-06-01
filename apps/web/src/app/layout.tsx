import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Noto_Serif } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SkipToContent } from '@/components/ui/SkipToContent'
import { RunningText } from '@/components/ui/RunningText'
import { AccessibilityBar } from '@/components/ui/AccessibilityBar'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ToastContainer } from '@/components/ui/Toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Portal Resmi Kabupaten Gianyar',
    template: '%s | Kabupaten Gianyar',
  },
  description:
    'Portal satu pintu layanan publik, pengaduan masyarakat, dan informasi resmi Pemerintah Kabupaten Gianyar, Bali. Urus KTP, Kartu Keluarga, perizinan, dan pengaduan secara online.',
  keywords: [
    'Gianyar', 'Bali', 'layanan publik', 'pemerintah', 'KTP', 'pengaduan',
    'Ubud', 'pariwisata Gianyar', 'e-government',
  ],
  authors: [{ name: 'Pemerintah Kabupaten Gianyar' }],
  creator: 'Dinas Komunikasi dan Informatika Kabupaten Gianyar',
  publisher: 'Pemerintah Kabupaten Gianyar',
  // PWA manifest
  manifest: '/manifest.json',
  // Open Graph (SEO sosial media)
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://gianyarkab.go.id',
    siteName: 'Portal Kabupaten Gianyar',
    title: 'Portal Resmi Kabupaten Gianyar',
    description: 'Layanan publik digital Kabupaten Gianyar, Bali.',
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Resmi Kabupaten Gianyar',
    description: 'Layanan publik digital Kabupaten Gianyar, Bali.',
    site: '@gianyarkab',
  },
  robots: { index: true, follow: true },
  // Canonical untuk SEO lokal
  alternates: {
    canonical: 'https://gianyarkab.go.id',
    languages: { 'id-ID': 'https://gianyarkab.go.id', 'en-US': 'https://gianyarkab.go.id/en' },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a5276' },
    { media: '(prefers-color-scheme: dark)', color: '#0d2d40' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${notoSerif.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <Script src="/js/bootstrap.js" strategy="beforeInteractive" />
        {/* PWA iOS */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Gianyar" />
        {/* SEO Lokal */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'GovernmentOrganization',
              name: 'Pemerintah Kabupaten Gianyar',
              url: 'https://gianyarkab.go.id',
              logo: 'https://gianyarkab.go.id/icons/icon-512.png',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Jl. Ngurah Rai No. 1',
                addressLocality: 'Gianyar',
                addressRegion: 'Bali',
                postalCode: '80511',
                addressCountry: 'ID',
              },
              telephone: '+62361943049',
              email: 'info@gianyarkab.go.id',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 antialiased flex flex-col transition-colors duration-200">
        <Providers>
          <SkipToContent />
          {/* Running text ticker */}
          <RunningText />
          {/* Accessibility bar */}
          <AccessibilityBar />
          <Navbar />
          <Breadcrumb />
          <main id="main-content" tabIndex={-1} className="outline-none flex-1">
            {children}
          </main>
          <Footer />
          {/* WhatsApp floating button */}
          <WhatsAppFloat />
          {/* Toast notifikasi darurat */}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
