'use client'
import { useState } from 'react'
import { X, MessageCircle, ChevronRight, ArrowLeft } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '62361943049'
type MenuLevel = 'main' | 'layanan' | 'pengaduan' | 'pajak'

interface MenuItem { label: string; sub?: string; action: string }
interface MenuDef { judul: string; items: MenuItem[] }

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false)
  const [level, setLevel] = useState<MenuLevel>('main')
  const { t } = useLang()

  // Menu didefinisikan di dalam komponen agar mengikuti bahasa aktif
  const MENU: Record<MenuLevel, MenuDef> = {
    main: {
      judul: t('wa.pilih_topik'),
      items: [
        { label: t('📋 Layanan Kependudukan', '📋 Civil Services'),     sub: t('KTP, KK, Akta', 'ID, Family Card, Certificate'), action: 'layanan'   },
        { label: t('📢 Pengaduan & Laporan', '📢 Complaints & Reports'), sub: t('Laporkan masalah', 'Report an issue'),           action: 'pengaduan' },
        { label: t('💰 Informasi Pajak PBB', '💰 Property Tax Info'),    sub: t('Cek & bayar pajak', 'Check & pay tax'),          action: 'pajak'     },
        { label: t('🏥 Layanan Kesehatan', '🏥 Health Services'),        sub: t('RS & Puskesmas', 'Hospital & Clinic'),           action: 'Halo, saya ingin informasi layanan kesehatan di Gianyar' },
        { label: t('🌴 Info Pariwisata', '🌴 Tourism Info'),              sub: t('Destinasi & event', 'Destinations & events'),    action: 'Halo, saya ingin info pariwisata Gianyar' },
        { label: t('💬 Chat Langsung', '💬 Live Chat'),                   sub: t('Bicara dengan petugas', 'Talk to an officer'),   action: 'Halo, saya butuh bantuan dari petugas Pemkab Gianyar' },
      ],
    },
    layanan: {
      judul: t('Layanan Kependudukan', 'Civil Services'),
      items: [
        { label: t('Buat / Perpanjang KTP', 'Create / Renew ID Card'),         action: 'Halo, saya ingin informasi syarat membuat/perpanjang KTP elektronik' },
        { label: t('Permohonan Kartu Keluarga', 'Family Card Application'),    action: 'Halo, saya ingin informasi cara mengurus Kartu Keluarga' },
        { label: t('Akta Kelahiran / Kematian', 'Birth / Death Certificate'),  action: 'Halo, saya ingin mengurus akta kelahiran/kematian' },
        { label: t('Pindah Domisili', 'Change of Address'),                    action: 'Halo, saya ingin informasi prosedur pindah domisili' },
        { label: t('Cek Antrian Digital', 'Check Digital Queue'),              action: 'Halo, saya ingin tahu cara ambil nomor antrian digital Dukcapil' },
      ],
    },
    pengaduan: {
      judul: t('Pengaduan & Laporan', 'Complaints & Reports'),
      items: [
        { label: t('Laporkan Kerusakan Jalan', 'Report Road Damage'),          action: 'Halo, saya ingin melaporkan kerusakan jalan di Gianyar' },
        { label: t('Laporan Fasilitas Publik', 'Report Public Facility Issue'),action: 'Halo, saya ingin melaporkan kerusakan fasilitas publik' },
        { label: t('Pengaduan Pelayanan', 'Service Complaint'),                action: 'Halo, saya ingin menyampaikan pengaduan pelayanan pemerintah' },
        { label: t('Cek Status Pengaduan', 'Check Complaint Status'),          action: 'Halo, saya ingin mengecek status pengaduan saya' },
      ],
    },
    pajak: {
      judul: t('Informasi Pajak PBB', 'Property Tax Info'),
      items: [
        { label: t('Cek Tagihan PBB', 'Check Property Tax Bill'),              action: 'Halo, saya ingin mengecek tagihan Pajak Bumi dan Bangunan saya' },
        { label: t('Cara Bayar Pajak Online', 'How to Pay Tax Online'),        action: 'Halo, saya ingin tahu cara pembayaran pajak PBB online' },
        { label: t('Keberatan / Pengurangan PBB', 'Tax Objection / Reduction'),action: 'Halo, saya ingin mengajukan keberatan atau pengurangan PBB' },
        { label: t('Sertifikat Bebas Pajak', 'Tax Clearance Certificate'),     action: 'Halo, saya ingin informasi sertifikat bebas tunggakan pajak' },
      ],
    },
  }

  function kirimPesan(pesan: string) {
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(pesan), '_blank', 'noopener,noreferrer')
    setOpen(false)
    setLevel('main')
  }

  function handleAction(action: string) {
    if (action in MENU) setLevel(action as MenuLevel)
    else kirimPesan(action)
  }

  const menu = MENU[level]
  const isMain = level === 'main'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div role="dialog" aria-modal="true" aria-label={t('wa.buka')}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-green-500 text-white p-3 flex items-center gap-2">
            {!isMain && (
              <button onClick={() => setLevel('main')} aria-label={t('wa.kembali')} className="p-1 hover:bg-green-600 rounded transition">
                <ArrowLeft size={15} />
              </button>
            )}
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">💬</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs leading-tight truncate">{menu.judul}</p>
              <p className="text-xs text-green-100">{t('wa.online')}</p>
            </div>
            <button onClick={() => { setOpen(false); setLevel('main') }} aria-label={t('wa.tutup')} className="p-1 hover:bg-green-600 rounded transition">
              <X size={15} />
            </button>
          </div>

          <div className="px-3 pt-3 pb-1">
            <div className="bg-gray-100 rounded-xl rounded-tl-none px-3 py-2 text-xs text-gray-700 inline-block max-w-[90%]">
              {isMain ? t('wa.pilih_topik') : t('wa.pilih_pertanyaan')}
            </div>
          </div>

          <div className="px-3 pb-2 space-y-1.5 mt-2 max-h-60 overflow-y-auto">
            {menu.items.map(item => (
              <button key={item.label} onClick={() => handleAction(item.action)}
                className="w-full text-left text-xs px-3 py-2.5 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl transition flex items-center justify-between gap-2 group">
                <div>
                  <span className="text-gray-800 font-medium">{item.label}</span>
                  {item.sub && <p className="text-gray-400 mt-0.5">{item.sub}</p>}
                </div>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-green-500 flex-shrink-0" />
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 pb-3">{t('wa.jam_operasional')}</p>
        </div>
      )}

      <button onClick={() => { setOpen(v => !v); if (open) setLevel('main') }}
        aria-label={open ? t('wa.tutup') : t('wa.buka')} aria-expanded={open}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300">
        {open ? <X size={24} /> : <MessageCircle size={26} fill="white" />}
      </button>
    </div>
  )
}
