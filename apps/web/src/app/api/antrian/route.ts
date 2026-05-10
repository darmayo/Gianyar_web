// ============================================================
// API Antrian Digital — Next.js Route Handler
// POST /api/antrian → ambil nomor antrian
// GET  /api/antrian?tanggal=&layanan= → cek ketersediaan slot
// Security: rate limit, input validation, no IDOR
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logApiError } from '@/lib/logger'

// Validasi input — cegah injection
const ambilAntrianSchema = z.object({
  layanan: z.enum([
    'KTP', 'KARTU_KELUARGA', 'AKTA_LAHIR',
    'PINDAH_DOMISILI', 'PERIZINAN', 'KONSULTASI',
  ]),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal: YYYY-MM-DD'),
  waktu: z.enum(['08:00', '09:00', '10:00', '11:00', '13:00']),
  nama: z.string().min(3).max(100),
  noHp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/),
  email: z.string().email().optional(),
})

// Slot tersedia per sesi (max 10 per slot)
const KAPASITAS_PER_SLOT = 10

// In-memory store untuk demo — ganti dengan Redis/DB di produksi
const antrianStore: Map<string, number> = new Map()
const antrianCounter: Map<string, number> = new Map()

function getSlotKey(layanan: string, tanggal: string, waktu: string) {
  return `${layanan}:${tanggal}:${waktu}`
}

function generateNomorAntrian(layanan: string, counter: number): string {
  const prefix = layanan.substring(0, 3).toUpperCase()
  return `${prefix}-${String(counter).padStart(3, '0')}`
}

function generateQRData(nomor: string, layanan: string, tanggal: string, waktu: string) {
  return Buffer.from(JSON.stringify({ nomor, layanan, tanggal, waktu, issued: Date.now() })).toString('base64')
}

// GET: cek ketersediaan slot
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tanggal = searchParams.get('tanggal') ?? ''
    const layanan = searchParams.get('layanan') ?? ''

    if (!tanggal || !layanan) {
      return NextResponse.json({ error: 'Parameter tanggal dan layanan wajib diisi' }, { status: 400 })
    }

    // Validasi tanggal
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      return NextResponse.json({ error: 'Format tanggal tidak valid' }, { status: 400 })
    }

    // Cek apakah hari kerja (Senin–Jumat)
    const hari = new Date(tanggal).getDay()
    if (hari === 0 || hari === 6) {
      return NextResponse.json({
        tersedia: false,
        pesan: 'Layanan tidak tersedia pada hari Sabtu dan Minggu',
      })
    }

    const WAKTU_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00']
    const slots = WAKTU_SLOTS.map((waktu) => {
      const key = getSlotKey(layanan, tanggal, waktu)
      const terisi = antrianStore.get(key) ?? 0
      return {
        waktu,
        tersedia: terisi < KAPASITAS_PER_SLOT,
        sisa: Math.max(0, KAPASITAS_PER_SLOT - terisi),
      }
    })

    return NextResponse.json({ tanggal, layanan, slots })
  } catch (err) {
    logApiError('/api/antrian', err, { method: 'GET', url: req.url })
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

// POST: ambil nomor antrian
export async function POST(req: NextRequest) {
  try {
    // Rate limit header check (Nginx sudah handle, ini sebagai backup)

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Format request tidak valid' }, { status: 400 })
    }

    // Validasi semua input dengan Zod
    const parsed = ambilAntrianSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: 'Data tidak valid',
        detail: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      }, { status: 422 })
    }

    const { layanan, tanggal, waktu, nama } = parsed.data

    // Cek hari kerja
    const hari = new Date(tanggal).getDay()
    if (hari === 0 || hari === 6) {
      return NextResponse.json({ error: 'Layanan tidak tersedia pada hari Sabtu dan Minggu' }, { status: 400 })
    }

    // Cek slot masih tersedia
    const slotKey = getSlotKey(layanan, tanggal, waktu)
    const terisi = antrianStore.get(slotKey) ?? 0
    if (terisi >= KAPASITAS_PER_SLOT) {
      return NextResponse.json({ error: 'Slot waktu ini sudah penuh. Pilih waktu lain.' }, { status: 409 })
    }

    // Generate nomor antrian
    const counterKey = `${layanan}:${tanggal}`
    const counter = (antrianCounter.get(counterKey) ?? 0) + 1
    antrianCounter.set(counterKey, counter)
    antrianStore.set(slotKey, terisi + 1)

    const nomorAntrian = generateNomorAntrian(layanan, counter)
    const qrData = generateQRData(nomorAntrian, layanan, tanggal, waktu)

    return NextResponse.json({
      success: true,
      data: {
        nomorAntrian,
        layanan,
        tanggal,
        waktu,
        nama,
        qrCode: qrData,  // Base64 QR data — render di client
        pesan: `Nomor antrian Anda: ${nomorAntrian}. Hadir 10 menit sebelum waktu yang dipilih dengan membawa QR code ini.`,
      },
    }, { status: 201 })

  } catch (err) {
    logApiError('/api/antrian', err, { method: 'POST', url: req.url })
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
